import type { Travel } from "@/lib/travels";
import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";

interface TravelDetailMapProps {
  map: NonNullable<Travel["map"]>;
  coords?: Travel["coords"];
  title: string;
}

export function TravelDetailMap({ map, coords, title }: TravelDetailMapProps) {
  return (
    <section className="space-y-4 bg-white p-8 shadow-card">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          Traccia del viaggio
        </p>
      </div>
      <div className="h-[420px] w-full overflow-hidden bg-brand-background">
        <TravelDetailMapLazy map={map} fallbackCoords={coords} title={title} />
      </div>
    </section>
  );
}

