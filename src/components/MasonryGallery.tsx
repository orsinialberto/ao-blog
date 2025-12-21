"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

interface Photo {
  url: string;
  travelTitle: string;
  travelSlug: string;
  location: string;
}

interface MasonryGalleryProps {
  photos: Photo[];
}

export default function MasonryGallery({ photos }: MasonryGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (!selectedPhoto) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto, selectedIndex, photos]);

  const goToNext = () => {
    const newIndex = selectedIndex + 1 >= photos.length ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex - 1 < 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-muted">Nessuna foto disponibile</p>
      </div>
    );
  }

  // Distribuisci le foto in colonne per mantenere l'ordine e riempire gli spazi
  const columnCount = { mobile: 1, tablet: 2, desktop: 3 };
  
  const distributeInColumns = (numColumns: number) => {
    const columns: Photo[][] = Array.from({ length: numColumns }, () => []);
    photos.forEach((photo, index) => {
      columns[index % numColumns].push(photo);
    });
    return columns;
  };

  const mobileColumns = distributeInColumns(columnCount.mobile);
  const tabletColumns = distributeInColumns(columnCount.tablet);
  const desktopColumns = distributeInColumns(columnCount.desktop);

  const renderColumn = (columnPhotos: Photo[], columnIndex: number, breakpoint: string) => (
    <div key={`${breakpoint}-col-${columnIndex}`} className="flex flex-col gap-2">
      {columnPhotos.map((photo) => {
        const index = photos.indexOf(photo);
        // Priorità solo alle prime 6 foto (visibili above the fold)
        const isPriority = index < 6;
        // URL ottimizzato per la galleria
        const optimizedUrl = optimizeCloudinaryUrl(photo.url, { width: 800, quality: 75 });
        
        return (
          <div
            key={`${photo.url}-${index}`}
            className="relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
            onClick={() => handlePhotoClick(photo, index)}
          >
            <Image
              src={optimizedUrl}
              alt={`${photo.travelTitle} - ${photo.location}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading={isPriority ? "eager" : "lazy"}
              priority={isPriority}
            />
            {/* Overlay con info al hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div className="text-white">
                <p className="font-semibold text-sm md:text-base">{photo.travelTitle}</p>
                <p className="text-xs md:text-sm opacity-90">{photo.location}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile: 1 colonna */}
      <div className="flex gap-2 md:hidden">
        {mobileColumns.map((col, i) => renderColumn(col, i, 'mobile'))}
      </div>

      {/* Tablet: 2 colonne */}
      <div className="hidden md:flex lg:hidden gap-2">
        {tabletColumns.map((col, i) => renderColumn(col, i, 'tablet'))}
      </div>

      {/* Desktop: 3 colonne */}
      <div className="hidden lg:flex gap-2">
        {desktopColumns.map((col, i) => renderColumn(col, i, 'desktop'))}
      </div>

      {/* Lightbox fullscreen */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-6 top-6 border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/80 z-10"
          >
            Chiudi
          </button>

          {/* Frecce di navigazione */}
          {photos.length > 1 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-6 z-10">
              <button
                type="button"
                aria-label="Foto precedente"
                className="pointer-events-auto bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80 hover:-translate-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Foto successiva"
                className="pointer-events-auto bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80 hover:translate-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                →
              </button>
            </div>
          )}

          <div className="relative max-h-[90vh] max-w-[90vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.url}
              alt={`${selectedPhoto.travelTitle} - ${selectedPhoto.location}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Info foto in basso */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <div className="bg-black/60 px-4 py-2 backdrop-blur mb-2">
              <p className="text-sm font-semibold text-white">
                {selectedPhoto.travelTitle}
              </p>
              <p className="text-xs text-white/80">{selectedPhoto.location}</p>
            </div>
            {photos.length > 1 && (
              <div className="text-xs text-white/60">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

