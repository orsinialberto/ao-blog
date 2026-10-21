import { LocalizedLink } from '@/components/LocalizedLink';
import { ALL_PLACES } from '@/data/routes';
import type { SupportedLocale } from '@/config/locales';
import { getTranslations } from '@/i18n';
import { fill } from './format';

type Props = {
  locale: SupportedLocale;
  /** 'pass' fills the Passes panel, 'poi' fills Saved places. */
  kind: 'pass' | 'poi';
  /** Which `?view=` the links should stay in. */
  view: 'passes' | 'saved';
  /** The id in `?place=`, already validated by the page. */
  selected?: string;
};

const entry =
  'row-press flex w-full items-baseline justify-between gap-2 rounded-md px-2 py-1.5 pointer-coarse:py-3 text-left text-[13px] text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink';
const activeEntry = 'bg-plate-blue font-semibold text-white hover:bg-plate-blue';

/** One component for two nav entries. The lists are global — every pass from
    every trip — because that is what makes them read as a collection rather
    than as a route's detail view. Passes are ordered by height, which is the
    only ordering anyone actually wants; places keep the order routes are
    declared in, so they come out grouped by trip without needing headers. */
export default function PlaceList({ locale, kind, view, selected }: Props) {
  const t = getTranslations(locale).onTheRoad;

  const places = ALL_PLACES.filter((place) => place.kind === kind);
  const ordered =
    kind === 'pass'
      ? [...places].sort((a, b) => (b.elevation ?? 0) - (a.elevation ?? 0))
      : places;

  return (
    <ul aria-label={t.placesLabel} className="flex w-full flex-col gap-0.5">
      {ordered.map((place) => {
        const active = place.id === selected;
        return (
          <li key={place.id}>
            <LocalizedLink
              scroll={false}
              href={
                active
                  ? `/on-the-road?view=${view}`
                  : `/on-the-road?view=${view}&place=${place.id}`
              }
              aria-current={active ? 'true' : undefined}
              className={`${entry} ${active ? activeEntry : ''}`}
            >
              <span>{place.name}</span>
              {place.elevation && (
                <span
                  className={`font-mono text-[11px] transition-colors duration-[120ms] ease-out-strong ${active ? 'text-white/80' : 'text-ink-soft'}`}
                >
                  {fill(t.metres, { m: place.elevation })}
                </span>
              )}
            </LocalizedLink>
          </li>
        );
      })}
    </ul>
  );
}
