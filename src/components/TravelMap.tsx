import { getAllTravels, type Travel, type Locale } from "@/lib/travels";
import { TravelMapLazy } from "@/components/map/TravelMapLazy";
import { visitedCities } from "@/config/visitedCities";

type TravelWithCoords = Travel & { coords: NonNullable<Travel["coords"]> };

function hasCoords(travel: Travel): travel is TravelWithCoords {
  return Boolean(travel.coords);
}

interface TravelMapProps {
  locale: Locale;
}

export async function TravelMap({ locale }: TravelMapProps) {
  // Get all travels for the current locale
  const travels = await getAllTravels(locale);
  const travelsWithCoords = travels.filter(hasCoords);

  // If there are no travels with coordinates, check if there are visited cities
  if (!travelsWithCoords.length && !visitedCities.length) {
    return null;
  }

  return (
    <section className="pb-24">
      <div className="mx-auto px-4 lg:px-24">
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

