import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './oropa-panoramica-zegna.track.json';

/** Gallarate → Santuario di Oropa → Panoramica Zegna (Bocchetto di Sessera)
    → Gallarate. The line is the actual ridden GPX track — see
    `oropa-panoramica-zegna.track.json` and `npm run track:import` for how it
    got here. */
export const oropaPanoramicaZegna = {
  slug: 'oropa-panoramica-zegna',
  km: 225,
  track: trackFrom(rawTrack, 'oropa-panoramica-zegna'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    { id: 'oropa', kind: 'poi', name: 'Santuario di Oropa', at: [7.98275, 45.62579] },
    {
      id: 'panoramica-zegna',
      kind: 'poi',
      name: 'Panoramica Zegna',
      at: [8.06269, 45.66361],
    },
  ],
} satisfies Route;
