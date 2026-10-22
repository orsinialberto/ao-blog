import type { Position } from './types';

/** Narrows a `.track.json` import (typed `number[][]` by `resolveJsonModule`)
    to `Position[]`, catching a hand-edited file before it reaches the map —
    a swapped `lat, lng` pair raises no type error, only an alpine pass in
    Somalia. `label` is the module's slug, so the thrown error names the file
    to fix. */
export function trackFrom(source: readonly (readonly number[])[], label: string): Position[] {
  if (source.length < 2) {
    throw new Error(`${label}.track.json has ${source.length} point(s); a track needs at least 2.`);
  }
  return source.map((point, index) => {
    const [lon, lat] = point;
    if (point.length < 2 || typeof lon !== 'number' || typeof lat !== 'number') {
      throw new Error(`${label}.track.json point ${index} is not a [lon, lat] pair: ${JSON.stringify(point)}.`);
    }
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      throw new Error(
        `${label}.track.json point ${index} is out of range: [${lon}, ${lat}]. Coordinates are [lon, lat] — check for a swapped pair.`,
      );
    }
    return [lon, lat];
  });
}
