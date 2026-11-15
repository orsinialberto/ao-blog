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
import { AlbumViewer, albumThumbnailUrl } from "@/components/gallery/AlbumViewer";
import { FILM_TILE } from "@/config/galleryDrawings";
import { useInView } from "@/hooks/useInView";
import {
  PER_STRIP_DESKTOP,
  PER_STRIP_MOBILE,
  easeTowards,
  emptyFrameIndex,
  frameSlot,
  hoverVelocity,
  isOnFilmBand,
  parsePhotoParam,
  releaseVelocity,
  slotPhoto,
  stripCount,
  trackShift,
} from "@/lib/galleryLogic";
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

// Hover drive speed at the strip's edges, in frames per second.
const HOVER_MAX_SPEED = 0.9;
// Fraction of the half-strip around the middle where the hover drive stands still.
const HOVER_DEAD_ZONE = 0.15;
// rAF pauses in background tabs: cap a single step so the ribbon does not jump on return.
const MAX_STEP_SECONDS = 0.1;
// Hover drive: time constant of its speed-up and slow-down, in seconds.
const HOVER_EASE_SECONDS = 0.25;
// Below this speed (frames per second) the ribbon is at rest.
const MIN_SPEED = 0.01;
// Touch: the first move this long (px) decides whether the gesture drags the film or scrolls.
const AXIS_SLOP_PX = 6;
// Glide after a flick: speed measured over the last moves, then decaying with this time constant.
const RELEASE_WINDOW_MS = 100;
const GLIDE_DECAY_SECONDS = 0.35;
const MIN_GLIDE_START = 0.5;
const MAX_GLIDE_SPEED = 12;

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

/** Hover drive speed for the mouse at (clientX, clientY), towards the side of the strip it is on.
    It runs only while the mouse is on the dark film: not on a photo, not on the paper
    above/below it, not between strips (0 there). */
function filmVelocity(element: Element | null, clientX: number, clientY: number) {
  if (!element || element.closest(".film-photo")) return 0;
  const frame = element.closest(".film-frame");
  const strip = element.closest<HTMLElement>(".film-strip");
  if (!frame || !strip) return 0;
  const frameBox = frame.getBoundingClientRect();
  if (!isOnFilmBand((clientY - frameBox.top) / frameBox.height, FILM_TILE.band)) return 0;
  const stripBox = strip.getBoundingClientRect();
  const xFraction = (clientX - stripBox.left) / stripBox.width;
  return hoverVelocity(xFraction, Number(strip.dataset.row), HOVER_MAX_SPEED, HOVER_DEAD_ZONE);
}

interface TouchDrag {
  id: number;
  row: number;
  startX: number;
  startY: number;
  startOffset: number;
  frameWidth: number;
  /** Decided on the first moves: "x" drags the film, "y" leaves the touch to the page scroll. */
  axis: "x" | "y" | null;
  /** Recent ribbon positions, for the glide speed on release. */
  samples: { time: number; value: number }[];
}

/**
 * Ribbon position in frames, driven by mouse hover (on the film) and touch drag (on a strip),
 * with a glide after a flick. Only whole-frame steps go through React state (which photo sits
 * in which frame); the slide in between is written straight to each track's transform, so the
 * strips re-render once per frame step instead of on every animation frame.
 */
function useRibbonOffset(sheetRef: RefObject<HTMLDivElement | null>) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!sheetRef.current) throw new Error("FilmSheet: sheet element missing");
    const sheet: HTMLDivElement = sheetRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let live = 0;
    // Frames per second; eased towards the hover target, or decaying after a flick.
    let velocity = 0;
    let motion: "hover" | "glide" | null = null;
    let animationFrame: number | null = null;
    let lastTime: number | null = null;
    let touch: TouchDrag | null = null;
    let touchTarget: EventTarget | null = null;
    let handledMove: Event | null = null;
    let dragged = false;
    let mouseOnSheet = false;
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
      const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_STEP_SECONDS);
      lastTime = time;
      if (motion === "hover") {
        // The mouse may be still while a photo slides under it: the drive eases out there.
        const target = mouseOnSheet
          ? filmVelocity(document.elementFromPoint(mouseX, mouseY), mouseX, mouseY)
          : 0;
        velocity = easeTowards(velocity, target, dt, HOVER_EASE_SECONDS);
        if (target === 0 && Math.abs(velocity) < MIN_SPEED) return stop();
      } else {
        velocity = easeTowards(velocity, 0, dt, GLIDE_DECAY_SECONDS);
        if (Math.abs(velocity) < MIN_SPEED) return stop();
      }
      moveTo(live + velocity * dt);
      animationFrame = requestAnimationFrame(tick);
    }

    function start(next: "hover" | "glide") {
      motion = next;
      if (animationFrame === null) animationFrame = requestAnimationFrame(tick);
    }

    function stop() {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      lastTime = null;
      motion = null;
      velocity = 0;
      setOffset(live);
    }

    function onPointerDown() {
      dragged = false;
    }

    function onMouseMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || reducedMotion.matches) return;
      mouseOnSheet = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (motion !== "hover" && filmVelocity(event.target as Element, mouseX, mouseY) !== 0) {
        start("hover");
      }
    }

    function onPointerLeave() {
      mouseOnSheet = false;
    }

    // Touch drag uses touch events, not pointer events: the page scroll is kept or cancelled
    // per gesture with preventDefault, which works in every browser (touch-action values do not).
    function onTouchStart(event: TouchEvent) {
      endTouch();
      if (event.touches.length !== 1) return; // a pinch is the browser's
      const strip = (event.target as Element).closest<HTMLElement>(".film-strip");
      const track = strip?.querySelector<HTMLElement>(".film-track");
      if (!strip || !track) return;
      // A touch on a gliding film catches it, and is not a tap on the photo under it.
      if (motion === "glide") {
        stop();
        dragged = true;
      }
      const point = event.touches[0];
      touch = {
        id: point.identifier,
        row: Number(strip.dataset.row),
        startX: point.clientX,
        startY: point.clientY,
        startOffset: live,
        frameWidth: track.offsetWidth / track.childElementCount,
        axis: null,
        samples: [{ time: event.timeStamp, value: live }],
      };
      // Touch events stay with their target. Frames are keyed by slot, so the frame under the
      // finger unmounts after a step or two and its events stop bubbling to the sheet: listen
      // on the target itself, which keeps receiving the rest of the touch.
      touchTarget = event.target;
      touchTarget?.addEventListener("touchmove", onTouchMove as EventListener, { passive: false });
      touchTarget?.addEventListener("touchend", onTouchEnd as EventListener);
      touchTarget?.addEventListener("touchcancel", onTouchEnd as EventListener);
    }

    function onTouchMove(event: TouchEvent) {
      // Heard on the target and, while it is attached, again on the sheet: handle it once.
      if (!touch || event === handledMove) return;
      handledMove = event;
      const point = Array.from(event.changedTouches).find((t) => t.identifier === touch?.id);
      if (!point) return;
      const dx = point.clientX - touch.startX;
      const dy = point.clientY - touch.startY;
      if (touch.axis === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_SLOP_PX) return;
        touch.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (touch.axis === "y") return;
      // Ours from here on: the page must not scroll while the film is dragged.
      if (event.cancelable) event.preventDefault();
      dragged = true;
      // Even rows run left as the offset grows, odd rows run right: the film follows the finger.
      const frames = (touch.row % 2 === 0 ? -dx : dx) / touch.frameWidth;
      moveTo(touch.startOffset + frames);
      touch.samples.push({ time: event.timeStamp, value: live });
      if (touch.samples.length > 8) touch.samples.shift();
    }

    function onTouchEnd(event: TouchEvent) {
      if (!touch) return;
      const flick = releaseVelocity(touch.samples, event.timeStamp, RELEASE_WINDOW_MS);
      const wasDrag = touch.axis === "x";
      endTouch();
      if (!wasDrag) return;
      velocity = Math.max(-MAX_GLIDE_SPEED, Math.min(MAX_GLIDE_SPEED, flick));
      if (!reducedMotion.matches && Math.abs(velocity) > MIN_GLIDE_START) start("glide");
      else stop();
    }

    function endTouch() {
      touchTarget?.removeEventListener("touchmove", onTouchMove as EventListener);
      touchTarget?.removeEventListener("touchend", onTouchEnd as EventListener);
      touchTarget?.removeEventListener("touchcancel", onTouchEnd as EventListener);
      touchTarget = null;
      touch = null;
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
      stop();
    }

    sheet.addEventListener("pointerdown", onPointerDown);
    sheet.addEventListener("pointermove", onMouseMove);
    sheet.addEventListener("pointerleave", onPointerLeave);
    sheet.addEventListener("touchstart", onTouchStart, { passive: true });
    // Also on the sheet from the start: browsers decide at touchstart, from the listeners
    // already there, whether the moves can be cancelled. Without one, preventDefault is ignored.
    sheet.addEventListener("touchmove", onTouchMove, { passive: false });
    sheet.addEventListener("click", onClickCapture, true);
    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      endTouch();
      sheet.removeEventListener("pointerdown", onPointerDown);
      sheet.removeEventListener("pointermove", onMouseMove);
      sheet.removeEventListener("pointerleave", onPointerLeave);
      sheet.removeEventListener("touchstart", onTouchStart);
      sheet.removeEventListener("touchmove", onTouchMove);
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

  return (
    <AlbumViewer
      photos={photos}
      initialIndex={openIndex}
      photoLabel={(index) => photoAlt(labels.photoAlt, title, index)}
      onBrowse={browsePhoto}
      onClose={closePhoto}
      closeLabel={labels.close}
      previousLabel={labels.previous}
      nextLabel={labels.next}
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
            src={albumThumbnailUrl(photos[photoIndex])}
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
