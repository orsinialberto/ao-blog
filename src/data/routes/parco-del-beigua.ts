import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './parco-del-beigua.track.json';

/** Gallarate → Passo del Turchino → Passo del Faiallo, loop through the
    Parco del Beigua, back to Gallarate. The line is the actual ridden GPX
    track — see `parco-del-beigua.track.json` and `npm run track:import` for
    how it got here. */
export const parcoDelBeigua = {
  slug: 'parco-del-beigua',
  km: 374,
  track: trackFrom(rawTrack, 'parco-del-beigua'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'turchino',
      kind: 'pass',
      name: 'Passo del Turchino',
      elevation: 591,
      at: [8.735, 44.4869],
    },
    {
      id: 'faiallo',
      kind: 'pass',
      name: 'Passo del Faiallo',
      elevation: 1044,
      at: [8.66778, 44.46222],
    },
  ],
} satisfies Route;
