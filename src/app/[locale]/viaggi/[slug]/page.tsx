import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { RelatedWaypoints } from "@/components/RelatedWaypoints";
import { TravelTabs } from "@/components/TravelTabs";
import { formatDateRange } from "@/lib/dates";
import { getAllTravels, getTravelBySlug } from "@/lib/travels";
import { getRelatedTravels } from "@/lib/travelNavigation";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { getLocaleFromParams, getAllLocalizedPaths, createLocalizedPath } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";
import { supportedLocales } from "@/config/locales";

interface TravelPageProps {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}

export async function generateStaticParams() {
  const allParams: Array<{ locale: SupportedLocale; slug: string }> = [];
  
  for (const locale of supportedLocales) {
    const travels = await getAllTravels(locale);
    const travelParams = travels.map((travel) => ({ slug: travel.slug }));
    allParams.push(...travelParams.map((params) => ({ locale, ...params })));
  }
  
  return allParams;
}

export async function generateMetadata({
  params,
}: TravelPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = await getLocaleFromParams(resolvedParams);
  const travel = await getTravelBySlug(resolvedParams.slug, locale);

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

export default async function TravelPage({ params }: TravelPageProps) {
  const resolvedParams = await params;
  const locale = await getLocaleFromParams(resolvedParams);
  const travel = await getTravelBySlug(resolvedParams.slug, locale);
  const travels = await getAllTravels(locale);
  const relatedTravels = getRelatedTravels(travels, travel.slug);
  const t = getTranslations(locale as SupportedLocale);

  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: 1920,
    quality: 85,
  });

  return (
    <article>
      {/* Hero Section — full-bleed */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-end pb-16 md:pb-24 px-8 md:px-20 min-w-0">
        <Image
          src={optimizedCoverImage}
          alt={travel.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full min-w-0 max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 mb-6 w-full min-w-0">
            {travel.tags.map((tag) => (
              <Link
                key={tag}
                href={`${createLocalizedPath("/viaggi", locale)}?tag=${encodeURIComponent(tag)}`}
                className="font-label text-white/90 uppercase tracking-[0.2em] text-[10px] bg-brand-primary/40 backdrop-blur-sm px-3 py-1 rounded hover:bg-brand-primary/60 transition-colors max-w-full break-words"
              >
                {tag}
              </Link>
            ))}
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 md:mb-8 font-bold tracking-tight break-words">
            {travel.title}
          </h1>

          <p className="font-body text-lg md:text-xl text-brand-surface-high max-w-2xl w-full min-w-0 leading-relaxed break-words">
            {travel.description}
          </p>
        </div>
      </section>

      {/* Article Layout — 8 + 4 grid */}
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 min-w-0">
        {/* Main Content */}
        <div className="lg:col-span-8 min-w-0">
          <TravelTabs
            content={travel.content}
            gallery={travel.gallery}
            timeline={travel.timeline}
            map={travel.map}
            coords={travel.coords}
            title={travel.title}
          />
        </div>

        {/* Sidebar — Logbook */}
        <aside className="lg:col-span-4 min-w-0">
          <div className="sticky top-32 space-y-12">
            <div className="bg-brand-surface-low p-8 md:p-10 rounded-xl">
              <h3 className="font-label text-xs uppercase tracking-[0.25em] text-brand-outline mb-8">
                {t.components.travelLogbook.title}
              </h3>

              <div className="space-y-7">
                {travel.location && (
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold block mb-2">
                      {t.components.travelLogbook.location}
                    </label>
                    <p className="font-body text-sm text-brand-muted">{travel.location}</p>
                  </div>
                )}

                {travel.coords && (
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold block mb-2">
                      {t.components.travelLogbook.coordinates}
                    </label>
                    <p className="font-body text-sm text-brand-muted">
                      {travel.coords.lat.toFixed(4)}° N, {travel.coords.lng.toFixed(4)}° E
                    </p>
                  </div>
                )}

                {travel.duration && (
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold block mb-2">
                      {t.components.travelLogbook.duration}
                    </label>
                    <p className="font-body text-sm text-brand-muted">{travel.duration}</p>
                  </div>
                )}

                {travel.totalKilometers && (
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold block mb-2">
                      {t.components.travelLogbook.totalKilometers}
                    </label>
                    <p className="font-body text-sm text-brand-muted">
                      {travel.totalKilometers} {t.components.travelTimeline.kilometers}
                    </p>
                  </div>
                )}

                {travel.tags.length > 0 && (
                  <div className="pt-6 border-t border-brand-outline-variant/30">
                    <label className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold block mb-4">
                      {t.components.travelLogbook.tags}
                    </label>
                    <ul className="font-body text-xs text-brand-muted space-y-3">
                      {travel.tags.map((tag) => (
                        <li key={tag} className="flex items-start gap-3 min-w-0">
                          <span className="w-1.5 h-1.5 bg-brand-accent-dim rounded-full flex-shrink-0 mt-1.5" />
                          <Link
                            href={`${createLocalizedPath("/viaggi", locale)}?tag=${encodeURIComponent(tag)}`}
                            className="min-w-0 break-words hover:text-brand-primary transition-colors"
                          >
                            {tag}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6 border-t border-brand-outline-variant/30">
                  <p className="font-body text-xs text-brand-outline">
                    {formatDateRange(travel.date, travel.endDate, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Waypoints */}
      <RelatedWaypoints travels={relatedTravels} locale={locale as SupportedLocale} />
    </article>
  );
}
