"use client";

import "leaflet/dist/leaflet.css";
import * as togeojson from "@tmcw/togeojson";
import type { FeatureCollection, Geometry, Position } from "geojson";
import { useEffect, useMemo, useState } from "react";
import type { FitBoundsOptions, LatLngBounds, LatLngExpression } from "leaflet";
import L from "leaflet";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import JSZip from "jszip";

import type { TravelCoords, TravelMapData } from "@/lib/travels";
import {
  fetchGpxAsRouteFeatureCollection,
  mergeRouteFeatureCollections,
} from "@/lib/gpxTrackClient";
import { withBasePath } from "@/lib/paths";
import { OSM_CLASSIC_TILE_ATTRIBUTION, OSM_CLASSIC_TILE_URL } from "./osmClassicTiles";
import { createTravelMarkerIcon } from "./markerIcon";

interface TravelDetailMapClientProps {
  map: TravelMapData;
  fallbackCoords?: TravelCoords;
  title: string;
  /** When false, no pan/zoom UI (e.g. list thumbnails behind a link). Default true. */
  interactive?: boolean;
  /** When false, map.points markers are not shown (e.g. list route preview). Default true. */
  showMarkers?: boolean;
  /** Geographic padding around bounds (Leaflet `pad`). Default 0.2. */
  boundsPadRatio?: number;
  /** Extra options for `fitBounds` (e.g. pixel padding in list thumbnails). */
  boundsOptions?: FitBoundsOptions;
}

/** Default view while a track file is loading (Italy). */
const TRACK_LOADING_CENTER: LatLngExpression = [42.8, 12.5];
const TRACK_LOADING_ZOOM = 6;
const MIN_ZOOM = 2;

function MapFitBounds({
  bounds,
  boundsOptions,
}: {
  bounds: LatLngBounds | undefined;
  boundsOptions?: FitBoundsOptions;
}) {
  const map = useMap();

  useEffect(() => {
    if (!bounds?.isValid()) {
      return;
    }

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const isSinglePoint = sw.lat === ne.lat && sw.lng === ne.lng;

    const apply = () => {
      map.invalidateSize();
      if (isSinglePoint) {
        map.setView(sw, 10);
        return;
      }
      map.fitBounds(bounds, boundsOptions ?? {});
    };

    apply();
    const t1 = window.setTimeout(apply, 50);
    const t2 = window.setTimeout(apply, 250);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [map, bounds, boundsOptions]);

  return null;
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
  const [track, setTrack] = useState<FeatureCollection | null>(null);
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
          if (!cancelled) {
            setTrack(merged);
          }
        } catch (error) {
          console.error("Impossibile caricare i segmenti GPX", error);
          if (!cancelled) {
            setTrack(null);
          }
        }
        return;
      }

      const trackFile = map.gpx || map.kml || map.kmz;
      if (!trackFile) {
        setTrack(null);
        return;
      }

      try {
        // Aggiungi il basePath al percorso se è un percorso locale
        const trackPath = trackFile.startsWith('http') ? trackFile : withBasePath(trackFile);
        const response = await fetch(trackPath);
        
        let xmlText: string;
        
        // Se è un file KMZ, decomprimilo prima
        if (map.kmz) {
          const arrayBuffer = await response.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          
          // Cerca il file KML all'interno del KMZ (di solito è il primo file .kml)
          const kmlFile = Object.keys(zip.files).find(name => 
            name.toLowerCase().endsWith('.kml')
          );
          
          if (!kmlFile) {
            throw new Error("Nessun file KML trovato nel KMZ");
          }
          
          xmlText = await zip.files[kmlFile].async('string');
        } else {
          xmlText = await response.text();
        }
        
        const dom = new DOMParser().parseFromString(xmlText, "application/xml");
        
        // Usa togeojson.kml per KML/KMZ, togeojson.gpx per GPX
        const geojson = (map.kml || map.kmz) 
          ? (togeojson.kml(dom) as FeatureCollection)
          : (togeojson.gpx(dom) as FeatureCollection);
        
        // Filtra i Point features per evitare marker indesiderati con "?"
        // Manteniamo solo LineString, MultiLineString e altre geometrie di percorso
        const filteredGeoJson: FeatureCollection = {
          ...geojson,
          features: geojson.features.filter(
            (feature) => 
              feature.geometry.type !== "Point" && 
              feature.geometry.type !== "MultiPoint"
          ),
        };
        
        if (!cancelled) {
          setTrack(filteredGeoJson);
        }
      } catch (error) {
        console.error(`Impossibile caricare il file tracciato (${trackFile})`, error);
        if (!cancelled) {
          setTrack(null);
        }
      }
    }

    loadTrack();

    return () => {
      cancelled = true;
    };
  }, [map.gpx, map.kml, map.kmz, map.gpxSegments?.join("|")]);

  const trackLatLngs = useMemo(() => extractLatLngsFromTrack(track), [track]);

  const expectsTrackFile = !!(
    map.gpx ||
    map.kml ||
    map.kmz ||
    (map.gpxSegments?.length ?? 0) > 0
  );

  const trackLayerKey =
    map.gpx ||
    map.kml ||
    map.kmz ||
    map.gpxSegments?.join("|") ||
    "track";

  const bounds = useMemo<LatLngBounds | undefined>(() => {
    const coords: [number, number][] = [];
    markers.forEach((point) => coords.push([point.lat, point.lng]));
    for (const c of trackLatLngs) {
      coords.push(c);
    }

    if (coords.length >= 2) {
      return L.latLngBounds(coords).pad(boundsPadRatio);
    }

    if (expectsTrackFile && trackLatLngs.length === 0) {
      return undefined;
    }

    if (!coords.length && fallbackCoords) {
      coords.push([fallbackCoords.lat, fallbackCoords.lng]);
    }
    if (!coords.length) {
      return undefined;
    }

    return L.latLngBounds(coords).pad(boundsPadRatio);
  }, [
    markers,
    trackLatLngs,
    fallbackCoords,
    boundsPadRatio,
    expectsTrackFile,
  ]);

  const initialCenter: LatLngExpression = fallbackCoords
    ? [fallbackCoords.lat, fallbackCoords.lng]
    : markers[0]
      ? [markers[0].lat, markers[0].lng]
      : TRACK_LOADING_CENTER;

  const initialZoom = TRACK_LOADING_ZOOM;

  const markerIcon = useMemo(() => createTravelMarkerIcon(), []);

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      className="h-full w-full"
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      zoomControl={interactive}
      keyboard={interactive}
      minZoom={MIN_ZOOM}
      aria-label={`Mappa dettagliata del viaggio ${title}`}
    >
      <MapFitBounds bounds={bounds} boundsOptions={boundsOptions} />
      <TileLayer url={OSM_CLASSIC_TILE_URL} attribution={OSM_CLASSIC_TILE_ATTRIBUTION} />
      {track && (
        <GeoJSON
          key={trackLayerKey}
          data={track}
          style={() => ({
            color: "#0369a1",
            weight: 4,
            opacity: 0.95,
          })}
        />
      )}
      {markers.map((point) => (
        <Marker
          key={`${point.lat}-${point.lng}-${point.name}`}
          position={[point.lat, point.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="text-base font-semibold text-brand-primary">
                {point.name}
              </p>
              {point.description && (
                <p className="text-brand-muted">{point.description}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function extractLatLngsFromTrack(
  track: FeatureCollection | null,
): [number, number][] {
  if (!track) {
    return [];
  }

  const coords: [number, number][] = [];
  track.features.forEach((feature) => {
    coords.push(...extractLatLngsFromGeometry(feature.geometry));
  });
  return coords;
}

function extractLatLngsFromGeometry(
  geometry?: Geometry | null,
): [number, number][] {
  if (!geometry) {
    return [];
  }

  switch (geometry.type) {
    case "LineString":
      return geometry.coordinates.map(coordToLatLng);
    case "MultiLineString":
      return geometry.coordinates.flatMap((segment) =>
        segment.map(coordToLatLng),
      );
    case "Point":
      return [coordToLatLng(geometry.coordinates)];
    case "MultiPoint":
      return geometry.coordinates.map(coordToLatLng);
    case "GeometryCollection":
      return geometry.geometries.flatMap((child) =>
        extractLatLngsFromGeometry(child),
      );
    default:
      return [];
  }
}

function coordToLatLng(position: Position): [number, number] {
  const [lng, lat] = position;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return [0, 0];
  }
  return [lat, lng];
}

