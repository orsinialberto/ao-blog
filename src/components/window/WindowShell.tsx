import type { ReactNode } from 'react';

type Props = {
  /** Appended to the window box — layout and background belong to the caller. */
  className?: string;
  children: ReactNode;
};

/** The window box itself: one place for the size of a window. `MapsWindow`
    hangs off it, so any future window shares the same dimensions. */
/* Height: the blog's MainWrapper already pads the page by --header-height at
   the top, so the window takes the viewport minus that. On md+ the window is
   88dvh minus half the header so it sits optically centred
   in the space between Header and Footer. */
export default function WindowShell({ className = '', children }: Props) {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] w-full items-center justify-center overflow-hidden md:overflow-visible md:h-[calc(88dvh-var(--header-height)/2)]">
      <div
        className={`window-enter border-ink/15 h-full w-full overflow-hidden shadow-[0_0_48px_rgba(0,0,0,0.16),0_26px_60px_rgba(0,0,0,0.2),0_6px_16px_rgba(0,0,0,0.12)] md:w-[92vw] md:max-w-[1600px] md:rounded-[11px] md:border ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
