import { getAllTravels, type Travel } from "@/lib/travels";
import { TravelMapLazy } from "@/components/map/TravelMapLazy";

type TravelWithCoords = Travel & { coords: NonNullable<Travel["coords"]> };

function hasCoords(travel: Travel): travel is TravelWithCoords {
  return Boolean(travel.coords);
}

export async function TravelMap() {
  const travels = await getAllTravels();
  const travelsWithCoords = travels.filter(hasCoords);

  if (!travelsWithCoords.length) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[32px] bg-white p-8 shadow-card">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          Mappa interattiva
        </p>
        <h2 className="text-3xl font-semibold text-brand-primary">
          I luoghi visitati
        </h2>
      </div>
      <div className="h-[420px] w-full overflow-hidden rounded-[28px] bg-brand-background">
        <TravelMapLazy travels={travelsWithCoords} />
      </div>
    </section>
  );
}

