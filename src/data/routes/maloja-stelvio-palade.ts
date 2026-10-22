import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './maloja-stelvio-palade.track.json';

/** Gallarate → Passo del Maloja → Passo del Bernina → Forcola di Livigno →
    Passo di Foscagno → Passo dello Stelvio → Passo di Palade → Cogolo. The
    line is the actual ridden GPX track — see
    `maloja-stelvio-palade.track.json` and `npm run track:import` for how it
    got here. */
export const malojaStelvioPalade = {
  slug: 'maloja-stelvio-palade',
  km: 437,
  track: trackFrom(rawTrack, 'maloja-stelvio-palade'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'maloja',
      kind: 'pass',
      name: 'Passo del Maloja',
      elevation: 1815,
      at: [9.69583, 46.40001],
    },
    {
      id: 'bernina',
      kind: 'pass',
      name: 'Passo del Bernina',
      elevation: 2328,
      at: [10.02812, 46.41101],
    },
    {
      id: 'forcola',
      kind: 'pass',
      name: 'Forcola di Livigno',
      elevation: 2315,
      at: [10.05625, 46.44366],
    },
    {
      id: 'foscagno',
      kind: 'pass',
      name: 'Passo di Foscagno',
      elevation: 2291,
      at: [10.20886, 46.49501],
    },
    {
      id: 'stelvio',
      kind: 'pass',
      name: 'Passo dello Stelvio',
      elevation: 2757,
      at: [10.45283, 46.52875],
    },
    {
      id: 'palade',
      kind: 'pass',
      name: 'Passo di Palade',
      elevation: 1518,
      at: [11.11244, 46.53098],
    },
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
  ],
} satisfies Route;
