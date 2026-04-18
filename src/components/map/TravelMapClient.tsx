"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";
import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";

// Next.js/webpack cannot resolve MapLibre's worker URL automatically.
// Point it to the copy in /public so tiles actually load.
setWorkerUrl("/maplibre-gl-csp-worker.js");

import type { Travel } from "@/lib/travels";
import type { VisitedCity } from "@/config/visitedCities";
import { getMarkerSvgForKind } from "./markerIcon";
import { LocalizedLink } from "../LocalizedLink";

interface TravelMapClientProps {
  travels: Array<Travel & { coords: NonNullable<Travel["coords"]> }>;
  visitedCities?: VisitedCity[];
}

const GLOBAL_CENTER_LNG = 0;
const GLOBAL_CENTER_LAT = 20;
const GLOBAL_ZOOM = 2;
const MIN_ZOOM = 2;

// MapLibre expects [lng, lat] order for bounds.
const WORLD_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-180, -85],
  [180, 85],
];

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

type ActivePopup =
  | { kind: "travel"; slug: string }
  | { kind: "city"; index: number }
  | null;

export default function TravelMapClient({ travels, visitedCities = [] }: TravelMapClientProps) {
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  const activeTravel =
    activePopup?.kind === "travel"
      ? travels.find((t) => t.slug === activePopup.slug) ?? null
      : null;

  const activeCity =
    activePopup?.kind === "city" ? (visitedCities[activePopup.index] ?? null) : null;

  return (
    <Map
      initialViewState={{
        longitude: GLOBAL_CENTER_LNG,
        latitude: GLOBAL_CENTER_LAT,
        zoom: GLOBAL_ZOOM,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={MAP_STYLE}
      scrollZoom={false}
      minZoom={MIN_ZOOM}
      maxBounds={WORLD_MAX_BOUNDS}
      attributionControl={false}
      onLoad={(e) => e.target.resize()}
      onClick={() => setActivePopup(null)}
    >
      {travels.map((travel) => (
        <Marker
          key={travel.slug}
          longitude={travel.coords.lng}
          latitude={travel.coords.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActivePopup({ kind: "travel", slug: travel.slug });
          }}
        >
          <div
            className="travel-marker-wrapper"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: getMarkerSvgForKind() }}
            style={{ cursor: "pointer" }}
            title={travel.title}
          />
        </Marker>
      ))}

      {visitedCities.map((city, index) => (
        <Marker
          key={`city-${index}`}
          longitude={city.coords.lng}
          latitude={city.coords.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActivePopup({ kind: "city", index });
          }}
        >
          <div
            className="travel-marker-wrapper"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: getMarkerSvgForKind() }}
            style={{ cursor: "pointer" }}
            title={city.name}
          />
        </Marker>
      ))}

      {activeTravel && (
        <Popup
          longitude={activeTravel.coords.lng}
          latitude={activeTravel.coords.lat}
          anchor="bottom"
          offset={[0, -40]}
          onClose={() => setActivePopup(null)}
          closeButton
        >
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
              {activeTravel.location}
            </p>
            <p className="text-base font-semibold text-brand-primary">
              {activeTravel.title}
            </p>
            <LocalizedLink
              href={`/viaggi/${activeTravel.slug}`}
              className="text-sm font-semibold text-brand-secondary hover:underline"
            >
              Apri itinerario →
            </LocalizedLink>
          </div>
        </Popup>
      )}

      {activeCity && (
        <Popup
          longitude={activeCity.coords.lng}
          latitude={activeCity.coords.lat}
          anchor="bottom"
          offset={[0, -40]}
          onClose={() => setActivePopup(null)}
          closeButton
        >
          <div className="space-y-1 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
              {activeCity.country}
            </p>
            <p className="text-base font-semibold text-brand-primary">
              {activeCity.name}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
