'use client';

import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

export type InfoPage = {
  id: string;
  src: string;
  name: string;
  caption: string;
  text: string;
  /** Already resolved, e.g. "Vai a {name}" filled in — this component never
      touches translations, so it stays reusable outside `onTheRoad`. */
  goToLabel: string;
};

type Props = {
  pages: InfoPage[];
  prevLabel: string;
  nextLabel: string;
  groupLabel: string;
  /** Rendered absolutely over the photo, top-right corner. Passed in rather
      than built here so this component stays free of `Link`/i18n — see the
      module doc below. */
  closeButton: ReactNode;
};

const SWIPE_THRESHOLD_PX = 40;
const FADE_MS = 140;

const dotBase =
  "relative h-1.5 rounded-full before:absolute before:-inset-x-0.5 before:-inset-y-4 before:content-[''] transition-colors duration-200";
const fadeClass = 'transition-opacity [transition-duration:140ms]';

/** Photo, caption, text and pagination dots for the Info section's carousel.
    Dumb by design: every string it shows arrives already translated, so it
    carries no i18n dependency of its own. Navigable by dot, arrow, ←/→ and
    touch swipe — the Info block doesn't live at a URL, so the current page
    is plain client state, not a `?bike=` param.

    The photo box is `aspect-[4/3]`, the ratio four of the five bike photos
    already have, so those four fill it exactly with no crop and no letterbox.
    The fifth (a portrait shot) is shown whole via `object-contain`, and the
    gap that leaves is backed by the same photo blown up, blurred and
    darkened — not the flat grey a `bg-*` fallback would give — so the box
    never shows dead space regardless of the source ratio. */
export default function InfoCarousel({
  pages,
  prevLabel,
  nextLabel,
  groupLabel,
  closeButton,
}: Props) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const page = pages[index];

  function go(next: number) {
    const target = (next + pages.length) % pages.length;
    if (target === index) return;
    setFading(true);
    window.setTimeout(() => {
      setIndex(target);
      setFading(false);
    }, FADE_MS);
  }

  return (
    <div
      className="flex min-h-0 flex-1 touch-pan-y flex-col p-4 pt-3.5"
      role="group"
      aria-label={groupLabel}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
      }}
      onPointerDown={(event) => {
        swipeStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        if (!swipeStart.current) return;
        const dx = event.clientX - swipeStart.current.x;
        const dy = event.clientY - swipeStart.current.y;
        swipeStart.current = null;
        if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
          go(index + (dx < 0 ? 1 : -1));
        }
      }}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
    >
      <div className="bg-ink/5 relative aspect-[4/3] flex-none overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.src}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-[0.55] saturate-[1.2] ${fadeClass} ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.src}
          alt={page.name}
          className={`absolute inset-0 h-full w-full object-contain ${fadeClass} ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {closeButton}
        {pages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label={prevLabel}
              onClick={() => go(index - 1)}
              className="text-ink focus-visible:outline-ink absolute top-1/2 left-2 z-[3] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-sm before:absolute before:-inset-2.5 before:content-[''] hover:bg-white focus-visible:outline focus-visible:outline-2"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => go(index + 1)}
              className="text-ink focus-visible:outline-ink absolute top-1/2 right-2 z-[3] flex h-[26px] w-[26px] -translate-y-1/2 items-center justify-center rounded-full bg-white/75 shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-sm before:absolute before:-inset-2.5 before:content-[''] hover:bg-white focus-visible:outline focus-visible:outline-2"
            >
              <ChevronRightIcon />
            </button>
          </>
        ) : null}
      </div>
      <p
        className={`text-ink mt-2.5 flex-none text-center font-mono text-[13px] ${fadeClass} ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        {page.caption}
      </p>
      <div className="mt-2.5 min-h-0 flex-1 overflow-y-auto">
        {/* whitespace-pre-line: `text` carries `\n\n` between paragraphs (see
            `messages/*.json`) — a plain <p> would collapse those to nothing. */}
        <p
          className={`text-ink text-[13px] leading-relaxed whitespace-pre-line ${fadeClass} ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {page.text}
        </p>
      </div>
      {pages.length > 1 ? (
        <div className="mt-3 flex flex-none justify-center gap-1.5">
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-current={i === index}
              aria-label={p.goToLabel}
              onClick={() => go(i)}
              className={`${dotBase} ${i === index ? 'bg-plate-blue w-[18px]' : 'bg-ink/25 w-1.5'}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
