import type { Position } from '@/data/routes/types';

/** [west, south, east, north] — the order MapLibre's `fitBounds` accepts. */
export type Bounds = [number, number, number, number];

export function trackBounds(track: readonly Position[]): Bounds {
  let west = track[0][0];
  let south = track[0][1];
  let east = track[0][0];
  let north = track[0][1];
  for (const [lon, lat] of track) {
    if (lon < west) west = lon;
    if (lon > east) east = lon;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  return [west, south, east, north];
}

const EARTH_RADIUS_M = 6371000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle metres between two points. Accurate to a fraction of a percent
    at these latitudes, which is far below the error of a hand-drawn line. */
function haversine([lonA, latA]: Position, [lonB, latB]: Position): number {
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Metres from the start to each point. `[0]` is always 0, and the last entry
    is the whole length. Computed once per route, then read on every frame of
    the sticker's run. */
export function cumulativeDistances(track: readonly Position[]): number[] {
  const distances = [0];
  for (let i = 1; i < track.length; i += 1) {
    distances.push(distances[i - 1] + haversine(track[i - 1], track[i]));
  }
  return distances;
}

/** The point `metres` along the track, interpolated inside whichever segment it
    falls in. Past the end it returns the finish. */
export function pointAt(
  track: readonly Position[],
  cumulative: readonly number[],
  metres: number,
): { at: Position } {
  const last = track.length - 1;
  if (metres <= 0) return { at: track[0] };
  if (metres >= cumulative[last]) {
    return { at: track[last] };
  }

  let segment = 1;
  while (cumulative[segment] < metres) segment += 1;

  const from = track[segment - 1];
  const to = track[segment];
  const segmentLength = cumulative[segment] - cumulative[segment - 1];
  const t = segmentLength === 0 ? 0 : (metres - cumulative[segment - 1]) / segmentLength;

  return {
    at: [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t],
  };
}
