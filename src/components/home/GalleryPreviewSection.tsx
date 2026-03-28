"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Lightbox } from "@/components/Lightbox";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface GalleryPhoto {
  url: string;
  travelTitle: string;
  travelSlug: string;
}

interface GalleryPreviewSectionProps {
  photos: GalleryPhoto[];
  locale: SupportedLocale;
}

// Preload image for faster display
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function GalleryPreviewSection({ photos, locale }: GalleryPreviewSectionProps) {
  const t = getTranslations(locale);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefetchedImages = useRef<Set<string>>(new Set());

  const goToNext = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex + 1 >= photos.length ? 0 : prevIndex + 1;
      setSelectedPhoto(photos[newIndex]);
      setImageLoaded(false);
      return newIndex;
    });
  }, [photos]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex - 1 < 0 ? photos.length - 1 : prevIndex - 1;
      setSelectedPhoto(photos[newIndex]);
      setImageLoaded(false);
      return newIndex;
    });
  }, [photos]);

  // Prefetch fullscreen images for adjacent photos when one is selected
  useEffect(() => {
    if (!selectedPhoto || photos.length === 0) {
      return;
    }

    const prefetchAdjacentImages = async () => {
      const prevIndex = selectedIndex - 1 >= 0 ? selectedIndex - 1 : photos.length - 1;
      const nextIndex = selectedIndex + 1 < photos.length ? selectedIndex + 1 : 0;

      const imagesToPrefetch = [
        { photo: photos[prevIndex], index: prevIndex },
        { photo: photos[nextIndex], index: nextIndex },
      ];

      imagesToPrefetch.forEach(({ photo }) => {
        if (photo && !prefetchedImages.current.has(photo.url)) {
          const fullscreenUrl = optimizeCloudinaryUrl(photo.url, { width: 1920, quality: 90 });
          prefetchedImages.current.add(photo.url);
          preloadImage(fullscreenUrl).catch(() => {
            // Silently fail if prefetch fails
          });
        }
      });
    };

    prefetchAdjacentImages();
  }, [selectedPhoto, selectedIndex, photos]);

  // Prefetch fullscreen image when photo is selected (in background, doesn't block UI)
  useEffect(() => {
    if (!selectedPhoto) {
      setImageLoaded(false);
      return;
    }

    const fullscreenUrl = optimizeCloudinaryUrl(selectedPhoto.url, { width: 1920, quality: 90 });
    
    // Preload in background if not already prefetched
    if (!prefetchedImages.current.has(selectedPhoto.url)) {
      prefetchedImages.current.add(selectedPhoto.url);
      preloadImage(fullscreenUrl).catch(() => {
        // Silently fail if prefetch fails
      });
    }
  }, [selectedPhoto]);

  // Prefetch image on hover
  const handlePhotoHover = useCallback((photo: GalleryPhoto) => {
    if (!prefetchedImages.current.has(photo.url)) {
      const fullscreenUrl = optimizeCloudinaryUrl(photo.url, { width: 1920, quality: 90 });
      prefetchedImages.current.add(photo.url);
      preloadImage(fullscreenUrl).catch(() => {
        // Silently fail if prefetch fails
      });
    }
  }, []);

  const handlePhotoClick = (photo: GalleryPhoto, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
    setImageLoaded(false);
  };

  if (photos.length === 0) {
    return null;
  }

  const [mainPhoto, ...otherPhotos] = photos;

  return (
    <>
      <section className="relative overflow-hidden bg-slate-50 py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/gallery.JPG"
            alt={t.components.galleryPreviewSection.imageAlt}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/75 via-slate-200/65 to-slate-100/75" />
        </div>

        {/* Content */}
        <div className="relative space-y-8 mx-auto px-4 lg:px-24">
          <SectionHeader
            label={t.components.sectionHeader.photoGallery}
            linkText={t.components.sectionHeader.seeAllPhotos}
            linkHref="/galleria"
            dark={false}
          />

          <div className="space-y-4">
            {/* Main Photo - Large */}
            <button
              type="button"
              onClick={() => handlePhotoClick(mainPhoto, 0)}
              onMouseEnter={() => handlePhotoHover(mainPhoto)}
              className="relative block w-full aspect-[21/9] overflow-hidden rounded-xl shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer"
            >
              <Image
                src={optimizeCloudinaryUrl(mainPhoto.url, { width: 1600, quality: 85 })}
                alt={mainPhoto.travelTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 90vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-lg font-medium">{mainPhoto.travelTitle}</p>
              </div>
            </button>

            {/* Thumbnail Grid - Small photos below */}
            {otherPhotos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {otherPhotos.map((photo, i) => (
                  <button
                    key={`${photo.url}-${i}`}
                    type="button"
                    onClick={() => handlePhotoClick(photo, i + 1)}
                    onMouseEnter={() => handlePhotoHover(photo)}
                    className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <Image
                      src={optimizeCloudinaryUrl(photo.url, { width: 400, quality: 75 })}
                      alt={photo.travelTitle}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 20vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <Lightbox
          src={selectedPhoto.url}
          alt={selectedPhoto.travelTitle}
          onClose={() => setSelectedPhoto(null)}
          onPrevious={photos.length > 1 ? goToPrevious : undefined}
          onNext={photos.length > 1 ? goToNext : undefined}
          closeLabel={t.components.masonryGallery.close}
          previousLabel={t.components.masonryGallery.previousPhoto}
          nextLabel={t.components.masonryGallery.nextPhoto}
          loading={!imageLoaded}
          onImageLoad={() => setImageLoaded(true)}
          footer={
            <>
              <div className="mb-2 bg-black/60 px-4 py-2 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  {selectedPhoto.travelTitle}
                </p>
              </div>
              {photos.length > 1 && (
                <div className="text-xs text-white/60">
                  {new Intl.NumberFormat(locale).format(selectedIndex + 1)} / {new Intl.NumberFormat(locale).format(photos.length)}
                </div>
              )}
            </>
          }
        />
      )}
    </>
  );
}

