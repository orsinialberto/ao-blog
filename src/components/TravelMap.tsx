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
    <section className="py-24 px-8">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        <h2 className="font-headline text-4xl text-brand-primary">
          Mappa
        </h2>
        <div className="homepage-map-wrapper h-[600px] w-full overflow-hidden rounded-xl bg-brand-surface">
          <TravelMapLazy 
            travels={travelsWithCoords} 
            visitedCities={visitedCities}
          />
        </div>
      </div>
    </section>
  );
}

