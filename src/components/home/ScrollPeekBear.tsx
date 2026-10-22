"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { BEARS } from "@/config/bears";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

// The bear starts walking in when the `after` element's bottom edge is this far below the top of the screen
// (in viewport heights), and takes this much scroll distance to get in place
const WALK_IN_START = 0.4;
const WALK_IN = 0.4;
// The bear walks out as its centre rises through this band of the viewport (0 = top edge)
const WALK_OUT = { from: 0, to: 0.15 };
// How far off the left edge the bear starts, as a share of its own width
const HIDDEN_SHIFT = 70;

/**
 * The hiking bear is tied to the scroll, like the notebook: it stays out of sight until the element
 * with id `after` is about to scroll off the top of the screen, then walks in from beyond the left edge,
 * and walks back out as it reaches the top of the screen. Scrolling back up plays it in reverse.
 * `--peek` (0 hidden .. 1 in place) is set on scroll; without JS or with reduced motion it stays at 1.
 */
export function ScrollPeekBear({ after, className = "" }: { after: string; className?: string }) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const trigger = document.getElementById(after);
    if (!slot || !trigger) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const walkedIn = smooth(clamp((WALK_IN_START * vh - trigger.getBoundingClientRect().bottom) / (WALK_IN * vh)));
      const { top, height } = slot.getBoundingClientRect();
      const centre = (top + height / 2) / vh;
      const walkedOut = smooth(clamp((centre - WALK_OUT.from) / (WALK_OUT.to - WALK_OUT.from)));
      slot.style.setProperty("--peek", String(Math.min(walkedIn, walkedOut)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [after]);

  const { src, width, height } = BEARS.hiker;

  return (
    <div
      ref={slotRef}
      aria-hidden
      className={`pointer-events-none [--peek:1] ${className}`}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="h-auto w-full"
        style={{
          opacity: "var(--peek)",
          translate: `calc((1 - var(--peek)) * -${HIDDEN_SHIFT}%) 0`,
        }}
      />
    </div>
  );
}
