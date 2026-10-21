/** Everything about where the map looks and how far it zooms, in one place.
    The style URL is a constant on purpose: swapping tile provider later is a
    one-line change, and no component knows the URL exists. */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/** The alpine arc. A starting frame, not a statement — change the two numbers. */
export const MAP_INITIAL_VIEW = {
  center: [9.3, 45.9] as [number, number],
  zoom: 5.6,
};

export const MAP_ZOOM_RANGE = { minZoom: 3, maxZoom: 16 };

/** How the tracks are painted. Two layers over one source: everything faint,
    the selected slug solid on top. Hex rather than the CSS tokens because
    MapLibre paints in WebGL and never sees the stylesheet. */
export const TRACK_PAINT = {
  faint: { color: '#d9615c', width: 2, opacity: 0.75 },
  selected: { color: '#b8232f', width: 4, opacity: 1 },
};

/** How long the moto sticker takes to ride a whole route, in milliseconds. */
export const RIDE_DURATION_MS = 8000;
