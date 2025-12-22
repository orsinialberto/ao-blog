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
    <section className="bg-white py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
              Mappa
            </p>
          </div>
          <div className="h-[600px] w-full overflow-hidden rounded-xl bg-brand-background">
            <TravelMapLazy travels={travelsWithCoords} />
          </div>
        </div>
      </div>
    </section>
  );
}

