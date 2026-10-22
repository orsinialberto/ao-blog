import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { TRACK_PAINT } from '@/config/map';
import { ALL_PLACES, ROUTES, type PlaceWithRoutes, type Route } from '@/data/routes';
import { trackBounds } from '@/lib/track';
import { PASS_GLYPH, POI_GLYPH } from './pin-glyphs';

/** The shape of the lazily-loaded library. The hooks need `Marker` and `Popup`
    as values, not just as types, and they cannot import them themselves
    without dragging 900KB into the initial chunk — so `MapCanvas` loads the
    module once and passes it in as `lib`. */
export type MapLibreModule = typeof import('maplibre-gl');

export type Selection = {
  route?: Route;
  place?: PlaceWithRoutes;
  /** Whether the detail panel is open, which is what decides how much room the
      camera has to work with on the left. */
  hasPanel: boolean;
};

const SOURCE_ID = 'routes';
const FAINT_LAYER_ID = 'routes-faint';
const SELECTED_LAYER_ID = 'routes-selected';

/** 22px marker + 12px gap. Below this, two full icons visually touch. */
const OVERLAP_THRESHOLD_PX = 34;

/** Shrinks markers into plain dots (`.map-pin--collapsed`) wherever they sit
    within the threshold of a marker already kept full-size, and restores the
    icon once zooming pulls them apart. A greedy sweep in place order — keep
    a marker unless it lands within the threshold of one already kept — so a
    cluster collapses down to exactly one full icon plus dots, rather than
    every marker in it losing its icon. Screen distance between two fixed
    lng/lat points changes with zoom, and also with container size (the maps
    window's open animation resizes it after the first paint) — MapLibre
    fires `resize` for the latter, so callers re-run this on both. */
function updateOverlap(map: MapLibreMap, markersById: Map<string, InstanceType<MapLibreModule['Marker']>>) {
  const entries = [...markersById.values()];
  const points = entries.map((marker) => map.project(marker.getLngLat()));
  const collapsed = new Array(entries.length).fill(false);
  const kept: number[] = [];

  for (let i = 0; i < entries.length; i++) {
    if (kept.some((k) => points[i].dist(points[k]) < OVERLAP_THRESHOLD_PX)) {
      collapsed[i] = true;
    } else {
      kept.push(i);
    }
  }

  entries.forEach((marker, i) => {
    marker.getElement().classList.toggle('map-pin--collapsed', collapsed[i]);
  });
}

/** All routes as one FeatureCollection. Built once — the data is static. */
function routesToGeoJson() {
  return {
    type: 'FeatureCollection' as const,
    features: ROUTES.map((route) => ({
      type: 'Feature' as const,
      properties: { slug: route.slug },
      geometry: { type: 'LineString' as const, coordinates: route.track },
    })),
  };
}

/** Room to leave around a fitted track, so the panels do not cover it. On a
    phone the sheet eats the bottom of the window instead of the left. */
function fitPadding(map: MapLibreMap, hasPanel: boolean) {
  const { clientWidth, clientHeight } = map.getContainer();
  if (clientWidth < 768) {
    return { top: 40, right: 24, bottom: Math.round(clientHeight * 0.45), left: 24 };
  }
  // Sidebar is 186px at inset 12, the detail panel another 232px after it.
  return { top: 40, right: 60, bottom: 40, left: hasPanel ? 470 : 230 };
}

export function useRouteLayers(
  map: MapLibreMap | null,
  lib: MapLibreModule | null,
  { route, place, hasPanel }: Selection,
) {
  // Lets the selection effect reach the markers this effect builds. This
  // `Map` is JavaScript's, not MapLibre's — the MapLibre one is imported as
  // `MapLibreMap`, which is why that alias exists.
  const markersRef = useRef(new Map<string, InstanceType<MapLibreModule['Marker']>>());

  // Source, layers and markers: built once. `map` is only passed in after its
  // style has loaded (see MapCanvas).
  useEffect(() => {
    if (!map || !lib) return;

    const markers: InstanceType<MapLibreModule['Marker']>[] = [];
    const markersById = markersRef.current;
    markersById.clear();

    const build = () => {
      // React runs effects twice in development. Without this the second pass
      // throws "There is already a source with this ID".
      if (map.getSource(SOURCE_ID)) return;

      map.addSource(SOURCE_ID, { type: 'geojson', data: routesToGeoJson() });

      map.addLayer({
        id: FAINT_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': TRACK_PAINT.faint.color,
          'line-width': TRACK_PAINT.faint.width,
          'line-opacity': TRACK_PAINT.faint.opacity,
        },
      });

      map.addLayer({
        id: SELECTED_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        // No slug matches an empty string, so the layer starts invisible.
        filter: ['==', ['get', 'slug'], ''],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': TRACK_PAINT.selected.color,
          'line-width': TRACK_PAINT.selected.width,
          'line-opacity': TRACK_PAINT.selected.opacity,
        },
      });

      for (const place of ALL_PLACES) {
        const element = document.createElement('div');
        element.className = `map-pin map-pin--${place.kind}`;
        element.innerHTML = place.kind === 'pass' ? PASS_GLYPH : POI_GLYPH;

        const popup = new lib.Popup({ offset: 14, closeButton: false }).setText(
          place.elevation ? `${place.name} — ${place.elevation} m` : place.name,
        );

        const marker = new lib.Marker({ element })
          .setLngLat(place.at)
          .setPopup(popup)
          .addTo(map);

        markers.push(marker);
        markersById.set(place.id, marker);
      }

      updateOverlap(map, markersById);
    };

    const onOverlapCheck = () => updateOverlap(map, markersById);
    map.on('zoomend', onOverlapCheck);
    map.on('resize', onOverlapCheck);

    build();

    return () => {
      map.off('zoomend', onOverlapCheck);
      map.off('resize', onOverlapCheck);
      for (const marker of markers) marker.remove();
      markersById.clear();
      // `remove()` on the map tears everything down; these guards are for the
      // development double-effect, where the map itself survives.
      if (map.getLayer(SELECTED_LAYER_ID)) map.removeLayer(SELECTED_LAYER_ID);
      if (map.getLayer(FAINT_LAYER_ID)) map.removeLayer(FAINT_LAYER_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
  }, [map, lib]);

  // Selection: one filter change plus a camera move. No layer is created or
  // destroyed here, which is why switching routes is instant.
  useEffect(() => {
    if (!map) return;

    const apply = () => {
      if (map.getLayer(SELECTED_LAYER_ID)) {
        // A place shared by several routes lights up every one of them; a
        // plain route selection lights up just itself.
        const slugs = place ? place.routes.map((r) => r.slug) : route ? [route.slug] : [];
        map.setFilter(SELECTED_LAYER_ID, ['in', ['get', 'slug'], ['literal', slugs]]);
      }

      // A popup belongs to the current selection, so anything left open from a
      // previous one — or opened by hand on a marker — goes away with it. That
      // is what makes closing the panel (which drops `?place=`, `?route=` and
      // `?view=` at once) also clear the callout sitting on the map.
      for (const [id, marker] of markersRef.current) {
        if (id === place?.id) continue;
        const popup = marker.getPopup();
        if (popup?.isOpen()) popup.remove();
      }

      if (place) {
        // Asking for a specific marker means asking to look at it, so the
        // marker wins over its route's bounding box.
        map.flyTo({ center: place.at, zoom: 11, duration: 900 });
        const marker = markersRef.current.get(place.id);
        if (marker && !marker.getPopup()?.isOpen()) marker.togglePopup();
        return;
      }

      if (route) {
        map.fitBounds(trackBounds(route.track), {
          padding: fitPadding(map, hasPanel),
          duration: 900,
        });
      }
    };

    apply();
  }, [map, route, place, hasPanel]);
}
