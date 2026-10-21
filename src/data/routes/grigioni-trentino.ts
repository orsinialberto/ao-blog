import type { Route } from './types';
import { trackFrom } from './track';
import rawTrack from './grigioni-trentino.track.json';

/** Gallarate → Spluga → Albula → Forno → Umbrail → Gavia → Tonale → Cogolo, in a day.
    The line is the actual ridden GPX track — see `grigioni-trentino.track.json`
    and `npm run track:import` for how it got here. */
export const grigioniTrentino = {
  slug: 'grigioni-trentino',
  km: 407,
  track: trackFrom(rawTrack, 'grigioni-trentino'),
  places: [
    { id: 'gallarate', kind: 'poi', name: 'Gallarate', at: [8.76238, 45.67243] },
    {
      id: 'spluga',
      kind: 'pass',
      name: 'Passo dello Spluga',
      elevation: 2115,
      at: [9.330335, 46.505616],
    },
    {
      id: 'albula',
      kind: 'pass',
      name: "Passo dell'Albula",
      elevation: 2312,
      at: [9.883325, 46.58821],
    },
    {
      id: 'forno',
      kind: 'pass',
      name: 'Passo del Forno',
      elevation: 2149,
      at: [10.292243, 46.639748],
    },
    {
      id: 'umbrail',
      kind: 'pass',
      name: "Passo dell'Umbrail",
      elevation: 2501,
      at: [10.433913, 46.543086],
    },
    {
      id: 'gavia',
      kind: 'pass',
      name: 'Passo Gavia',
      elevation: 2621,
      at: [10.487521, 46.343484],
    },
    {
      id: 'tonale',
      kind: 'pass',
      name: 'Passo Tonale',
      elevation: 1883,
      at: [10.58062, 46.257869],
    },
    { id: 'cogolo', kind: 'poi', name: 'Cogolo', at: [10.69191, 46.355544] },
  ],
} satisfies Route;
