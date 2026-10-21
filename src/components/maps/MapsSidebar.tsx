import type { ComponentType } from 'react';
import { LocalizedLink } from '@/components/LocalizedLink';
import TrafficLights from '@/components/window/TrafficLights';
import type { SupportedLocale } from '@/config/locales';
import { getTranslations } from '@/i18n';
import { ON_THE_ROAD_VIEWS, type OnTheRoadView } from '@/config/on-the-road-nav';
import { FlagIcon, InfoIcon, PassIcon, RouteIcon } from './icons';

type Props = {
  locale: SupportedLocale;
  /** Undefined means no panel is open — no entry is highlighted. */
  active?: OnTheRoadView;
};

/** view → glyph. The icons live here and not in the config: importing
    components into `src/config/` would invert the layering the project
    already follows. */
const icons: Record<OnTheRoadView, ComponentType> = {
  saved: FlagIcon,
  routes: RouteIcon,
  passes: PassIcon,
  info: InfoIcon,
};

const entry =
  'row-press flex shrink-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 pointer-coarse:py-3 text-[13px] text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink';
const activeEntry = 'bg-plate-blue font-semibold text-white hover:bg-plate-blue';

/** Panel one: the traffic lights and the four sections. No search field and no
    heading above the list — decided on the mockups.

    `z-10`: `.map-pin` (globals.css) carries its own `z-index: 1` that escapes
    into the page's root stacking context, since nothing between it and this
    panel establishes one of its own — without an explicit z-index here, a
    marker near the sidebar's corner paints over it. Every floating panel in
    this window needs the same treatment; see `MapsPanel` and `InfoBlock`. */
export default function MapsSidebar({ locale, active }: Props) {
  const t = getTranslations(locale).onTheRoad;

  return (
    <div className="panel-glass absolute inset-x-3 bottom-3 z-10 flex flex-col gap-1 p-2.5 md:inset-x-auto md:top-3 md:bottom-3 md:left-3 md:w-[186px]">
      <TrafficLights className="hidden px-1 pt-1 pb-3 md:flex" />
      <nav
        aria-label={t.navLabel}
        className="flex flex-row gap-1 overflow-x-auto md:flex-col md:gap-0.5"
      >
        {ON_THE_ROAD_VIEWS.map((view) => {
          const Icon = icons[view];
          return (
            <LocalizedLink
              scroll={false}
              key={view}
              href={`/on-the-road?view=${view}`}
              aria-current={view === active ? 'page' : undefined}
              className={`${entry} ${view === active ? activeEntry : ''}`}
            >
              <Icon />
              {t.nav[view]}
            </LocalizedLink>
          );
        })}
      </nav>
    </div>
  );
}
