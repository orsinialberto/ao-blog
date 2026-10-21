import type { ReactNode } from 'react';

type Props = {
  /** Appended to the window box — layout and background belong to the caller. */
  className?: string;
  children: ReactNode;
};

/** The window box itself: one place for the size every window in this project
    shares. `FinderWindow` and `MapsWindow` both hang off it, so the gallery and
    the map cannot drift to different dimensions. */
/* Height: the blog's MainWrapper already pads the page by --header-height at
   the top, so the window takes the viewport minus that. On md+ the window is
   88dvh like in ao-board, minus half the header so it sits optically centred
   in the space between Header and Footer. */
export default function WindowShell({ className = '', children }: Props) {
  return (
    <div className="flex h-[calc(100dvh-var(--header-height))] w-full items-center justify-center overflow-hidden md:h-[calc(88dvh-var(--header-height)/2)]">
      <div
        className={`window-enter border-ink/15 h-full w-full overflow-hidden shadow-[0_26px_60px_rgba(0,0,0,0.26),0_6px_16px_rgba(0,0,0,0.14)] md:w-[92vw] md:max-w-[1600px] md:rounded-[11px] md:border ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
