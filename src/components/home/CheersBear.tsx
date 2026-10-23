"use client";

import { useState } from "react";
import Image from "next/image";
import { BEARS, type BearName } from "@/config/bears";

interface CheersBearProps {
  /** Resting pose, and the pose crossfaded over it; both must share the same canvas size */
  from?: BearName;
  to?: BearName;
  /** The resting pose disappears while the other one shows, instead of staying underneath it */
  replace?: boolean;
  className?: string;
}

/**
 * The standing bear raises a beer when hovered (mouse) or tapped (touch).
 * Other pairs of poses work the same way (e.g. a snowball wind-up and throw).
 * Decorative easter egg, so it is hidden from assistive tech and not focusable.
 */
export function CheersBear({ from = "standing", to = "beer", replace = false, className = "" }: CheersBearProps) {
  const [cheers, setCheers] = useState(false);
  const standing = BEARS[from];
  const beer = BEARS[to];

  return (
    <div
      aria-hidden
      className={`cheers-bear relative cursor-pointer ${className}`}
      data-cheers={cheers || undefined}
      data-replace={replace || undefined}
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
