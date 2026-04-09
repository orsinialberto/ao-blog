import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";
import { MotoTrackDownload } from "@/components/moto/MotoTrackDownload";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";
import type { MotoFeaturedPass, TravelCoords, TravelMapData } from "@/lib/travels";
import { getTrackFileDownloadUrl } from "@/lib/travels";

interface MotoRouteSectionProps {
  map: TravelMapData;
  coords?: TravelCoords;
  slug: string;
  title: string;
  locale: SupportedLocale;
  featuredPasses?: MotoFeaturedPass[];
}

export function MotoRouteSection({
  map,
  coords,
  slug,
  title,
  locale,
  featuredPasses,
}: MotoRouteSectionProps) {
  const t = getTranslations(locale);
  const m = t.components.motoTravel;
  const showDownload =
    !!getTrackFileDownloadUrl(map) || (map.gpxSegments?.length ?? 0) > 0;

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-20">
      <div className="mb-8 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div className="space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-brand-primary md:text-4xl">
            {m.routeTitle}
          </h2>
          <p className="font-body italic text-brand-muted">{m.routeSubtitle}</p>
        </div>
        {showDownload && <MotoTrackDownload map={map} slug={slug} trackTitle={title} />}
      </div>

      <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-brand-outline-variant/30 bg-brand-surface-high shadow-inner md:h-[600px]">
        <TravelDetailMapLazy
          map={map}
          fallbackCoords={coords}
          title={title}
          boundsPadRatio={0.08}
        />
        {featuredPasses && featuredPasses.length > 0 && (
          <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur-md md:left-6 md:top-6">
            <p className="mb-3 font-label text-xs font-bold uppercase tracking-widest text-brand-secondary">
              {m.featuredPassLabel}
            </p>
            <ul className="space-y-3">
              {featuredPasses.map((pass, index) => (
                <li
                  key={`${index}-${pass.name}`}
                  className="border-t border-brand-outline-variant/25 pt-3 first:border-t-0 first:pt-0"
                >
                  <p className="font-headline text-xl font-bold text-brand-primary md:text-2xl">
                    {pass.name}
                  </p>
                  {pass.elevationM != null && (
                    <p className="mt-1 font-label text-sm font-medium text-brand-muted">
                      {m.elevation}: {pass.elevationM} m
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
