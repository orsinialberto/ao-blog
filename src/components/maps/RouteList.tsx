import { LocalizedLink } from '@/components/LocalizedLink';
import { ROUTES } from '@/data/routes';
import type { SupportedLocale } from '@/config/locales';
import { getTranslations } from '@/i18n';
import { fill } from './format';

type Props = {
  locale: SupportedLocale;
  /** The slug in `?route=`, already validated by the page. */
  selected?: string;
};

const entry =
  'row-press flex w-full items-baseline justify-between gap-2 rounded-md px-2 py-1.5 pointer-coarse:py-3 text-left text-[13px] text-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink';
const activeEntry = 'bg-plate-blue font-semibold text-white hover:bg-plate-blue';

/** One entry per trip: its title and how long it was. Clicking the entry that
    is already active clears the selection, which is the only way back to the
    faint overview without closing the panel. */
export default function RouteList({ locale, selected }: Props) {
  const t = getTranslations(locale).onTheRoad;

  return (
    <ul aria-label={t.routesLabel} className="flex w-full flex-col gap-0.5">
      {ROUTES.map((route) => {
        const active = route.slug === selected;
        return (
          <li key={route.slug}>
            <LocalizedLink
              scroll={false}
              href={
                active
                  ? '/on-the-road?view=routes'
                  : `/on-the-road?view=routes&route=${route.slug}`
              }
              aria-current={active ? 'true' : undefined}
              className={`${entry} ${active ? activeEntry : ''}`}
            >
              <span>{t.routes[route.slug]}</span>
              <span
                className={`shrink-0 whitespace-nowrap font-mono text-[11px] transition-colors duration-[120ms] ease-out-strong ${active ? 'text-white/80' : 'text-ink-soft'}`}
              >
                {fill(t.km, { km: route.km })}
              </span>
            </LocalizedLink>
          </li>
        );
      })}
    </ul>
  );
}
