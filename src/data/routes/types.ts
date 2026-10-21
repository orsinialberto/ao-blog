/** A point on the map, in GeoJSON and MapLibre order: [longitude, latitude].
    This is NOT the `lat, lng` order Google Maps shows you. Swapping the two
    raises no error and puts an alpine pass in Somalia — when a marker lands
    somewhere absurd, this is why. */
export type Position = [number, number];

/** A marker on a route. `kind` decides which of the two lists it appears in:
    'pass' → Passes, 'poi' → Saved places. */
export type Place = {
  /** Unique across every route, not just within this one: it is the value of
      `?place=`, and `src/data/routes/index.ts` throws on duplicates. Short
      names are fine ('furka'); prefix with the route slug only if a second
      route ever visits the same place. */
  id: string;
  kind: 'pass' | 'poi';
  /** A proper noun, so it is never translated — same rule as the lettering on
      the board's licence plate. */
  name: string;
  /** Metres above sea level. Passes carry it, points of interest do not. */
  elevation?: number;
  at: Position;
};

export type Route = {
  /** The value of `?route=`, and the key under `onTheRoad.routes` in BOTH
      message files. A slug without its two titles fails the build
      (`components/maps/assertTranslations.ts`). */
  slug: string;
  /** Written by hand. The track is drawn, not recorded, so measuring it would
      under-report every hairpin — see the spec's decision table. */
  km: number;
  /** The actual ridden GPX track. Comes from the sibling `<slug>.track.json`
      via `trackFrom()` (see `track.ts`) — not written by hand. That file is
      produced by `npm run track:import <raw.geojson> <slug>`, which runs
      Ramer–Douglas–Peucker (default tolerance 0.0001°, ~9m — tight enough to
      keep hairpins, loose enough to cut a 16k-point GPS log to a few
      thousand) so the committed file stays small without losing the shape of
      the road. */
  track: Position[];
  places: Place[];
};
