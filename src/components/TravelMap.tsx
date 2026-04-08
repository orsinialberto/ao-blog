import { getAllTravels, type Travel, type Locale } from "@/lib/travels";
import { TravelMapLazy } from "@/components/map/TravelMapLazy";
import { visitedCities } from "@/config/visitedCities";
import { isContinentTag } from "@/config/continents";
import { getTranslations } from "@/i18n";

type TravelWithCoords = Travel & { coords: NonNullable<Travel["coords"]> };

function hasCoords(travel: Travel): travel is TravelWithCoords {
  return Boolean(travel.coords);
}

function getContinentTag(travel: Travel): string {
  return travel.tags.find(isContinentTag) ?? "Altro";
}

function topContinentsByTravelCount(travels: Travel[], limit: number) {
  const counts = new Map<string, number>();
  for (const travel of travels) {
    const key = getContinentTag(travel);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([continent, count]) => ({ continent, count }));
}

interface TravelMapProps {
  locale: Locale;
}

export async function TravelMap({ locale }: TravelMapProps) {
  const travels = await getAllTravels(locale);
  const travelsWithCoords = travels.filter(hasCoords);
  const t = getTranslations(locale);
  const copy = t.components.travelMapSection;

  if (!travelsWithCoords.length && !visitedCities.length) {
    return null;
  }

  const highlights = topContinentsByTravelCount(travels, 2);

  return (
    <section className="bg-brand-surface py-24 px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="mb-6 font-headline text-3xl text-brand-primary md:text-4xl">
              {copy.title}
            </h2>
            <p className="mb-8 max-w-lg leading-relaxed text-brand-muted">
              {copy.description}
            </p>
            <div className="space-y-4">
              {highlights.map(({ continent, count }) => (
                <div
                  key={continent}
                  className="flex items-center gap-4 rounded-xl border border-brand-outline-variant/20 bg-white p-4 shadow-sm"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary"
                    aria-hidden
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-primary">
                      {continent === "Altro" ? copy.otherRegion : continent}
                    </h3>
                    <p className="text-sm text-brand-muted">
                      {copy.journalCount.replace("{count}", String(count))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-brand-surface shadow-[0_12px_40px_rgba(16,29,39,0.06)] md:max-w-none">
              <div className="homepage-map-wrapper h-full min-h-[280px] w-full">
                <TravelMapLazy travels={travelsWithCoords} visitedCities={visitedCities} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
