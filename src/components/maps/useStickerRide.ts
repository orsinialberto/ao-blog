import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { MapLibreModule, Selection } from './useRouteLayers';
import { RIDE_DURATION_MS } from '@/config/map';
import { cumulativeDistances, pointAt } from '@/lib/track';

/** The moto sticker from the board rides the selected track, once, from start
    to finish, and parks at the end.

    It runs only when a route is selected *without* a place. Arriving at a
    route by clicking a pass means asking to look at that pass: the camera flies
    there (see `useRouteLayers`), and a sticker crossing the whole track would
    spend the run outside the frame. The camera never follows the sticker —
    moving the map under someone who is reading it is worse than the flourish
    is worth.

    The sticker keeps its board artwork's fixed heading rather than turning to
    face each bend — it is a sticker riding along a line on a map, not a
    vehicle being steered, and constant rotation on a hairpin-heavy track like
    the Swiss passes read as jittery rather than alive. */
export function useStickerRide(
  map: MapLibreMap | null,
  lib: MapLibreModule | null,
  { route, place }: Selection,
) {
  useEffect(() => {
    if (!map || !lib || !route || place) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (route.track.length < 2) return;

    const cumulative = cumulativeDistances(route.track);
    const total = cumulative[cumulative.length - 1];
    if (total === 0) return;

    const element = document.createElement('div');
    element.className = 'moto-rider';
    element.setAttribute('aria-hidden', 'true');

    const marker = new lib.Marker({ element }).setLngLat(route.track[0]).addTo(map);

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - started) / RIDE_DURATION_MS, 1);
      const { at } = pointAt(route.track, cumulative, progress * total);
      marker.setLngLat(at);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Selecting another route mid-run cancels this one: the cleanup drops both
    // the frame and the sticker, and the next effect starts its own.
    return () => {
      cancelAnimationFrame(frame);
      marker.remove();
    };
  }, [map, lib, route, place]);
}
