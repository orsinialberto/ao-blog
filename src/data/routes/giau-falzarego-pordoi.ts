import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './giau-falzarego-pordoi.track.json';

/** Cogolo → Val di Fiemme → San Pellegrino → Giau → Falzarego → Pordoi → Costalunga → Mendola → Val di Non → Cogolo, in a day.
    The line is the actual ridden GPX track — see `giau-falzarego-pordoi.track.json` and
    `npm run track:import` for how it got here. */
export const giauFalzaregoPordoi = {
  slug: 'giau-falzarego-pordoi',
  km: 383,
  track: trackFrom(rawTrack, 'giau-falzarego-pordoi'),
  places: [
    {
      id: 'san-pellegrino',
      kind: 'pass',
      name: 'Passo San Pellegrino',
      elevation: 1918,
      at: [11.787278, 46.378306],
    },
    {
      id: 'giau',
      kind: 'pass',
      name: 'Passo Giau',
      elevation: 2236,
      at: [12.054099, 46.482596],
    },
    {
      id: 'falzarego',
      kind: 'pass',
      name: 'Passo Falzarego',
      elevation: 2105,
      at: [12.009351, 46.518817],
    },
    {
      id: 'pordoi',
      kind: 'pass',
      name: 'Passo Pordoi',
      elevation: 2239,
      at: [11.812899, 46.487443],
    },
    {
      id: 'costalunga',
      kind: 'pass',
      name: 'Passo Costalunga',
      elevation: 1745,
      at: [11.609056, 46.404243],
    },
    {
      id: 'mendola',
      kind: 'pass',
      name: 'Passo della Mendola',
      elevation: 1362,
      at: [11.20658, 46.417454],
    },
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
  ],
} satisfies Route;
