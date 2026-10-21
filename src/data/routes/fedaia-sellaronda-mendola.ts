import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './fedaia-sellaronda-mendola.track.json';

/** Cogolo → Valles → Fedaia → Sella → Gardena → Campolongo → Pordoi → Costalunga → Mendola → Cogolo, in a day.
    The line is the actual ridden GPX track — see `fedaia-sellaronda-mendola.track.json` and
    `npm run track:import` for how it got here. */
export const fedaiaSellarondaMendola = {
  slug: 'fedaia-sellaronda-mendola',
  km: 403,
  track: trackFrom(rawTrack, 'fedaia-sellaronda-mendola'),
  places: [
    {
      id: 'valles',
      kind: 'pass',
      name: 'Passo Valles',
      elevation: 2032,
      at: [11.79961, 46.33861],
    },
    {
      id: 'fedaia',
      kind: 'pass',
      name: 'Passo Fedaia',
      elevation: 2057,
      at: [11.89007, 46.45354],
    },
    {
      id: 'sella',
      kind: 'pass',
      name: 'Passo Sella',
      elevation: 2218,
      at: [11.76305, 46.50856],
    },
    {
      id: 'gardena',
      kind: 'pass',
      name: 'Passo Gardena',
      elevation: 2136,
      at: [11.80883, 46.54987],
    },
    {
      id: 'campolongo',
      kind: 'pass',
      name: 'Passo Campolongo',
      elevation: 1875,
      at: [11.87379, 46.51939],
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
