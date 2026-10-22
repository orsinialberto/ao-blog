import type { ReactNode } from 'react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { CloseIcon } from './icons';

type Props = {
  title: string;
  closeLabel: string;
  /** The list of routes, places or passes, or Info's own placeholder. */
  children: ReactNode;
};

/** Panel two: routes, passes and saved places. A `<section>`, not a dialog:
    it is not modal, it does not trap focus, and Escape does not close it —
    the map behind it stays usable while it is open. Clicking the
    already-active entry is not a toggle; the ✕ is the way out, as in macOS
    Maps. Info doesn't use this panel — see `InfoBlock`.

    `z-10`: `.map-pin` (globals.css) carries its own `z-index: 1` that escapes
    into the page's root stacking context, since nothing between it and this
    panel establishes one of its own — without it, a marker near this panel's
    corner paints over it. Same reasoning as `MapsSidebar` and `InfoBlock`. */
export default function MapsPanel({ title, closeLabel, children }: Props) {
  return (
    <section
      aria-labelledby="maps-panel-title"
      className="panel-glass panel-enter absolute inset-x-3 top-[76px] z-10 flex h-[38dvh] flex-col p-3 md:inset-x-auto md:top-3 md:bottom-3 md:left-[206px] md:h-auto md:w-[232px]"
    >
      <header className="flex items-start justify-between gap-2 pb-2">
        <h2 id="maps-panel-title" className="text-ink text-base font-bold">
          {title}
        </h2>
        <LocalizedLink
          scroll={false}
          href="/on-the-road"
          aria-label={closeLabel}
          className="text-ink-soft hover:bg-ink/10 focus-visible:outline-ink relative flex h-5 w-5 items-center justify-center rounded-full before:absolute before:-inset-3 before:content-[''] focus-visible:outline focus-visible:outline-2"
        >
          <CloseIcon />
        </LocalizedLink>
      </header>
      <div className="text-ink-soft flex min-h-0 flex-1 flex-col overflow-y-auto text-xs">
        {children}
      </div>
    </section>
  );
}
