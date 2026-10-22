"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BEARS, type BearName } from "@/config/bears";

export type BearVariant = "rise" | "wave";

interface BearRevealProps {
  bear: BearName;
  variant?: BearVariant;
  /** Sizing and position of the slot the bear lives in */
  className?: string;
  id?: string;
}

/**
 * Decorative bear that plays its entrance once, the first time it scrolls into view.
 * Motion lives in globals.css (`.bear`); under reduced motion it only fades.
 */
export function BearReveal({ bear, variant = "rise", className = "", id }: BearRevealProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  const { src, width, height } = BEARS[bear];

  return (
    <div ref={slotRef} id={id} aria-hidden className={`pointer-events-none ${className}`}>
      <div className="bear" data-variant={variant} data-in-view={inView || undefined}>
        <Image src={src} alt="" width={width} height={height} className="h-auto w-full" />
      </div>
    </div>
  );
}
