'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_INITIAL_VIEW, MAP_STYLE_URL, MAP_ZOOM_RANGE } from '@/config/map';
import { findView } from '@/config/on-the-road-nav';
import { findPlace, findRoute } from '@/data/routes';
import { useRouteLayers, type MapLibreModule } from './useRouteLayers';
import { useStickerRide } from './useStickerRide';

type Props = {
  /** Translated label for the canvas — a map is otherwise silent to a screen
      reader. */
  label: string;
  /** Shown instead of the map when the tiles never arrive. */
  errorMessage: string;
};

/** The only file in the project that imports MapLibre.
    `maplibre-gl` is imported inside the effect, not at module scope: it is
    ~900KB and would otherwise sit in the page's initial chunk. The type import
    above is erased at build time, so it costs nothing.

    The selection is read from the URL here rather than passed in as a prop:
    a prop derived from `searchParams` would make this component remount on
    every navigation, throwing the visitor back to the initial view. */
export default function MapCanvas({ label, errorMessage }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [lib, setLib] = useState<MapLibreModule | null>(null);

  const params = useSearchParams();
  const place = findPlace(params.get('place'));
  const route = findRoute(params.get('route'));
  const hasPanel = findView(params.get('view') ?? undefined) !== undefined;

  const selection = { route, place, hasPanel };
  useRouteLayers(map, lib, selection);
  useStickerRide(map, lib, selection);

  useEffect(() => {
    if (!container.current) return;

    let instance: MapLibreMap | undefined;
    let cancelled = false;

    (async () => {
      const maplibre = await import('maplibre-gl');
      if (cancelled || !container.current) return;
      const { Map, NavigationControl, ScaleControl } = maplibre;

      // MapLibre 6 loads its worker from a sibling file, resolved through
      // `import.meta.url` — an expression Turbopack rewrites, and gets wrong,
      // while bundling the library. Left to itself MapLibre ends up calling
      // `new Worker('')`, which loads this page's HTML as a script: the worker
      // dies immediately, silently (no `error` event fires), and with it go the
      // vector tiles and the GeoJSON tiling, leaving a map with nothing on it
      // but the raster relief and the DOM markers. `scripts/copy-maplibre-worker.mjs`
      // puts the worker under `public/` so this line can point at it directly.
      maplibre.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');

      instance = new Map({
        container: container.current,
        style: MAP_STYLE_URL,
        center: MAP_INITIAL_VIEW.center,
        zoom: MAP_INITIAL_VIEW.zoom,
        ...MAP_ZOOM_RANGE,
        // North stays up: no rotation, no pitch, so there is no way to leave
        // the map in a state the visitor cannot undo.
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: { compact: true },
      });

      // When WebGL2 is unavailable, the constructor above doesn't throw — it
      // logs a GPUInitializationError and returns a map missing pieces like
      // `touchZoomRotate`. Touching those pieces is what actually throws, so
      // that's what this guards: without it, the crash happens before the
      // `error` handler below is even attached, and the visitor gets an
      // unhandled exception instead of the `failed` UI this component
      // already has for exactly this situation.
      try {
        instance.touchZoomRotate.disableRotation();
        instance.addControl(
          new NavigationControl({ showCompass: false }),
          'bottom-right',
        );
        instance.addControl(new ScaleControl({ unit: 'metric' }), 'bottom-left');

        // MapLibre's AttributionControl ignores `compact: true` on first
        // paint. At construction time the style hasn't loaded yet, so the
        // control has no attributions to show and skips its own compact
        // styling (see AttributionControl#_updateCompact in its source: it
        // only adds the compact classes once the container is *not* already
        // marked `maplibregl-attrib-empty`). It only picks up "compact" once
        // the style's sources report their attributions on `styledata` — at
        // which point it renders expanded, open, full text and all, because
        // that first flip always adds the `-show`/`open` state along with
        // the compact class. It then also re-expands on every `resize`
        // regardless of the option. The attribution itself has to stay — it
        // is the condition OpenFreeMap and OpenStreetMap grant free tile use
        // under, not decoration — but nothing requires it to start expanded.
        // Collapsing it to the (i) button ourselves on both events (`resize`
        // for the library's own re-expansion, `styledata` for the delayed
        // first flip) keeps it one tap away without the full text sitting on
        // the map by default.
        const collapseAttribution = () => {
          const attribution = container.current?.querySelector('.maplibregl-ctrl-attrib');
          attribution?.classList.remove('maplibregl-compact-show');
          attribution?.removeAttribute('open');
        };
        collapseAttribution();
        instance.on('styledata', collapseAttribution);
        instance.on('resize', collapseAttribution);
      } catch {
        // A broken instance is missing the internals `remove()` needs (its
        // `painter`/`_handlers` never got created), so `remove()` itself
        // would throw on unmount. Dropping the reference makes the cleanup
        // below a no-op for this map instead.
        instance = undefined;
        setFailed(true);
        return;
      }

      // Only a failure *before* the first successful load counts as "the map is
      // down". After that, errors are individual tiles missing, which is not
      // worth replacing the whole map over.
      let loaded = false;
      instance.on('load', () => {
        loaded = true;
      });
      instance.on('error', () => {
        if (!loaded) setFailed(true);
      });

      // The hooks get the map only once its style is parsed, so they can add
      // sources and layers straight away. Subscribing here, in the same tick
      // as the constructor, cannot miss the event; a hook subscribing after a
      // React render could — when the style comes from the HTTP cache it is
      // ready before that render, and the hook then waits forever.
      const ready = instance;
      ready.once('style.load', () => {
        if (cancelled) return;
        setLib(maplibre);
        setMap(ready);
      });
    })();

    return () => {
      cancelled = true;
      setMap(null);
      instance?.remove();
    };
  }, []);

  if (failed) {
    return (
      <div className="text-ink-soft absolute inset-0 flex items-center justify-center p-8 text-center font-mono text-sm">
        {errorMessage}
      </div>
    );
  }

  return (
    <div
      ref={container}
      aria-label={label}
      // See globals.css's `.maplibregl-map` override for why this needs
      // !important there instead of just this className winning outright.
      className="absolute inset-0"
    />
  );
}
