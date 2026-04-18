"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";
import * as togeojson from "@tmcw/togeojson";
import type { FeatureCollection, Geometry, Position } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { FitBoundsOptions } from "maplibre-gl";

setWorkerUrl("/maplibre-gl-csp-worker.js");
import JSZip from "jszip";

import type { TravelCoords, TravelMapData } from "@/lib/travels";
import {
  fetchGpxAsRouteFeatureCollection,
  mergeRouteFeatureCollections,
} from "@/lib/gpxTrackClient";
import { withBasePath } from "@/lib/paths";
import { getMarkerSvgForKind } from "./markerIcon";

interface TravelDetailMapClientProps {
  map: TravelMapData;
  fallbackCoords?: TravelCoords;
  title: string;
  /** When false, no pan/zoom UI (e.g. list thumbnails behind a link). Default true. */
  interactive?: boolean;
  /** When false, map.points markers are not shown (e.g. list route preview). Default true. */
  showMarkers?: boolean;
  /** Geographic padding around bounds (fraction of span). Default 0.2. */
  boundsPadRatio?: number;
  /** Extra options for fitBounds (e.g. pixel padding in list thumbnails). */
  boundsOptions?: FitBoundsOptions;
}

/** Default view while a track file is loading (Italy). */
const ITALY_LNG = 12.5;
const ITALY_LAT = 42.8;
const TRACK_LOADING_ZOOM = 6;
const MIN_ZOOM = 2;

/** [[minLng, minLat], [maxLng, maxLat]] */
type LngLatBounds = [[number, number], [number, number]];

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

function computePaddedBounds(
  coords: [number, number][],
  padRatio: number,
): LngLatBounds | undefined {
  if (coords.length === 0) return undefined;

  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;

  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;

  return [
    [minLng - lngSpan * padRatio, minLat - latSpan * padRatio],
    [maxLng + lngSpan * padRatio, maxLat + latSpan * padRatio],
  ];
}

export default function TravelDetailMapClient({
  map,
  fallbackCoords,
  title,
  interactive = true,
  showMarkers = true,
  boundsPadRatio = 0.2,
  boundsOptions,
}: TravelDetailMapClientProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [track, setTrack] = useState<FeatureCollection | null>(null);
  const [activeMarkerKey, setActiveMarkerKey] = useState<string | null>(null);

  const markers = useMemo(
    () => (showMarkers ? (map.points ?? []) : []),
    [map.points, showMarkers],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTrack() {
      const segmentPaths = map.gpxSegments?.filter(Boolean) ?? [];

      if (segmentPaths.length > 0) {
        try {
          const collections = await Promise.all(
            segmentPaths.map((path) => fetchGpxAsRouteFeatureCollection(path)),
          );
          const merged = mergeRouteFeatureCollections(collections);
          if (!cancelled) setTrack(merged);
        } catch (error) {
          console.error("Impossibile caricare i segmenti GPX", error);
          if (!cancelled) setTrack(null);
        }
        return;
      }

      const trackFile = map.gpx || map.kml || map.kmz;
      if (!trackFile) {
        setTrack(null);
        return;
      }

      try {
        const trackPath = trackFile.startsWith("http") ? trackFile : withBasePath(trackFile);
        const response = await fetch(trackPath);

        let xmlText: string;

        if (map.kmz) {
          const arrayBuffer = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          const kmlFile = Object.keys(zip.files).find((name) =>
            name.toLowerCase().endsWith(".kml"),
          );
          if (!kmlFile) throw new Error("Nessun file KML trovato nel KMZ");
          xmlText = await zip.files[kmlFile].async("string");
        } else {
          xmlText = await response.text();
        }

        const dom = new DOMParser().parseFromString(xmlText, "application/xml");
        const geojson = (map.kml || map.kmz)
          ? (togeojson.kml(dom) as FeatureCollection)
          : (togeojson.gpx(dom) as FeatureCollection);

        const filteredGeoJson: FeatureCollection = {
          ...geojson,
          features: geojson.features.filter(
            (feature) =>
              feature.geometry.type !== "Point" &&
              feature.geometry.type !== "MultiPoint",
          ),
        };

        if (!cancelled) setTrack(filteredGeoJson);
      } catch (error) {
        console.error(`Impossibile caricare il file tracciato (${trackFile})`, error);
        if (!cancelled) setTrack(null);
      }
    }

    loadTrack();
    return () => {
      cancelled = true;
    };
  }, [map.gpx, map.kml, map.kmz, map.gpxSegments?.join("|")]);

  const trackLngLats = useMemo(() => extractLngLatsFromTrack(track), [track]);

  const expectsTrackFile = !!(
    map.gpx || map.kml || map.kmz || (map.gpxSegments?.length ?? 0) > 0
  );

  const trackSourceKey =
    map.gpx || map.kml || map.kmz || map.gpxSegments?.join("|") || "track";

  const bounds = useMemo<LngLatBounds | undefined>(() => {
    const coords: [number, number][] = [];
    markers.forEach((point) => coords.push([point.lng, point.lat]));
    for (const c of trackLngLats) coords.push(c);

    if (coords.length >= 2) {
      return computePaddedBounds(coords, boundsPadRatio);
    }

    // Track expected but not yet loaded — don't snap to a wrong view yet.
    if (expectsTrackFile && trackLngLats.length === 0) {
      return undefined;
    }

    if (!coords.length && fallbackCoords) {
      coords.push([fallbackCoords.lng, fallbackCoords.lat]);
    }
    if (!coords.length) return undefined;

    return computePaddedBounds(coords, boundsPadRatio);
  }, [markers, trackLngLats, fallbackCoords, boundsPadRatio, expectsTrackFile]);

  // Fit the map once loaded, and re-fit whenever bounds change (e.g. after track loads).
  useEffect(() => {
    const m = mapRef.current;
    if (!mapLoaded || !m || !bounds) return;

    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    const isSinglePoint = minLng === maxLng && minLat === maxLat;

    const apply = () => {
      m.resize();
      if (isSinglePoint) {
        m.flyTo({ center: [minLng, minLat], zoom: 10 });
      } else {
        m.fitBounds(bounds, boundsOptions ?? {});
      }
    };

    apply();
    // One deferred retry handles cases where the container is still measuring.
    const t = window.setTimeout(apply, 250);
    return () => window.clearTimeout(t);
  }, [mapLoaded, bounds, boundsOptions]);

  const initialLng = fallbackCoords?.lng ?? markers[0]?.lng ?? ITALY_LNG;
  const initialLat = fallbackCoords?.lat ?? markers[0]?.lat ?? ITALY_LAT;

  const activePoint = useMemo(
    () => markers.find((p) => `${p.lat}-${p.lng}-${p.name}` === activeMarkerKey) ?? null,
    [markers, activeMarkerKey],
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: initialLng,
        latitude: initialLat,
        zoom: TRACK_LOADING_ZOOM,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={MAP_STYLE}
      scrollZoom={interactive}
      dragPan={interactive}
      doubleClickZoom={interactive}
      keyboard={interactive}
      minZoom={MIN_ZOOM}
      attributionControl={false}
      onLoad={() => setMapLoaded(true)}
      onClick={() => setActiveMarkerKey(null)}
      aria-label={`Mappa dettagliata del viaggio ${title}`}
    >
      {interactive && <NavigationControl position="top-right" />}

      {track && (
        <Source key={trackSourceKey} id="track" type="geojson" data={track}>
          <Layer
            id="track-line"
            type="line"
            paint={{
              "line-color": "#0369a1",
              "line-width": 4,
              "line-opacity": 0.95,
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
          />
        </Source>
      )}

      {markers.map((point) => {
        const key = `${point.lat}-${point.lng}-${point.name}`;
        return (
          <Marker
            key={key}
            longitude={point.lng}
            latitude={point.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveMarkerKey(key);
            }}
          >
            <div
              className="travel-marker-wrapper"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: getMarkerSvgForKind(point.kind) }}
              style={{ cursor: "pointer" }}
            />
          </Marker>
        );
      })}

      {activePoint && (
        <Popup
          longitude={activePoint.lng}
          latitude={activePoint.lat}
          anchor="bottom"
          offset={[0, -40]}
          onClose={() => setActiveMarkerKey(null)}
          closeButton
        >
          <div className="space-y-1 text-sm">
            <p className="text-base font-semibold text-brand-primary">
              {activePoint.name}
            </p>
            {activePoint.description && (
              <p className="text-brand-muted">{activePoint.description}</p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}

function extractLngLatsFromTrack(
  track: FeatureCollection | null,
): [number, number][] {
  if (!track) return [];
  const coords: [number, number][] = [];
  track.features.forEach((feature) => {
    coords.push(...extractLngLatsFromGeometry(feature.geometry));
  });
  return coords;
}

function extractLngLatsFromGeometry(
  geometry?: Geometry | null,
): [number, number][] {
  if (!geometry) return [];
  switch (geometry.type) {
    case "LineString":
      return geometry.coordinates.map(posToLngLat);
    case "MultiLineString":
      return geometry.coordinates.flatMap((seg) => seg.map(posToLngLat));
    case "GeometryCollection":
      return geometry.geometries.flatMap((child) =>
        extractLngLatsFromGeometry(child),
      );
    default:
      return [];
  }
}

function posToLngLat(position: Position): [number, number] {
  const [lng, lat] = position;
  return [
    typeof lng === "number" ? lng : 0,
    typeof lat === "number" ? lat : 0,
  ];
}
