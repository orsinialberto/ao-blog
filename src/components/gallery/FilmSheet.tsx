"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { Lightbox } from "@/components/Lightbox";
import { FILM_TILE } from "@/config/galleryDrawings";
import { useInView } from "@/hooks/useInView";
import {
  PER_STRIP_DESKTOP,
  PER_STRIP_MOBILE,
  emptyFrameIndex,
  frameSlot,
  isOnFilmBand,
  parsePhotoParam,
  slotPhoto,
  stripCount,
  trackShift,
} from "@/lib/galleryLogic";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { withBasePath } from "@/lib/paths";

interface FilmSheetLabels {
  close: string;
  previous: string;
  next: string;
  /** Contains the `{title}` and `{n}` placeholders. */
  photoAlt: string;
}

interface FilmSheetProps {
  title: string;
  photos: string[];
  labels: FilmSheetLabels;
}

const PHOTO_PARAM = "foto";
// The frames left over at the end of the ribbon show a bear each, in this order.
const FILM_BEARS = ["wave", "peace", "strong", "lookout"].map(
  (name) => `/images/galleria/film-bears/${name}.webp`,
);
const STRIP_TILTS = [-0.5, 0.4, -0.3];
const STRIP_STAGGER_SECONDS = 0.15;
// The strips on screen at load drop in with a staggered CSS animation, which needs no JavaScript:
// they show up before hydration. Further down they drop in on scroll, one at a time, with no delay.
const INTRO_STRIPS = 4;
// A strip starts dropping in this far below the viewport, so it is there when scrolled to.
const STRIP_REVEAL_MARGIN = "0px 0px 300px 0px";
const EAGER_STRIPS = 2;

const MOBILE_QUERY = "(max-width: 767px)";

// Hover drive speed, in frames per second.
const HOVER_SPEED = 0.45;
// rAF pauses in background tabs: cap a single step so the ribbon does not jump on return.
const MAX_STEP_SECONDS = 0.1;
// A touch that moves less than this is a tap, not a drag.
const TAP_SLOP_PX = 8;

function subscribeToMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Frames per strip: 3 below `md`, 5 otherwise (and on the first render). */
function usePerStrip() {
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
  return isMobile ? PER_STRIP_MOBILE : PER_STRIP_DESKTOP;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function photoAlt(template: string, title: string, index: number) {
  return template.replace("{title}", title).replace("{n}", String(index + 1));
}

/** The open photo lives in the URL (`?foto=3`, 1-based). The History API updates
    it without a router navigation; Next.js keeps `useSearchParams` in sync (and keeps
    our own keys in `history.state`). Opening pushes an entry, so Back closes the lightbox;
    browsing replaces it; closing goes back if the entry is ours. */
const PUSHED_BY_LIGHTBOX = "galleryLightbox";

function isOwnLightboxEntry() {
  return window.history.state?.[PUSHED_BY_LIGHTBOX] === true;
}

function openPhoto(index: number) {
  window.history.pushState({ [PUSHED_BY_LIGHTBOX]: true }, "", `?${PHOTO_PARAM}=${index + 1}`);
}

function browsePhoto(index: number) {
  window.history.replaceState(
    { [PUSHED_BY_LIGHTBOX]: isOwnLightboxEntry() },
    "",
    `?${PHOTO_PARAM}=${index + 1}`,
  );
}

function closePhoto() {
  if (isOwnLightboxEntry()) window.history.back();
  // Loaded with ?foto=: there is no entry of ours to go back to.
  else window.history.replaceState(null, "", window.location.pathname);
}

function trackTransform(offset: number, row: number, frameCount: number) {
  return `translateX(${(trackShift(offset, row) * 100) / frameCount}%)`;
}

/** The hover drive runs only while the mouse is on the dark film: not on a photo,
    not on the paper above/below it, not between strips. */
function isOverFilm(element: Element | null, clientY: number) {
  if (!element || element.closest(".film-photo")) return false;
  const frame = element.closest(".film-frame");
  if (!frame) return false;
  const box = frame.getBoundingClientRect();
  return isOnFilmBand((clientY - box.top) / box.height, FILM_TILE.band);
}

interface Drag {
  pointerId: number;
  row: number;
  startX: number;
  startY: number;
  startOffset: number;
  frameWidth: number;
}

/**
 * Ribbon position in frames, driven by mouse hover (on the film) and touch drag (on a strip).
 * Only whole-frame steps go through React state (which photo sits in which frame); the
 * slide in between is written straight to each track's transform, so the strips re-render
 * once per frame step instead of on every animation frame.
 */
function useRibbonOffset(sheetRef: RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!sheetRef.current) throw new Error("FilmSheet: sheet element missing");
    const sheet: HTMLDivElement = sheetRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let live = 0;
    let animationFrame: number | null = null;
    let lastTime: number | null = null;
    let drag: Drag | null = null;
    let dragged = false;
    let mouseX = 0;
    let mouseY = 0;

    function moveTo(next: number) {
      const stepChanged = Math.floor(next) !== Math.floor(live);
      // At a whole offset the edge frames are inert; they must not stay inert while sliding in.
      const leftRest = Number.isInteger(live) && !Number.isInteger(next);
      live = next;
      sheet.querySelectorAll<HTMLElement>(".film-track").forEach((track, row) => {
        track.style.transform = trackTransform(next, row, track.childElementCount);
      });
      // Same frame as the transform: otherwise the strip slides with the old photos for one paint.
      if (stepChanged || leftRest) flushSync(() => setOffset(next));
    }

    function tick(time: number) {
      if (lastTime !== null) {
        moveTo(live + HOVER_SPEED * Math.min((time - lastTime) / 1000, MAX_STEP_SECONDS));
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(tick);
      // The mouse may be still while a photo slides under it: stop on the frame it arrives.
      if (!isOverFilm(document.elementFromPoint(mouseX, mouseY), mouseY)) setMoving(false);
    }

    function setMoving(moving: boolean) {
      if (moving && animationFrame === null) {
        animationFrame = requestAnimationFrame(tick);
      } else if (!moving && animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        lastTime = null;
        setOffset(live);
      }
    }

    function onPointerDown(event: PointerEvent) {
      dragged = false;
      if (event.pointerType !== "touch") return;
      const strip = (event.target as Element).closest<HTMLElement>(".film-strip");
      const track = strip?.querySelector<HTMLElement>(".film-track");
      if (!strip || !track) return;
      drag = {
        pointerId: event.pointerId,
        row: Number(strip.dataset.row),
        startX: event.clientX,
        startY: event.clientY,
        startOffset: live,
        frameWidth: track.offsetWidth / track.childElementCount,
      };
    }

    function onTouchMove(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!dragged) {
        // Vertical moves are page scroll (touch-action: pan-y); the browser cancels the pointer.
        if (Math.abs(dx) < TAP_SLOP_PX || Math.abs(dx) < Math.abs(dy)) return;
        dragged = true;
      }
      // Even rows run left as the offset grows, odd rows run right: the film follows the finger.
      const frames = (drag.row % 2 === 0 ? -dx : dx) / drag.frameWidth;
      moveTo(drag.startOffset + frames);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") onTouchMove(event);
      else if (event.pointerType === "mouse") onMouseMove(event);
    }

    function onMouseMove(event: PointerEvent) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setMoving(!reducedMotion.matches && isOverFilm(event.target as Element, event.clientY));
    }

    function onPointerEnd(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag = null;
      setOffset(live);
    }

    function onPointerLeave() {
      setMoving(false);
    }

    // Runs before React's onClick: a drag that ends on a photo must not open it,
    // and opening the lightbox (click or keyboard) stops the ribbon.
    function onClickCapture(event: MouseEvent) {
      if (!(event.target as Element).closest(".film-photo")) return;
      // detail is 0 for a keyboard click, which is never the end of a drag.
      if (dragged && event.detail !== 0) {
        dragged = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      setMoving(false);
    }

    sheet.addEventListener("pointerdown", onPointerDown);
    sheet.addEventListener("pointermove", onPointerMove);
    sheet.addEventListener("pointerup", onPointerEnd);
    sheet.addEventListener("pointercancel", onPointerEnd);
    sheet.addEventListener("pointerleave", onPointerLeave);
    sheet.addEventListener("click", onClickCapture, true);
    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      sheet.removeEventListener("pointerdown", onPointerDown);
      sheet.removeEventListener("pointermove", onPointerMove);
      sheet.removeEventListener("pointerup", onPointerEnd);
      sheet.removeEventListener("pointercancel", onPointerEnd);
      sheet.removeEventListener("pointerleave", onPointerLeave);
      sheet.removeEventListener("click", onClickCapture, true);
    };
  }, [sheetRef]);

  return offset;
}

export function FilmSheet({ title, photos, labels }: FilmSheetProps) {
  const perStrip = usePerStrip();
  const sheetRef = useRef<HTMLDivElement>(null);
  const offset = useRibbonOffset(sheetRef);
  const rows = stripCount(photos.length, perStrip);

  return (
    <>
      <div ref={sheetRef} className="film-sheet">
        {Array.from({ length: rows }, (_, row) => (
          <FilmStrip
            key={row}
            row={row}
            offset={offset}
            perStrip={perStrip}
            photos={photos}
            photoLabel={(index) => photoAlt(labels.photoAlt, title, index)}
            onOpen={openPhoto}
          />
        ))}
      </div>

      {/* useSearchParams needs a Suspense boundary; keeping it around the lightbox
          only lets the strips render in the static HTML. */}
      <Suspense fallback={null}>
        <AlbumLightbox title={title} photos={photos} labels={labels} />
      </Suspense>
    </>
  );
}

function AlbumLightbox({ title, photos, labels }: FilmSheetProps) {
  const searchParams = useSearchParams();
  const openIndex = parsePhotoParam(searchParams.get(PHOTO_PARAM), photos.length);
  if (openIndex === null) return null;
  const canBrowse = photos.length > 1;

  return (
    <Lightbox
      src={photos[openIndex]}
      alt={photoAlt(labels.photoAlt, title, openIndex)}
      onClose={closePhoto}
      onPrevious={canBrowse ? () => browsePhoto(mod(openIndex - 1, photos.length)) : undefined}
      onNext={canBrowse ? () => browsePhoto(mod(openIndex + 1, photos.length)) : undefined}
      closeLabel={labels.close}
      previousLabel={labels.previous}
      nextLabel={labels.next}
      swipe
    />
  );
}

interface FilmStripProps {
  row: number;
  offset: number;
  perStrip: number;
  photos: string[];
  photoLabel: (index: number) => string;
  onOpen: (index: number) => void;
}

function FilmStrip({ row, offset, perStrip, photos, photoLabel, onOpen }: FilmStripProps) {
  const [stripRef, inView] = useInView<HTMLDivElement>({ rootMargin: STRIP_REVEAL_MARGIN });
  const frameCount = perStrip + 1;
  const shift = trackShift(offset, row);
  const style = {
    "--tilt": `${STRIP_TILTS[row % STRIP_TILTS.length]}deg`,
    "--delay": `${row * STRIP_STAGGER_SECONDS}s`,
  } as CSSProperties;
  // Intro strips ignore inView: their animation runs on its own.
  const reveal = row < INTRO_STRIPS ? " film-strip-intro" : inView ? " is-visible" : "";

  return (
    <div
      ref={stripRef}
      className={`film-strip${reveal}`}
      style={style}
      data-row={row}
    >
      <div
        className="film-track"
        style={{
          width: `${(frameCount / perStrip) * 100}%`,
          transform: trackTransform(offset, row, frameCount),
        }}
      >
        {Array.from({ length: frameCount }, (_, k) => {
          const slot = frameSlot(offset, row, k, perStrip);
          // Frame k spans [k + shift, k + shift + 1] in visible-frame units; the strip shows [0, perStrip].
          const offScreen = k + shift + 1 <= 0 || k + shift >= perStrip;
          // Keyed by slot: on a step React keeps the frames (and their loaded images, and focus).
          return (
            <FilmFrame
              key={slot}
              slot={slot}
              photoIndex={slotPhoto(slot, photos.length, perStrip)}
              emptyIndex={emptyFrameIndex(slot, photos.length, perStrip)}
              photos={photos}
              offScreen={offScreen}
              eager={row < EAGER_STRIPS}
              photoLabel={photoLabel}
              onOpen={onOpen}
            />
          );
        })}
      </div>
    </div>
  );
}

interface FilmFrameProps {
  slot: number;
  photoIndex: number | null;
  /** Set when the frame has no photo: which of the empty trailing frames it is. */
  emptyIndex: number | null;
  photos: string[];
  offScreen: boolean;
  eager: boolean;
  photoLabel: (index: number) => string;
  onOpen: (index: number) => void;
}

function FilmFrame({
  slot,
  photoIndex,
  emptyIndex,
  photos,
  offScreen,
  eager,
  photoLabel,
  onOpen,
}: FilmFrameProps) {
  const tile = FILM_TILE.tiles[((slot % 2) + 2) % 2];
  const style = {
    aspectRatio: FILM_TILE.aspect,
    "--tile-image": `url(${withBasePath(FILM_TILE.src)})`,
    "--tile-size": tile.size,
    "--tile-position": tile.position,
  } as CSSProperties;

  const windowBox = {
    left: `${FILM_TILE.window.left}%`,
    top: `${FILM_TILE.window.top}%`,
    width: `${FILM_TILE.window.width}%`,
    height: `${FILM_TILE.window.height}%`,
  };

  return (
    <div className="film-frame" style={style} inert={offScreen}>
      {emptyIndex !== null && (
        <Image
          src={withBasePath(FILM_BEARS[emptyIndex % FILM_BEARS.length])}
          alt=""
          width={600}
          height={600}
          className="film-bear"
          style={windowBox}
        />
      )}
      {photoIndex !== null && (
        <button
          type="button"
          className="film-photo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          style={windowBox}
          onClick={() => onOpen(photoIndex)}
        >
          <Image
            src={optimizeCloudinaryUrl(photos[photoIndex], { width: 400 })}
            alt={photoLabel(photoIndex)}
            width={400}
            height={312}
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
        </button>
      )}
    </div>
  );
}
