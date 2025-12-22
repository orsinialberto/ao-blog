"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

interface TravelGalleryProps {
  images?: string[];
  title: string;
}

const HERO_ASPECT = "aspect-[4/3]";

export function TravelGallery({ images, title }: TravelGalleryProps) {
  const safeImages = useMemo(() => images ?? [], [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState<string | null>(null);
  const [canScrollThumbs, setCanScrollThumbs] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!fullImageOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullImageOpen(null);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = safeImages.findIndex((img) => img === fullImageOpen);
        const newIndex = currentIndex - 1 < 0 ? safeImages.length - 1 : currentIndex - 1;
        setFullImageOpen(safeImages[newIndex]);
      } else if (e.key === "ArrowRight") {
        const currentIndex = safeImages.findIndex((img) => img === fullImageOpen);
        const newIndex = currentIndex + 1 >= safeImages.length ? 0 : currentIndex + 1;
        setFullImageOpen(safeImages[newIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullImageOpen, safeImages]);

  const selectedImage = safeImages[selectedIndex];
  const remainingCount = safeImages.length - 1;

  const thumbnails = useMemo(() => safeImages, [safeImages]);

  useEffect(() => {
    if (!thumbnails.length) {
      return;
    }

    const element = thumbsRef.current;
    if (!element) {
      return;
    }

    const updateScrollState = () => {
      setCanScrollThumbs(element.scrollWidth > element.clientWidth + 8);
    };

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [thumbnails]);

  if (!safeImages.length) {
    return null;
  }

  const goTo = (direction: "next" | "prev") => {
    setSelectedIndex((current) => {
      if (direction === "next") {
        return current + 1 >= safeImages.length ? 0 : current + 1;
      }
      return current - 1 < 0 ? safeImages.length - 1 : current - 1;
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
            Galleria fotografica
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="rounded-full border border-brand-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-secondary transition hover:-translate-y-0.5"
            >
              Vedi tutte ({safeImages.length})
            </button>
          )}
        </div>
      </div>

      <div className={`relative overflow-hidden bg-slate-100 ${HERO_ASPECT}`}>
        <Image
          key={selectedImage}
          src={optimizeCloudinaryUrl(selectedImage, { width: 1200, quality: 85 })}
          alt={`${title} foto ${selectedIndex + 1}`}
          fill
          priority
          quality={85}
          className="object-cover cursor-pointer"
          sizes="(max-width: 768px) 100vw, 80vw"
          onClick={() => setFullImageOpen(selectedImage)}
        />

        {safeImages.length > 1 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
            <button
              type="button"
              aria-label="Foto precedente"
              className="pointer-events-auto hidden rounded-full bg-white/80 p-3 text-brand-primary shadow-card transition hover:-translate-x-1 md:block"
              onClick={() => goTo("prev")}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Foto successiva"
              className="pointer-events-auto hidden rounded-full bg-white/80 p-3 text-brand-primary shadow-card transition hover:translate-x-1 md:block"
              onClick={() => goTo("next")}
            >
              →
            </button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1 text-xs font-semibold text-white backdrop-blur">
          {selectedIndex + 1}/{safeImages.length}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="relative">
          {canScrollThumbs && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white/70 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/70 to-transparent" />
            </>
          )}
          <div
            ref={thumbsRef}
            className="flex gap-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
          {thumbnails.map((image, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-24 w-32 flex-shrink-0 overflow-hidden transition ${
                  isActive
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={optimizeCloudinaryUrl(image, { width: 256, quality: 70 })}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  loading="lazy"
                />
              </button>
            );
          })}
          </div>
          {canScrollThumbs && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
              <button
                type="button"
                aria-label="Scroll thumbnails indietro"
                className="pointer-events-auto hidden rounded-full bg-white/90 p-2 text-brand-primary shadow-card transition hover:-translate-x-1 md:block"
                onClick={() =>
                  thumbsRef.current?.scrollBy({
                    left: -thumbsRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Scroll thumbnails avanti"
                className="pointer-events-auto hidden rounded-full bg-white/90 p-2 text-brand-primary shadow-card transition hover:translate-x-1 md:block"
                onClick={() =>
                  thumbsRef.current?.scrollBy({
                    left: thumbsRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              Galleria completa
            </p>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="rounded-full border border-white/40 px-3 py-1 text-sm font-semibold"
            >
              Chiudi
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {safeImages.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer transition hover:scale-[1.02]"
                  onClick={() => setFullImageOpen(image)}
                >
                  <Image
                    src={optimizeCloudinaryUrl(image, { width: 800, quality: 80 })}
                    alt={`${title} foto ${index + 1}`}
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {fullImageOpen && (() => {
        const currentFullIndex = safeImages.findIndex((img) => img === fullImageOpen);
        const goToFullImage = (direction: "next" | "prev") => {
          const newIndex =
            direction === "next"
              ? currentFullIndex + 1 >= safeImages.length
                ? 0
                : currentFullIndex + 1
              : currentFullIndex - 1 < 0
                ? safeImages.length - 1
                : currentFullIndex - 1;
          setFullImageOpen(safeImages[newIndex]);
        };

        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur"
            onClick={() => setFullImageOpen(null)}
          >
            <button
              type="button"
              onClick={() => setFullImageOpen(null)}
              className="absolute right-6 top-6 rounded-full border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/80"
            >
              Chiudi
            </button>
            {safeImages.length > 1 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-6">
                <button
                  type="button"
                  aria-label="Foto precedente"
                  className="pointer-events-auto rounded-full bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToFullImage("prev");
                  }}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Foto successiva"
                  className="pointer-events-auto rounded-full bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToFullImage("next");
                  }}
                >
                  →
                </button>
              </div>
            )}
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <Image
                src={optimizeCloudinaryUrl(fullImageOpen, { width: 1920, quality: 90 })}
                alt={`${title} foto a dimensione originale`}
                width={1920}
                height={1080}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
                quality={90}
                sizes="90vw"
              />
            </div>
            {safeImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                {currentFullIndex + 1}/{safeImages.length}
              </div>
            )}
          </div>
        );
      })()}
    </section>
  );
}
