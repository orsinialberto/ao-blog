"use client";

import { useState } from "react";
import Image from "next/image";
import { BEARS } from "@/config/bears";

/**
 * The standing bear raises a beer when hovered (mouse) or tapped (touch).
 * Decorative easter egg, so it is hidden from assistive tech and not focusable.
 */
export function CheersBear({ className = "" }: { className?: string }) {
  const [cheers, setCheers] = useState(false);
  const { standing, beer } = BEARS;

  return (
    <div
      aria-hidden
      className={`cheers-bear relative cursor-pointer ${className}`}
      data-cheers={cheers || undefined}
      onClick={() => setCheers((value) => !value)}
    >
      <Image
        src={standing.src}
        alt=""
        width={standing.width}
        height={standing.height}
        className="h-auto w-full"
      />
      <Image
        src={beer.src}
        alt=""
        width={beer.width}
        height={beer.height}
        className="absolute inset-0 h-auto w-full"
      />
    </div>
  );
}
