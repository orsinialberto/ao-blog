import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './presolana-vivione.track.json';

/** Gallarate → Passo della Presolana → Passo di Vivione → Cogolo. The line is
    the actual ridden GPX track — see `presolana-vivione.track.json` and
    `npm run track:import` for how it got here. */
export const presolanaVivione = {
  slug: 'presolana-vivione',
  km: 242,
  track: trackFrom(rawTrack, 'presolana-vivione'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'presolana',
      kind: 'pass',
      name: 'Passo della Presolana',
      elevation: 1297,
      at: [10.09867, 45.92911],
    },
    {
      id: 'vivione',
      kind: 'pass',
      name: 'Passo di Vivione',
      elevation: 1828,
      at: [10.20336, 46.03845],
    },
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
  ],
} satisfies Route;
