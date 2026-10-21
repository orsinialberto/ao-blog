import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './monte-baldo-forra.track.json';

/** Gallarate → Peschiera del Garda → Monte Baldo ridge road (Bocca di Navene,
    Passo di San Valentino) → Malcesine → Nago-Torbole → Riva del Garda →
    Strada della Forra → Gallarate. The line is the actual ridden GPX track —
    see `monte-baldo-forra.track.json` and `npm run track:import` for how it
    got here. */
export const monteBaldoForra = {
  slug: 'monte-baldo-forra',
  km: 487,
  track: trackFrom(rawTrack, 'monte-baldo-forra'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'navene',
      kind: 'pass',
      name: 'Bocca di Navene',
      elevation: 1420,
      at: [10.87259, 45.78796],
    },
    {
      id: 'sanvalentino',
      kind: 'pass',
      name: 'Passo di San Valentino',
      elevation: 1314,
      at: [10.91216, 45.78312],
    },
    { id: 'forra', kind: 'poi', name: 'Strada della Forra', at: [10.7568, 45.77766] },
  ],
} satisfies Route;
