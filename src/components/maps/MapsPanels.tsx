'use client';

import { useSearchParams } from 'next/navigation';
import type { SupportedLocale } from '@/config/locales';
import { findView } from '@/config/on-the-road-nav';
import { findPlace, findRoute } from '@/data/routes';
import { getTranslations } from '@/i18n';
import InfoBlock from './InfoBlock';
import MapsPanel from './MapsPanel';
import MapsSidebar from './MapsSidebar';
import PlaceList from './PlaceList';
import RouteList from './RouteList';

type Props = {
  locale: SupportedLocale;
};

/** Everything that depends on the URL lives here, so `MapCanvas` can stay free
    of URL-derived props. The selection is validated here as well as in
    `MapCanvas`: the panels and the map read the same URL independently, and
    neither should render a made-up selection. */
export default function MapsPanels({ locale }: Props) {
  const params = useSearchParams();
  const view = findView(params.get('view') ?? undefined);
  const route = findRoute(params.get('route'));
  const place = findPlace(params.get('place'));
  const t = getTranslations(locale).onTheRoad;

  return (
    <>
      <MapsSidebar locale={locale} active={view} />
      {view === 'info' ? <InfoBlock locale={locale} /> : null}
      {view && view !== 'info' ? (
        <MapsPanel title={t.nav[view]} closeLabel={t.closePanel}>
          {view === 'routes' ? (
            <RouteList locale={locale} selected={route?.slug} />
          ) : null}
          {view === 'passes' ? (
            <PlaceList locale={locale} kind="pass" view="passes" selected={place?.id} />
          ) : null}
          {view === 'saved' ? (
            <PlaceList locale={locale} kind="poi" view="saved" selected={place?.id} />
          ) : null}
        </MapsPanel>
      ) : null}
    </>
  );
}
