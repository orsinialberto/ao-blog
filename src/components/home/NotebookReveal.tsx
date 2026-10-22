"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => n * n * (3 - 2 * n);

/*
 * Geometry, in px of the 1280x832 notebook.png: the spine is at x=640. The closed cover is
 * 560x710 (notebook-closed.png), its spine edge 20px from its left, placed so that spine sits at 640.
 */
const COVER = { left: 620, top: 60, width: 560, height: 710 };
const SPINE_IN_COVER = 20;
const SPINE_X = 640;
// Once flipped, the cover's back face is mirrored about the spine: its local x lands at stage x = BACK_FACE_OFFSET + x
const BACK_FACE_OFFSET = 2 * SPINE_X - COVER.left - COVER.width;
const STAGE = { width: 1280, height: 832 };
// While closed, the stage is shifted left so the closed book (a single page) is centred
const CLOSED_SHIFT = -(260 / STAGE.width) * 100;

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/**
 * Pins the notebook while the page scrolls: the cover swings open around the spine like a book.
 * `leftPage` rides on the back of the cover, `rightPage` sits on the page underneath it; both are
 * laid out in the notebook's own coordinates (percentages and cqw of the 1280x832 notebook).
 * Without JS or with reduced motion, the CSS variable defaults show it fully open.
 */
interface NotebookRevealProps {
  leftPage: React.ReactNode;
  rightPage: React.ReactNode;
}

export function NotebookReveal({ leftPage, rightPage }: NotebookRevealProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const book = bookRef.current;
    if (!track || !book) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = track.getBoundingClientRect();
      const progress = clamp(-top / (height - window.innerHeight));
      const open = smooth(clamp(progress / 0.7));
      book.style.setProperty("--open", String(open));
      book.style.setProperty("--done", open === 1 ? "1" : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (reducedMotion.matches) return;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={trackRef} className="h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center px-6 pt-16">
        <div
          ref={bookRef}
          className="relative mx-auto w-full max-w-6xl aspect-[1280/832] @container [--open:1] [--done:1]"
        >
          <div
            className="absolute inset-0"
            style={{
              perspective: "2200px",
              transform: `translateX(calc((1 - var(--open)) * ${CLOSED_SHIFT}%))`,
            }}
          >
            {/* Right page: always there, the closed cover sits on top of it */}
            <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
              <OpenNotebook />
              {rightPage}
            </div>

            {/* Left page: takes over from the cover's back face once it has landed */}
            <div
              className="absolute inset-0"
              style={{ clipPath: "inset(0 50% 0 0)", opacity: "var(--done)" }}
            >
              <OpenNotebook />
              {leftPage}
            </div>

            {/* The cover: front is the closed notebook, back is the left page */}
            <div
              className="absolute"
              style={{
                left: pct(COVER.left, STAGE.width),
                top: pct(COVER.top, STAGE.height),
                width: pct(COVER.width, STAGE.width),
                height: pct(COVER.height, STAGE.height),
                transformOrigin: `${pct(SPINE_IN_COVER, COVER.width)} 50%`,
                transform: "rotateY(calc(var(--open) * -180deg))",
                transformStyle: "preserve-3d",
                opacity: "calc(1 - var(--done))",
              }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <Image
                  src="/images/notebook-closed.png"
                  alt=""
                  fill
                  sizes="(max-width: 1152px) 44vw, 504px"
                />
              </div>
              <div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div
                  className="absolute"
                  style={{
                    left: pct(-BACK_FACE_OFFSET, COVER.width),
                    top: pct(-COVER.top, COVER.height),
                    width: pct(STAGE.width, COVER.width),
                    height: pct(STAGE.height, COVER.height),
                  }}
                >
                  <OpenNotebook />
                  {leftPage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenNotebook() {
  return (
    <Image
      src="/images/notebook.png"
      alt=""
      fill
      className="object-fill"
      sizes="(max-width: 1152px) 100vw, 1152px"
    />
  );
}
