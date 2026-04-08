import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";
import type { MotoFeaturedPass, TravelCoords, TravelMapData } from "@/lib/travels";
import { getTrackFileDownloadUrl } from "@/lib/travels";

interface MotoRouteSectionProps {
  map: TravelMapData;
  coords?: TravelCoords;
  title: string;
  locale: SupportedLocale;
  featuredPass?: MotoFeaturedPass;
}

export function MotoRouteSection({
  map,
  coords,
  title,
  locale,
  featuredPass,
}: MotoRouteSectionProps) {
  const t = getTranslations(locale);
  const m = t.components.motoTravel;
  const downloadUrl = getTrackFileDownloadUrl(map);

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-20">
      <div className="mb-8 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div className="space-y-2">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-brand-primary md:text-4xl">
            {m.routeTitle}
          </h2>
          <p className="font-body italic text-brand-muted">{m.routeSubtitle}</p>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center rounded-full bg-brand-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-2 shrink-0"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {m.downloadTrack}
          </a>
        )}
      </div>

      <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-brand-outline-variant/30 bg-brand-surface-high shadow-inner md:h-[600px]">
        <TravelDetailMapLazy map={map} fallbackCoords={coords} title={title} />
        {featuredPass && (
          <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur-md md:left-6 md:top-6">
            <p className="mb-2 font-label text-xs font-bold uppercase tracking-widest text-brand-secondary">
              {m.featuredPassLabel}
            </p>
            <p className="mb-1 font-headline text-xl font-bold text-brand-primary md:text-2xl">
              {featuredPass.name}
            </p>
            {featuredPass.elevationM != null && (
              <p className="font-label text-sm font-medium text-brand-muted">
                {m.elevation}: {featuredPass.elevationM} m
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
