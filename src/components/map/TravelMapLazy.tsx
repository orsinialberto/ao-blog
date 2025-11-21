"use client";

import dynamic from "next/dynamic";

import type { Travel } from "@/lib/travels";

const TravelMapClient = dynamic(() => import("./TravelMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-muted">
      Carico la mappa…
    </div>
  ),
});

interface TravelMapLazyProps {
  travels: Array<Travel & { coords: NonNullable<Travel["coords"]> }>;
}

export function TravelMapLazy({ travels }: TravelMapLazyProps) {
  return <TravelMapClient travels={travels} />;
}

