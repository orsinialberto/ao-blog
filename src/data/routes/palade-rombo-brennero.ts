import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './palade-rombo-brennero.track.json';

/** Cogolo → Passo di Palade → Passo Rombo (Timmelsjoch) into Austria → Passo
    del Brennero back into Italy → Trento. The line is the actual ridden GPX
    track — see `palade-rombo-brennero.track.json` and `npm run track:import`
    for how it got here. */
export const paladeRomboBrennero = {
  slug: 'palade-rombo-brennero',
  km: 423,
  track: trackFrom(rawTrack, 'palade-rombo-brennero'),
  places: [
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
    {
      id: 'palade',
      kind: 'pass',
      name: 'Passo di Palade',
      elevation: 1518,
      at: [11.11244, 46.53098],
    },
    {
      id: 'rombo',
      kind: 'pass',
      name: 'Passo Rombo',
      elevation: 2474,
      at: [11.09667, 46.90528],
    },
    {
      id: 'brennero',
      kind: 'pass',
      name: 'Passo del Brennero',
      elevation: 1370,
      at: [11.504381, 47.003314],
    },
    { id: 'trento', kind: 'poi', name: 'Trento', at: [11.1217, 46.0679] },
  ],
} satisfies Route;
