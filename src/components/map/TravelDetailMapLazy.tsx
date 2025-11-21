"use client";

import dynamic from "next/dynamic";

import type { TravelCoords, TravelMapData } from "@/lib/travels";

const TravelDetailMapClient = dynamic(
  () => import("./TravelDetailMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-muted">
        Carico la mappa dettagliata…
      </div>
    ),
  },
);

interface TravelDetailMapLazyProps {
  map: TravelMapData;
  fallbackCoords?: TravelCoords;
  title: string;
}

export function TravelDetailMapLazy({
  map,
  fallbackCoords,
  title,
}: TravelDetailMapLazyProps) {
  return (
    <TravelDetailMapClient
      map={map}
      fallbackCoords={fallbackCoords}
      title={title}
    />
  );
}

