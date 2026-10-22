import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './crocedomini.track.json';

/** Gallarate → Passo di Crocedomini, loop back to Gallarate. The line is the
    actual ridden GPX track — see `crocedomini.track.json` and
    `npm run track:import` for how it got here. */
export const crocedomini = {
  slug: 'crocedomini',
  km: 473,
  track: trackFrom(rawTrack, 'crocedomini'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'crocedomini',
      kind: 'pass',
      name: 'Passo di Crocedomini',
      elevation: 1892,
      at: [10.40959, 45.90754],
    },
  ],
} satisfies Route;
