import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './mortirolo-sanmarco-taleggio.track.json';

/** Cogolo → Mortirolo → San Marco → Val Taleggio → Gallarate. The line is the
    actual ridden GPX track — see `mortirolo-sanmarco-taleggio.track.json`
    and `npm run track:import` for how it got here. */
export const mortiroloSanMarcoTaleggio = {
  slug: 'mortirolo-sanmarco-taleggio',
  km: 310,
  track: trackFrom(rawTrack, 'mortirolo-sanmarco-taleggio'),
  places: [
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
    {
      id: 'mortirolo',
      kind: 'pass',
      name: 'Passo del Mortirolo',
      elevation: 1852,
      at: [10.301164, 46.248124],
    },
    {
      id: 'sanmarco',
      kind: 'pass',
      name: 'Passo di San Marco',
      elevation: 1992,
      at: [9.62278, 46.04722],
    },
    { id: 'taleggio', kind: 'poi', name: 'Val Taleggio', at: [9.604361, 45.887296] },
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
  ],
} satisfies Route;
