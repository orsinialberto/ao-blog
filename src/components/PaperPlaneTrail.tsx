"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 3200;
const TRAIL_GAP_PX = 28;
const START_GAP_PX = 16;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

// Flies a paper plane in a loop to the right of the parent, leaving a dashed
// trail. The parent must be `relative`.
export function PaperPlaneTrail() {
  const rootRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const maskRef = useRef<SVGMaskElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const parent = root?.parentElement;
    const path = pathRef.current;
    const reveal = revealRef.current;
    const plane = planeRef.current;
    const mask = maskRef.current;
    if (!root || !parent || !path || !reveal || !plane || !mask) return;

    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    const x = w + START_GAP_PX;
    const d = `M ${x} ${h * 0.9} C ${x + h * 0.4} ${h * 0.9}, ${x + h * 0.9} ${h * 0.8}, ${x + h * 1.2} ${h * 0.5} C ${x + h * 1.5} ${h * 0.2}, ${x + h * 1.2} ${-h * 0.1}, ${x + h * 0.95} ${h * 0.1} C ${x + h * 0.7} ${h * 0.3}, ${x + h * 1.0} ${h * 0.7}, ${x + h * 1.4} ${h * 0.45} C ${x + h * 1.8} ${h * 0.2}, ${x + h * 2.1} ${h * 0.2}, ${x + h * 2.4} ${h * 0.1}`;
    path.setAttribute("d", d);
    reveal.setAttribute("d", d);
    mask.setAttribute("x", String(-w));
    mask.setAttribute("y", String(-h));
    mask.setAttribute("width", String(w * 3));
    mask.setAttribute("height", String(h * 3));

    const total = path.getTotalLength();

    const draw = (progress: number) => {
      const length = total * progress;
      const point = path.getPointAtLength(length);
      const ahead = path.getPointAtLength(Math.min(length + 1, total));
      const angle =
        (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${point.x} ${point.y}) rotate(${angle})`,
      );
      reveal.style.strokeDasharray = `${Math.max(length - TRAIL_GAP_PX, 0)} ${total}`;
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    const play = () => {
      root.style.opacity = "1";
      if (reduceMotion) {
        draw(1);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        draw(easeOut(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    draw(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.8 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible text-brand-muted opacity-0"
      width="100%"
      height="100%"
      style={{ transition: "opacity 150ms" }}
    >
      <defs>
        <mask ref={maskRef} id="plane-trail-mask" maskUnits="userSpaceOnUse">
          <path
            ref={revealRef}
            fill="none"
            stroke="white"
            strokeWidth={12}
          />
        </mask>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="7 9"
        opacity={0.3}
        mask="url(#plane-trail-mask)"
      />
      <g ref={planeRef}>
        <path
          d="M 18 0 L -14 -10 L -7 1 L -10 9 Z M 18 0 L -7 1 M -14 -10 L -7 1 L -10 9"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
          opacity={0.35}
        />
      </g>
    </svg>
  );
}
