import Image from "next/image";

import { MotoTravelMapPreview } from "@/components/moto/MotoTravelMapPreview";
import { hasTravelMapContent, type Travel } from "@/lib/travels";
import { formatTravelMonthYear } from "@/lib/dates";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { LocalizedLink } from "@/components/LocalizedLink";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface MotoTravelRowProps {
  travel: Travel;
  locale: SupportedLocale;
}

function capitalizeMonthYear(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function MotoTravelRow({ travel, locale }: MotoTravelRowProps) {
  const t = getTranslations(locale);
  const period = capitalizeMonthYear(formatTravelMonthYear(travel.date, locale));
  const kmLabel = travel.totalKilometers != null
    ? `${new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US").format(travel.totalKilometers)} ${t.components.travelTimeline.kilometers}`
    : null;

  const showRouteMap = hasTravelMapContent(travel.map);
  const cover = optimizeCloudinaryUrl(travel.coverImage, { width: 900, quality: 80 });

  return (
    <LocalizedLink
      href={`/viaggi-in-moto/${travel.slug}`}
      className="group flex flex-col items-center gap-8 text-left outline-none md:flex-row md:gap-16 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      <div className="w-full min-w-0 md:w-2/3">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            {period}
          </span>
          <div className="h-px flex-grow bg-brand-outline-variant/40" />
          {kmLabel && (
            <div className="flex items-center gap-1.5 text-brand-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <path d="M8 16.5L16 7.5" strokeLinecap="round" />
              </svg>
              <span className="font-label text-sm font-bold tracking-tight">{kmLabel}</span>
            </div>
          )}
        </div>
        <h3 className="mb-4 font-headline text-3xl font-bold tracking-tight text-brand-primary transition-colors group-hover:text-brand-secondary md:text-4xl">
          {travel.title}
        </h3>
        <p className="font-body text-lg italic leading-relaxed text-brand-muted">
          {travel.description}
        </p>
      </div>
      <div className="w-full shrink-0 md:w-1/3">
        <div className="relative h-48 overflow-hidden rounded-xl shadow-lg md:h-64">
          {showRouteMap && travel.map ? (
            <div className="pointer-events-none relative h-full w-full">
              <MotoTravelMapPreview
                map={travel.map}
                coords={travel.coords}
                title={travel.title}
              />
              <div className="pointer-events-none absolute inset-0 bg-brand-primary/5" />
            </div>
          ) : (
            <div className="relative h-full grayscale opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100">
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-brand-primary/5" />
            </div>
          )}
        </div>
      </div>
    </LocalizedLink>
  );
}
