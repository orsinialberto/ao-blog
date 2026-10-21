import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './delta-po-valdorcia.track.json';

/** Gallarate → Bassano del Grappa → Chioggia/Delta del Po → Arezzo → Val
    d'Orcia → Pisa → Passo dell'Abetone → Maranello → Gallarate, over 6 days.
    The line is the actual ridden GPX track — see
    `delta-po-valdorcia.track.json` and `npm run track:import` for how it
    got here. */
export const deltaPoValdorcia = {
  slug: 'delta-po-valdorcia',
  km: 1568,
  track: trackFrom(rawTrack, 'delta-po-valdorcia'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    { id: 'bassano', kind: 'poi', name: 'Bassano del Grappa', at: [11.73405, 45.76389] },
    { id: 'chioggia', kind: 'poi', name: 'Chioggia', at: [12.27866, 45.21908] },
    { id: 'delta-po', kind: 'poi', name: 'Delta del Po', at: [12.35009, 45.06346] },
    { id: 'arezzo', kind: 'poi', name: 'Arezzo', at: [11.87902, 43.46372] },
    { id: 'valdorcia', kind: 'poi', name: "Val d'Orcia", at: [11.67745, 43.0776] },
    { id: 'pisa', kind: 'poi', name: 'Pisa', at: [10.40175, 43.72284] },
    {
      id: 'abetone',
      kind: 'pass',
      name: "Passo dell'Abetone",
      elevation: 1388,
      at: [10.66497, 44.14565],
    },
    { id: 'maranello', kind: 'poi', name: 'Maranello', at: [10.86656, 44.52635] },
  ],
} satisfies Route;
