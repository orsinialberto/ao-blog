"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FULL_PHOTO_WIDTHS } from "@/components/Lightbox";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/maps/icons";
import { useModalDialog } from "@/hooks/useModalDialog";
import { cloudinarySrcSet, optimizeCloudinaryUrl } from "@/lib/imageOptimization";

// Photos this many places from the open one get their full-size version, so a swipe finds it ready...
const FULL_RADIUS = 1;
// ...and this many their thumbnail, already in cache from the film sheet, shown while the full size loads.
const THUMBNAIL_RADIUS = 2;
// The URL follows the photo once the swipe has settled, not on every photo it passes.
const URL_DELAY_MS = 200;

/** The film-sheet thumbnail of a photo. The viewer reuses the same URL, so it comes from the cache. */
export function albumThumbnailUrl(photo: string) {
  return optimizeCloudinaryUrl(photo, { width: 400 });
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

interface AlbumViewerProps {
  photos: string[];
  /** The photo shown on open; afterwards the scroll position leads. */
  initialIndex: number;
  photoLabel: (index: number) => string;
  /** Called with the photo the viewer has settled on. */
  onBrowse: (index: number) => void;
  onClose: () => void;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
}

/**
 * Full-screen album viewer: the photos sit side by side in a horizontal scroller with
 * scroll snapping, so on touch screens the photo follows the finger with the native momentum.
 * Arrows and keys scroll it too, wrapping around at the ends.
 */
export function AlbumViewer({
  photos,
  initialIndex,
  photoLabel,
  onBrowse,
  onClose,
  closeLabel,
  previousLabel,
  nextLabel,
}: AlbumViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [startIndex] = useState(initialIndex);
  const [current, setCurrent] = useState(initialIndex);
  const canBrowse = photos.length > 1;

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) throw new Error("AlbumViewer: track element missing");
    track.scrollLeft = startIndex * track.clientWidth;
  }, [startIndex]);

  useEffect(() => {
    const timer = setTimeout(() => onBrowse(current), URL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [current, onBrowse]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = mod(index, photos.length);
      // Wrapping around jumps: sliding past every photo in between would be a blur.
      const jump =
        target !== index || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: target * track.clientWidth, behavior: jump ? "instant" : "smooth" });
    },
    [photos.length],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && canBrowse) goTo(current - 1);
      else if (e.key === "ArrowRight" && canBrowse) goTo(current + 1);
    },
    [onClose, goTo, current, canBrowse],
  );
  useModalDialog(dialogRef, closeButtonRef, handleKeyDown);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setCurrent(Math.min(Math.max(index, 0), photos.length - 1));
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photoLabel(current)}
      className="fixed inset-0 z-9999 bg-black/95"
    >
      <div
        ref={trackRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
      >
        {photos.map((photo, index) => (
          <Slide
            key={index}
            photo={photo}
            alt={photoLabel(index)}
            distance={Math.abs(index - current)}
            onClose={onClose}
          />
        ))}
      </div>

      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {closeLabel}
      </button>

      {canBrowse && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-6">
          <button
            type="button"
            aria-label={previousLabel}
            className="pointer-events-auto bg-black/60 p-4 text-white transition hover:bg-black/80 [&>svg]:size-6 hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => goTo(current - 1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            className="pointer-events-auto bg-black/60 p-4 text-white transition hover:bg-black/80 [&>svg]:size-6 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => goTo(current + 1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}

interface SlideProps {
  photo: string;
  alt: string;
  /** How many places this photo is from the open one. */
  distance: number;
  onClose: () => void;
}

function Slide({ photo, alt, distance, onClose }: SlideProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative h-full w-full shrink-0 snap-center snap-always"
      aria-hidden={distance !== 0}
      // The dark margin around the photo closes the viewer; the photo itself does not.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {distance <= THUMBNAIL_RADIUS && (
        // Both images fill the same box with object-contain, so the full size lands exactly on the thumbnail.
        <div className="absolute inset-x-[5vw] inset-y-[5vh]">
          {/* Plain imgs: next/image is unoptimized (static export) and would drop the srcset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={albumThumbnailUrl(photo)}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
          />
          {distance <= FULL_RADIUS && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizeCloudinaryUrl(photo, { width: 1600, quality: "auto" })}
              srcSet={cloudinarySrcSet(photo, FULL_PHOTO_WIDTHS)}
              sizes="90vw"
              alt={alt}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
