import { getAllTravels, type Travel } from "@/lib/travels";
import { TravelMapLazy } from "@/components/map/TravelMapLazy";
import { visitedCities } from "@/config/visitedCities";

type TravelWithCoords = Travel & { coords: NonNullable<Travel["coords"]> };

function hasCoords(travel: Travel): travel is TravelWithCoords {
  return Boolean(travel.coords);
}

export async function TravelMap() {
  const travels = await getAllTravels();
  const travelsWithCoords = travels.filter(hasCoords);

  // Se non ci sono travels con coordinate, controlla se ci sono città visitate
  if (!travelsWithCoords.length && !visitedCities.length) {
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
          <div className="homepage-map-wrapper h-[600px] w-full overflow-hidden rounded-xl bg-brand-background">
            <TravelMapLazy 
              travels={travelsWithCoords} 
              visitedCities={visitedCities}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

