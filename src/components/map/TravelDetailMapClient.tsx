"use client";

import "leaflet/dist/leaflet.css";
import * as togeojson from "@tmcw/togeojson";
import type { FeatureCollection, Geometry, Position } from "geojson";
import { useEffect, useMemo, useState } from "react";
import type { LatLngBounds, LatLngExpression } from "leaflet";
import L from "leaflet";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { TravelCoords, TravelMapData } from "@/lib/travels";
import { createTravelMarkerIcon } from "./markerIcon";

interface TravelDetailMapClientProps {
  map: TravelMapData;
  fallbackCoords?: TravelCoords;
  title: string;
}

const DEFAULT_CENTER: LatLngExpression = [20, 0];
const MIN_ZOOM = 2;

export default function TravelDetailMapClient({
  map,
  fallbackCoords,
  title,
}: TravelDetailMapClientProps) {
  const [track, setTrack] = useState<FeatureCollection | null>(null);
  const markers = useMemo(() => map.points ?? [], [map.points]);

  useEffect(() => {
    let cancelled = false;

    async function loadTrack() {
      if (!map.gpx) {
        setTrack(null);
        return;
      }

      try {
        const response = await fetch(map.gpx);
        const text = await response.text();
        const dom = new DOMParser().parseFromString(text, "application/xml");
        const geojson = togeojson.gpx(dom) as FeatureCollection;
        if (!cancelled) {
          setTrack(geojson);
        }
      } catch (error) {
        console.error("Impossibile caricare il GPX", error);
        if (!cancelled) {
          setTrack(null);
        }
      }
    }

    loadTrack();

    return () => {
      cancelled = true;
    };
  }, [map.gpx]);

  const trackLatLngs = useMemo(() => extractLatLngsFromTrack(track), [track]);

  // Campiona i punti del tracci per calcolare i bounds in modo più efficiente
  // Usa un massimo di 100 punti per evitare zoom eccessivo con tracci molto lunghi
  const sampledTrackLatLngs = useMemo(() => {
    if (trackLatLngs.length <= 100) {
      return trackLatLngs;
    }
    
    // Prendi sempre il primo e l'ultimo punto
    const first = trackLatLngs[0];
    const last = trackLatLngs[trackLatLngs.length - 1];
    
    // Campiona i punti intermedi
    const step = Math.ceil((trackLatLngs.length - 2) / 98);
    const sampled: [number, number][] = [first];
    
    for (let i = step; i < trackLatLngs.length - 1; i += step) {
      sampled.push(trackLatLngs[i]);
    }
    
    sampled.push(last);
    return sampled;
  }, [trackLatLngs]);

  const latLngCollection = useMemo(() => {
    const coords: [number, number][] = [];
    markers.forEach((point) => coords.push([point.lat, point.lng]));
    sampledTrackLatLngs.forEach((coord) => coords.push(coord));

    if (!coords.length && fallbackCoords) {
      coords.push([fallbackCoords.lat, fallbackCoords.lng]);
    }

    return coords;
  }, [markers, sampledTrackLatLngs, fallbackCoords]);

  const bounds = useMemo<LatLngBounds | undefined>(() => {
    if (!latLngCollection.length) {
      return undefined;
    }

    // Aumentato il padding da 0.1 a 0.2 (20%) per una migliore visualizzazione
    return L.latLngBounds(latLngCollection).pad(0.2);
  }, [latLngCollection]);

  const center: LatLngExpression =
    bounds?.getCenter() ??
    (fallbackCoords
      ? [fallbackCoords.lat, fallbackCoords.lng]
      : markers[0]
      ? [markers[0].lat, markers[0].lng]
      : DEFAULT_CENTER);

  const markerIcon = useMemo(() => createTravelMarkerIcon(), []);

  return (
    <MapContainer
      center={center}
      zoom={bounds ? undefined : 6}
      bounds={bounds}
      className="h-full w-full"
      scrollWheelZoom
      minZoom={MIN_ZOOM}
      aria-label={`Mappa dettagliata del viaggio ${title}`}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors · © <a href="https://carto.com/attribution">CARTO</a>'
      />
      {track && (
        <GeoJSON
          key={map.gpx}
          data={track}
          style={() => ({
            color: "#14b8a6",
            weight: 4,
            opacity: 0.9,
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

