"use client";

import dynamic from "next/dynamic";
import type { FitBoundsOptions } from "maplibre-gl";

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
  boundsPadRatio?: number;
  boundsOptions?: FitBoundsOptions;
}

export function TravelDetailMapLazy({
  map,
  fallbackCoords,
  title,
  boundsPadRatio,
  boundsOptions,
}: TravelDetailMapLazyProps) {
  return (
    <TravelDetailMapClient
      map={map}
      fallbackCoords={fallbackCoords}
      title={title}
      boundsPadRatio={boundsPadRatio}
      boundsOptions={boundsOptions}
    />
  );
}

