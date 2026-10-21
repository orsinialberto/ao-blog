import { bikes } from '@/config/bikes';
import { supportedLocales } from '@/config/locales';
import { ON_THE_ROAD_VIEWS } from '@/config/on-the-road-nav';
import { ROUTES } from '@/data/routes';
import { getTranslations } from '@/i18n';

/** Routes, bikes and nav views are keyed by plain strings, so the compiler
    cannot see a missing translation. Run at build time by the page: fails the
    build, naming the missing key and locale, instead of shipping a raw key. */
export function assertOnTheRoadTranslations(): void {
  for (const locale of supportedLocales) {
    const t = getTranslations(locale).onTheRoad;
    const missing = (key: string) => {
      throw new Error(`Missing onTheRoad.${key} in ${locale}`);
    };

    for (const view of ON_THE_ROAD_VIEWS) {
      if (!t.nav[view]?.trim()) missing(`nav.${view}`);
    }
    for (const { slug } of ROUTES) {
      if (!t.routes[slug]?.trim()) missing(`routes.${slug}`);
    }
    for (const { id } of bikes) {
      for (const field of ['name', 'caption', 'text'] as const) {
        if (!t.bikes[id]?.[field]?.trim()) missing(`bikes.${id}.${field}`);
      }
    }
  }
}
