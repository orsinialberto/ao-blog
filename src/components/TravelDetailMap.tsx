import type { Travel } from "@/lib/travels";
import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";

interface TravelDetailMapProps {
  map: NonNullable<Travel["map"]>;
  coords?: Travel["coords"];
  title: string;
}

export function TravelDetailMap({ map, coords, title }: TravelDetailMapProps) {
  return (
    <section className="space-y-4 rounded-[32px] bg-white p-8 shadow-card">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          Traccia del viaggio
        </p>
        <h3 className="text-3xl font-semibold text-brand-primary">
          Percorso e punti di interesse
        </h3>
        <p className="text-brand-muted">
          Segui la traccia GPX e scopri le tappe principali di {title}.
        </p>
      </div>
      <div className="h-[420px] w-full overflow-hidden rounded-[28px] bg-brand-background">
        <TravelDetailMapLazy map={map} fallbackCoords={coords} title={title} />
      </div>
    </section>
  );
}

