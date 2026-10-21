import { Suspense } from 'react';
import type { SupportedLocale } from '@/config/locales';
import { getTranslations } from '@/i18n';
import WindowShell from '@/components/window/WindowShell';
import TrafficLights from '@/components/window/TrafficLights';
import MapCanvas from './MapCanvas';
import MapsPanels from './MapsPanels';
import MapsSidebar from './MapsSidebar';

type Props = {
  locale: SupportedLocale;
};

/** MapCanvas is the FIRST child and takes no prop derived from `searchParams`,
    and no `key`. That is what lets React keep the same instance across a soft
    navigation between `?view` values — otherwise every click on a nav entry
    would rebuild the map and throw the visitor back to the initial view. */
export default function MapsWindow({ locale }: Props) {
  const t = getTranslations(locale).onTheRoad;

  return (
    <WindowShell className="maps-window bg-board relative">
      {/* MapCanvas and MapsPanels call useSearchParams, which needs a Suspense
          boundary under static export. The boundary is a stable first child
          and never suspends on a search-param change, so the map instance is
          kept. The panels boundary falls back to the plain sidebar, so the
          prerendered page is not an empty box without JavaScript. */}
      <Suspense fallback={null}>
        <MapCanvas label={t.mapLabel} errorMessage={t.mapError} />
      </Suspense>
      <TrafficLights className="panel-glass absolute top-3 left-3 z-10 px-2.5 py-2 md:hidden" />
      <Suspense fallback={<MapsSidebar locale={locale} />}>
        <MapsPanels locale={locale} />
      </Suspense>
    </WindowShell>
  );
}
