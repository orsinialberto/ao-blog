"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Travel } from "@/lib/travels";
import type { VisitedCity } from "@/config/visitedCities";
import { OSM_CLASSIC_TILE_ATTRIBUTION, OSM_CLASSIC_TILE_URL } from "./osmClassicTiles";
import { createTravelMarkerIcon } from "./markerIcon";
import { LocalizedLink } from "../LocalizedLink";

interface TravelMapClientProps {
  travels: Array<Travel & { coords: NonNullable<Travel["coords"]> }>;
  visitedCities?: VisitedCity[];
}

const GLOBAL_CENTER: LatLngExpression = [20, 0];
const MIN_ZOOM = 2;
const GLOBAL_ZOOM = 2;

export default function TravelMapClient({ travels, visitedCities = [] }: TravelMapClientProps) {
  // Combina posizioni di travels e città visitate
  const positions = useMemo(() => {
    const travelPositions = travels.map(
      (travel) => [travel.coords.lat, travel.coords.lng] as [number, number],
    );
    const cityPositions = visitedCities.map(
      (city) => [city.coords.lat, city.coords.lng] as [number, number],
    );
    return [...travelPositions, ...cityPositions];
  }, [travels, visitedCities]);

  // Non usiamo bounds per mostrare sempre il globo intero
  const bounds = undefined;

  const center = GLOBAL_CENTER;
  const markerIcon = useMemo(() => createTravelMarkerIcon(), []);
  const zoom = GLOBAL_ZOOM;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      bounds={bounds}
      className="h-full w-full"
      scrollWheelZoom={false}
      minZoom={MIN_ZOOM}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
    >
      <TileLayer url={OSM_CLASSIC_TILE_URL} attribution={OSM_CLASSIC_TILE_ATTRIBUTION} />
      {/* Marker per i travels del blog */}
      {travels.map((travel) => (
        <Marker
          key={travel.slug}
          position={[travel.coords.lat, travel.coords.lng]}
          icon={markerIcon}
          title={travel.title}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
                {travel.location}
              </p>
              <p className="text-base font-semibold text-brand-primary">
                {travel.title}
              </p>
              <LocalizedLink
                href={`/viaggi/${travel.slug}`}
                className="text-sm font-semibold text-brand-secondary hover:underline"
              >
                Apri itinerario →
              </LocalizedLink>
            </div>
          </Popup>
        </Marker>
      ))}
      {/* Marker per le città visitate (senza link al blog) */}
      {visitedCities.map((city, index) => (
        <Marker
          key={`city-${index}`}
          position={[city.coords.lat, city.coords.lng]}
          icon={markerIcon}
          title={city.name}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
                {city.country}
              </p>
              <p className="text-base font-semibold text-brand-primary">
                {city.name}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

