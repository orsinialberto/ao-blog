"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
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
  const [distributedColumns, setDistributedColumns] = useState<{
    mobile: Photo[][];
    tablet: Photo[][];
    desktop: Photo[][];
  } | null>(null);

  const goToNext = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex + 1 >= photos.length ? 0 : prevIndex + 1;
      setSelectedPhoto(photos[newIndex]);
      return newIndex;
    });
  }, [photos]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex - 1 < 0 ? photos.length - 1 : prevIndex - 1;
      setSelectedPhoto(photos[newIndex]);
      return newIndex;
    });
  }, [photos]);

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
  }, [selectedPhoto, goToNext, goToPrevious]);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  // Funzione per distribuire ciclicamente (fallback iniziale)
  const distributeInColumns = useCallback((numColumns: number) => {
    const columns: Photo[][] = Array.from({ length: numColumns }, () => []);
    photos.forEach((photo, index) => {
      columns[index % numColumns].push(photo);
    });
    return columns;
  }, [photos]);

  // Funzione per distribuire le foto in base all'altezza reale
  const distributeByHeight = useCallback((numColumns: number, imageHeights: Map<string, number>) => {
    const columns: Photo[][] = Array.from({ length: numColumns }, () => []);
    const columnHeights: number[] = Array(numColumns).fill(0);

    photos.forEach((photo) => {
      // Trova la colonna più corta
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Aggiungi la foto alla colonna più corta
      columns[shortestColumnIndex].push(photo);
      
      // Aggiorna l'altezza della colonna (usa altezza reale se disponibile, altrimenti stima)
      const height = imageHeights.get(photo.url) || 600; // default 600 se non ancora caricata
      columnHeights[shortestColumnIndex] += height;
    });

    return columns;
  }, [photos]);

  // Carica le immagini e misura le altezze per distribuzione ottimale
  useEffect(() => {
    if (photos.length === 0) return;

    // Inizializza con distribuzione ciclica
    setDistributedColumns({
      mobile: distributeInColumns(1),
      tablet: distributeInColumns(2),
      desktop: distributeInColumns(3),
    });

    const imageHeights = new Map<string, number>();
    let loadedCount = 0;
    const totalPhotos = photos.length;

    const checkAndRedistribute = () => {
      loadedCount++;
      // Ridistribuisci quando almeno il 50% delle immagini sono caricate o dopo 20 immagini
      const threshold = Math.min(totalPhotos, Math.max(20, Math.floor(totalPhotos * 0.5)));
      
      if (loadedCount >= threshold) {
        const mobileCols = distributeByHeight(1, imageHeights);
        const tabletCols = distributeByHeight(2, imageHeights);
        const desktopCols = distributeByHeight(3, imageHeights);
        
        setDistributedColumns({
          mobile: mobileCols,
          tablet: tabletCols,
          desktop: desktopCols,
        });
      }
    };

    // Carica e misura le immagini
    photos.forEach((photo) => {
      const img = new window.Image();
      const optimizedUrl = optimizeCloudinaryUrl(photo.url, { width: 800, quality: 75 });
      
      img.onload = () => {
        // Calcola l'altezza proporzionale per larghezza 800px (larghezza target)
        const aspectRatio = img.height / img.width;
        const displayHeight = 800 * aspectRatio;
        imageHeights.set(photo.url, displayHeight);
        checkAndRedistribute();
      };
      
      img.onerror = () => {
        // Fallback se l'immagine non carica
        imageHeights.set(photo.url, 600);
        checkAndRedistribute();
      };
      
      img.src = optimizedUrl;
    });
  }, [photos, distributeInColumns, distributeByHeight]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-muted">Nessuna foto disponibile</p>
      </div>
    );
  }

  // Usa le colonne distribuite o fallback ciclico
  const mobileColumns = distributedColumns?.mobile || distributeInColumns(1);
  const tabletColumns = distributedColumns?.tablet || distributeInColumns(2);
  const desktopColumns = distributedColumns?.desktop || distributeInColumns(3);

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
            className="relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group rounded-lg"
            onClick={() => handlePhotoClick(photo, index)}
          >
            <Image
              src={optimizedUrl}
              alt={`${photo.travelTitle} - ${photo.location}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading={isPriority ? "eager" : "lazy"}
              priority={isPriority}
            />
            {/* Overlay con info al hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 rounded-lg">
              <div className="text-white">
                <p className="font-semibold text-sm md:text-base text-white">{photo.travelTitle}</p>
                <p className="text-xs md:text-sm text-white/90">{photo.location}</p>
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
            <Image
              src={optimizeCloudinaryUrl(selectedPhoto.url, { width: 1920, quality: 90 })}
              alt={`${selectedPhoto.travelTitle} - ${selectedPhoto.location}`}
              width={1920}
              height={1080}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
              quality={90}
              sizes="90vw"
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

