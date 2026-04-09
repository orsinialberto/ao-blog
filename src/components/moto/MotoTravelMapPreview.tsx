"use client";

import dynamic from "next/dynamic";

import type { TravelCoords, TravelMapData } from "@/lib/travels";

const TravelDetailMapClient = dynamic(
  () => import("@/components/map/TravelDetailMapClient"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full min-h-[12rem] w-full animate-pulse bg-brand-surface-low"
        aria-hidden
      />
    ),
  },
);

interface MotoTravelMapPreviewProps {
  map: TravelMapData;
  coords?: TravelCoords;
  title: string;
}

export function MotoTravelMapPreview({ map, coords, title }: MotoTravelMapPreviewProps) {
  return (
    <div className="h-full w-full min-h-[12rem]">
      <TravelDetailMapClient
        map={map}
        fallbackCoords={coords}
        title={title}
        interactive={false}
        showMarkers={false}
        boundsPadRatio={0.1}
        boundsOptions={{ padding: [16, 16] }}
      />
    </div>
  );
}
