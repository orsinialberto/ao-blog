import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './sommo-pian-delle-fugazze.track.json';

/** Trento → Passo Sommo → Pasubio → Passo Pian delle Fugazze → Gallarate. The
    line is the actual ridden GPX track — see
    `sommo-pian-delle-fugazze.track.json` and `npm run track:import` for how
    it got here. */
export const sommoPianDelleFugazze = {
  slug: 'sommo-pian-delle-fugazze',
  km: 376,
  track: trackFrom(rawTrack, 'sommo-pian-delle-fugazze'),
  places: [
    { id: 'trento', kind: 'poi', name: 'Trento', at: [11.1217, 46.0679] },
    {
      id: 'sommo',
      kind: 'pass',
      name: 'Passo Sommo',
      elevation: 1341,
      at: [11.206249, 45.91955],
    },
    { id: 'pasubio', kind: 'poi', name: 'Pasubio', at: [11.265128, 45.739269] },
    {
      id: 'fugazze',
      kind: 'pass',
      name: 'Passo Pian delle Fugazze',
      elevation: 1163,
      at: [11.172990, 45.760170],
    },
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
  ],
} satisfies Route;
