"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Lightbox } from "@/components/Lightbox";
import { FILM_TILE } from "@/config/galleryDrawings";
import { useInView } from "@/hooks/useInView";
import {
  PER_STRIP_DESKTOP,
  PER_STRIP_MOBILE,
  frameSlot,
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
const STRIP_TILTS = [-0.5, 0.4, -0.3];
const STRIP_STAGGER_SECONDS = 0.15;
// Strips further down drop in on scroll, one at a time: no point in waiting longer.
const MAX_STAGGERED_STRIPS = 4;
const EAGER_STRIPS = 2;

const MOBILE_QUERY = "(max-width: 767px)";

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
    it without a router navigation; Next.js keeps `useSearchParams` in sync. */
function showPhoto(index: number | null) {
  const url = index === null ? window.location.pathname : `?${PHOTO_PARAM}=${index + 1}`;
  window.history.replaceState(null, "", url);
}

export function FilmSheet({ title, photos, labels }: FilmSheetProps) {
  const perStrip = usePerStrip();
  // Ribbon position in frames. Fixed for now; scrolling the film will drive it.
  const [offset] = useState(0);
  const rows = stripCount(photos.length, perStrip);

  return (
    <>
      <div className="film-sheet">
        {Array.from({ length: rows }, (_, row) => (
          <FilmStrip
            key={row}
            row={row}
            offset={offset}
            perStrip={perStrip}
            photos={photos}
            photoLabel={(index) => photoAlt(labels.photoAlt, title, index)}
            onOpen={showPhoto}
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
      onClose={() => showPhoto(null)}
      onPrevious={canBrowse ? () => showPhoto(mod(openIndex - 1, photos.length)) : undefined}
      onNext={canBrowse ? () => showPhoto(mod(openIndex + 1, photos.length)) : undefined}
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
  const [stripRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const frameCount = perStrip + 1;
  const shift = trackShift(offset, row);
  const style = {
    "--tilt": `${STRIP_TILTS[row % STRIP_TILTS.length]}deg`,
    "--delay": `${Math.min(row, MAX_STAGGERED_STRIPS) * STRIP_STAGGER_SECONDS}s`,
  } as CSSProperties;

  return (
    <div ref={stripRef} className={`film-strip${inView ? " is-visible" : ""}`} style={style}>
      <div
        className="film-track"
        style={{
          width: `${(frameCount / perStrip) * 100}%`,
          transform: `translateX(${(shift * 100) / frameCount}%)`,
        }}
      >
        {Array.from({ length: frameCount }, (_, k) => {
          const slot = frameSlot(offset, row, k, perStrip);
          // Frame k spans [k + shift, k + shift + 1] in visible-frame units; the strip shows [0, perStrip].
          const offScreen = k + shift + 1 <= 0 || k + shift >= perStrip;
          return (
            <FilmFrame
              key={k}
              slot={slot}
              photoIndex={slotPhoto(slot, photos.length, perStrip)}
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
  photos: string[];
  offScreen: boolean;
  eager: boolean;
  photoLabel: (index: number) => string;
  onOpen: (index: number) => void;
}

function FilmFrame({ slot, photoIndex, photos, offScreen, eager, photoLabel, onOpen }: FilmFrameProps) {
  const tile = FILM_TILE.tiles[((slot % 2) + 2) % 2];
  const style = {
    aspectRatio: FILM_TILE.aspect,
    "--tile-image": `url(${withBasePath(FILM_TILE.src)})`,
    "--tile-size": tile.size,
    "--tile-position": tile.position,
  } as CSSProperties;

  return (
    <div className="film-frame" style={style} inert={offScreen}>
      {photoIndex !== null && (
        <button
          type="button"
          className="film-photo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          style={{
            left: `${FILM_TILE.window.left}%`,
            top: `${FILM_TILE.window.top}%`,
            width: `${FILM_TILE.window.width}%`,
            height: `${FILM_TILE.window.height}%`,
          }}
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
