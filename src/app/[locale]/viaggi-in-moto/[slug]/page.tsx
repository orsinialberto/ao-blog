import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { LocalizedLink } from "@/components/LocalizedLink";
import { MotoDetailStatsCards } from "@/components/moto/MotoDetailStatsCards";
import { MotoRouteSection } from "@/components/moto/MotoRouteSection";
import { TravelItineraryAccordion } from "@/components/TravelItineraryAccordion";
import { hasMotoItineraryAccordionItems } from "@/lib/itineraryAccordion";
import { supportedLocales } from "@/config/locales";
import type { SupportedLocale } from "@/config/locales";
import { getTranslations } from "@/i18n";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import {
  getMotoTravelBySlug,
  getMotoTravels,
  hasTravelNarrativeContent,
} from "@/lib/travels";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

interface PageProps {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}

export async function generateStaticParams() {
  const results: Array<{ locale: SupportedLocale; slug: string }> = [];
  for (const locale of supportedLocales) {
    for (const travel of getMotoTravels(locale)) {
      results.push({ locale, slug: travel.slug });
    }
  }
  return results;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const locale = await getLocaleFromParams(resolved);
  const travel = await getMotoTravelBySlug(resolved.slug, locale);
  if (!travel) {
    return { title: "Not found" };
  }
  return {
    title: travel.title,
    description: travel.description,
    openGraph: {
      title: travel.title,
      description: travel.description,
      images: [travel.coverImage],
    },
  };
}

export default async function MotorcycleTravelDetailPage({ params }: PageProps) {
  const resolved = await params;
  const locale = await getLocaleFromParams(resolved);
  const t = getTranslations(locale as SupportedLocale);
  const travel = await getMotoTravelBySlug(resolved.slug, locale);

  if (!travel) {
    notFound();
  }

  const optimizedCover = optimizeCloudinaryUrl(travel.coverImage, {
    width: 1920,
    quality: 85,
  });

  const hasMap = !!(
    travel.map?.gpx ||
    travel.map?.kml ||
    travel.map?.kmz ||
    (travel.map?.gpxSegments?.length ?? 0) > 0 ||
    (travel.map?.points?.length ?? 0) > 0
  );

  const showFullStoryLink = hasTravelNarrativeContent(travel);

  return (
    <article className="min-w-0">
      <header className="relative h-[560px] w-full min-w-0 overflow-hidden md:h-[600px]">
        <Image
          src={optimizedCover}
          alt={travel.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-20">
          <div className="mx-auto max-w-7xl min-w-0">
            <LocalizedLink
              href="/viaggi-in-moto"
              className="mb-6 inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-1 font-label text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              {t.pages.motorcycleTravels.badge}
            </LocalizedLink>
            <h1 className="max-w-4xl font-headline text-4xl font-bold leading-none tracking-tight text-white md:text-6xl lg:text-7xl break-words">
              {travel.title}
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg italic leading-relaxed text-white/85 md:text-xl break-words">
              {travel.description}
            </p>
            {showFullStoryLink && (
              <LocalizedLink
                href={`/viaggi/${travel.slug}`}
                className="mt-6 inline-block rounded-sm font-label text-xs font-bold uppercase tracking-widest text-white/95 border-b border-white/55 pb-0.5 outline-none transition-colors hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                {t.pages.motorcycleTravels.readFullStory}
              </LocalizedLink>
            )}
          </div>
        </div>
      </header>

      <MotoDetailStatsCards travel={travel} locale={locale as SupportedLocale} />

      {hasMap && travel.map && (
        <MotoRouteSection
          map={travel.map}
          coords={travel.coords}
          slug={travel.slug}
          title={travel.title}
          locale={locale as SupportedLocale}
          featuredPasses={travel.featuredPasses}
        />
      )}

      {hasMotoItineraryAccordionItems(travel.timeline) && (
        <section className="relative z-[2] mx-auto max-w-7xl border-t border-brand-outline-variant/30 px-6 pt-12 pb-16 md:px-12 md:pb-20">
          <TravelItineraryAccordion
            timeline={travel.timeline}
            map={travel.map}
            heading={t.components.travelTabs.itinerary}
          />
        </section>
      )}
    </article>
  );
}
