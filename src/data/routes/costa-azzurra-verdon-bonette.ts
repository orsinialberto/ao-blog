import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './costa-azzurra-verdon-bonette.track.json';

/** Gallarate → Passo del Turchino → Costa Azzurra → Gole del Verdon → Colle
    della Bonette → Colle dell'Izoard → Gallarate, over 5 days. The line is
    the actual ridden GPX track — see `costa-azzurra-verdon-bonette.track.json`
    and `npm run track:import` for how it got here. */
export const costaAzzurraVerdonBonette = {
  slug: 'costa-azzurra-verdon-bonette',
  km: 1255,
  track: trackFrom(rawTrack, 'costa-azzurra-verdon-bonette'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'turchino',
      kind: 'pass',
      name: 'Passo del Turchino',
      elevation: 591,
      at: [8.735, 44.4869],
    },
    { id: 'monaco', kind: 'poi', name: 'Monaco', at: [7.42493, 43.74542] },
    { id: 'nizza', kind: 'poi', name: 'Nizza', at: [7.26155, 43.71014] },
    { id: 'santropez', kind: 'poi', name: 'Saint-Tropez', at: [6.64071, 43.26768] },
    { id: 'verdon', kind: 'poi', name: 'Gole del Verdon', at: [6.3313, 43.77338] },
    {
      id: 'bonette',
      kind: 'pass',
      name: 'Colle della Bonette',
      elevation: 2715,
      at: [6.8075, 44.32665],
    },
    {
      id: 'izoard',
      kind: 'pass',
      name: "Colle dell'Izoard",
      elevation: 2360,
      at: [6.73505, 44.8204],
    },
    { id: 'fenestrelle', kind: 'poi', name: 'Fenestrelle', at: [7.0487, 45.03649] },
  ],
} satisfies Route;
