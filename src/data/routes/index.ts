import type { Place, Route } from './types';
import { ticinoVallese } from './ticino-vallese';
import { giauFalzaregoPordoi } from './giau-falzarego-pordoi';
import { grigioniTrentino } from './grigioni-trentino';
import { mortiroloSanMarcoTaleggio } from './mortirolo-sanmarco-taleggio';
import { paladeRomboBrennero } from './palade-rombo-brennero';
import { sommoPianDelleFugazze } from './sommo-pian-delle-fugazze';
import { parcoDelBeigua } from './parco-del-beigua';
import { malojaStelvioPalade } from './maloja-stelvio-palade';
import { presolanaVivione } from './presolana-vivione';
import { fedaiaSellarondaMendola } from './fedaia-sellaronda-mendola';
import { monteBaldoForra } from './monte-baldo-forra';
import { crocedomini } from './crocedomini';
import { oropaPanoramicaZegna } from './oropa-panoramica-zegna';
import { costaAzzurraVerdonBonette } from './costa-azzurra-verdon-bonette';
import { deltaPoValdorcia } from './delta-po-valdorcia';

export type { Place, Position, Route } from './types';

/** Adding a route: one import above, one entry here, and
    `onTheRoad.routes.<slug>` in BOTH message files. Nothing else. */
export const ROUTES: readonly Route[] = [
  ticinoVallese,
  giauFalzaregoPordoi,
  grigioniTrentino,
  mortiroloSanMarcoTaleggio,
  paladeRomboBrennero,
  sommoPianDelleFugazze,
  parcoDelBeigua,
  malojaStelvioPalade,
  presolanaVivione,
  fedaiaSellarondaMendola,
  monteBaldoForra,
  crocedomini,
  oropaPanoramicaZegna,
  costaAzzurraVerdonBonette,
  deltaPoValdorcia,
];

export type PlaceWithRoutes = Place & { routes: Route[] };

function samePlace(a: Place, b: Place): boolean {
  return (
    a.kind === b.kind &&
    a.name === b.name &&
    a.elevation === b.elevation &&
    a.at[0] === b.at[0] &&
    a.at[1] === b.at[1]
  );
}

/** Flattened for the two global lists, one entry per unique id. Two routes
    can legitimately share a physical place — a shared start/end town, say —
    by declaring it identically (same name/kind/at/elevation) in both routes'
    `places` array; it collapses into one entry here carrying every route
    that visits it, so Saved Places shows it once and selecting it can light
    up every track that passes through it. Same id with *different* content
    is a data mistake, not a shared place, and throws below. */
export const ALL_PLACES: readonly PlaceWithRoutes[] = (() => {
  const byId = new Map<string, PlaceWithRoutes>();
  let mismatch: string | undefined;

  for (const route of ROUTES) {
    for (const place of route.places) {
      const existing = byId.get(place.id);
      if (!existing) {
        byId.set(place.id, { ...place, routes: [route] });
      } else if (samePlace(existing, place)) {
        existing.routes.push(route);
      } else {
        mismatch ??= place.id;
      }
    }
  }

  if (mismatch) {
    throw new Error(
      `Place id "${mismatch}" is declared more than once in src/data/routes with different content. ` +
        'Two routes sharing a physical place must declare it identically (same name/kind/at/elevation) — ' +
        'give the mismatched one a different id instead.',
    );
  }

  return [...byId.values()];
})();

/** Allow-list for `?route=`. Same contract as `findView`:
    a value that is not in the list means "nothing selected", not "a selection
    with a made-up title". */
export function findRoute(slug?: string | null): Route | undefined {
  return ROUTES.find((route) => route.slug === slug);
}

/** Allow-list for `?place=`. Returns every route that visits it, so a caller
    can light up all of their tracks at once. */
export function findPlace(id?: string | null): PlaceWithRoutes | undefined {
  return ALL_PLACES.find((place) => place.id === id);
}
