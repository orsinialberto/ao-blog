"use client";

import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/maps/icons";
import { useEffect, useCallback, useRef, type ReactNode } from "react";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  closeLabel: string;
  previousLabel?: string;
  nextLabel?: string;
  footer?: ReactNode;
  loading?: boolean;
  onImageLoad?: () => void;
}

function trapFocus(e: KeyboardEvent, dialog: HTMLElement | null) {
  const focusable = dialog?.querySelectorAll<HTMLElement>("button");
  if (!focusable?.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function Lightbox({
  src,
  alt,
  onClose,
  onPrevious,
  onNext,
  closeLabel,
  previousLabel,
  nextLabel,
  footer,
  loading,
  onImageLoad,
}: LightboxProps) {
  const showNavigation = Boolean(onPrevious && onNext);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrevious) onPrevious();
      else if (e.key === "ArrowRight" && onNext) onNext();
      else if (e.key === "Tab") trapFocus(e, dialogRef.current);
    },
    [onClose, onPrevious, onNext]
  );

  useEffect(() => {
    const opener = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 border border-white/40 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {closeLabel}
      </button>

      {showNavigation && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-6">
          <button
            type="button"
            aria-label={previousLabel}
            className="pointer-events-auto bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80 [&>svg]:size-6 hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious?.();
            }}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            className="pointer-events-auto bg-black/60 p-4 text-white backdrop-blur transition hover:bg-black/80 [&>svg]:size-6 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}

      <div className="relative max-h-[90vh] max-w-[90vw]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </div>
        )}
        <Image
          src={optimizeCloudinaryUrl(src, { width: 1920, quality: 90 })}
          alt={alt}
          width={1920}
          height={1080}
          className={`max-h-[90vh] max-w-[90vw] object-contain ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          onClick={(e) => e.stopPropagation()}
          onLoad={onImageLoad}
          quality={90}
          sizes="90vw"
          priority
        />
      </div>

      {footer && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          {footer}
        </div>
      )}
    </div>
  );
}
