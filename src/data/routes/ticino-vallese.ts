import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './ticino-vallese.track.json';

/** Gallarate → Lucomagno → Oberalp → Furka → Sempione → Gallarate, in a day.
    The line is the actual ridden GPX track — see `ticino-vallese.track.json`
    and `npm run track:import` for how it got here. */
export const ticinoVallese = {
  slug: 'ticino-vallese',
  km: 428,
  track: trackFrom(rawTrack, 'ticino-vallese'),
  places: [
    {
      id: 'lucomagno',
      kind: 'pass',
      name: 'Passo del Lucomagno',
      elevation: 1921,
      at: [8.8015, 46.5639],
    },
    {
      id: 'oberalp',
      kind: 'pass',
      name: "Passo dell'Oberalp",
      elevation: 2047,
      at: [8.6712, 46.6602],
    },
    {
      id: 'furka',
      kind: 'pass',
      name: 'Passo della Furka',
      elevation: 2429,
      at: [8.4147, 46.5724],
    },
    {
      id: 'sempione',
      kind: 'pass',
      name: 'Passo del Sempione',
      elevation: 1999,
      at: [8.0324, 46.2509],
    },
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
  ],
} satisfies Route;
