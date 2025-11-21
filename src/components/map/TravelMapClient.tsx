"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useMemo } from "react";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { Travel } from "@/lib/travels";
import { createTravelMarkerIcon } from "./markerIcon";

interface TravelMapClientProps {
  travels: Array<Travel & { coords: NonNullable<Travel["coords"]> }>;
}

const DEFAULT_CENTER: LatLngExpression = [41.8719, 12.5674];
const MIN_ZOOM = 2;
const SINGLE_POINT_ZOOM = 6;

export default function TravelMapClient({ travels }: TravelMapClientProps) {
  const positions = useMemo(() => {
    return travels.map(
      (travel) => [travel.coords.lat, travel.coords.lng] as [number, number],
    );
  }, [travels]);

  const bounds = useMemo<LatLngBoundsExpression | undefined>(() => {
    if (positions.length <= 1) {
      return undefined;
    }

    return L.latLngBounds(positions).pad(0.25);
  }, [positions]);

  const center = positions[0] ?? DEFAULT_CENTER;
  const markerIcon = useMemo(() => createTravelMarkerIcon(), []);
  const zoom = positions.length === 1 ? SINGLE_POINT_ZOOM : 4;

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
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors · © <a href="https://carto.com/attribution">CARTO</a>'
      />
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
              <Link
                href={`/viaggi/${travel.slug}`}
                className="text-sm font-semibold text-brand-secondary hover:underline"
              >
                Apri itinerario →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

