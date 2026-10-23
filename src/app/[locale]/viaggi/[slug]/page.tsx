import type { Metadata } from "next";
import Image from "next/image";

import { RelatedWaypoints } from "@/components/RelatedWaypoints";
import { TravelTabs } from "@/components/TravelTabs";
import {
  getAllTravels,
  getTravelBySlug,
  getTravelsForArchive,
} from "@/lib/travels";
import { getRelatedTravels } from "@/lib/travelNavigation";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { getLocaleFromParams } from "@/lib/i18n/routing";
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
  const relatedTravels = getRelatedTravels(getTravelsForArchive(locale), travel.slug);

  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: 1920,
    quality: 85,
  });

  return (
    <article>
      {/* Hero Section — full-bleed */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-center min-w-0">
        <Image
          src={optimizedCoverImage}
          alt={travel.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-primary/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full min-w-0 max-w-7xl mx-auto px-8 md:px-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="relative isolate w-fit mx-auto text-center before:absolute before:-inset-x-20 before:-inset-y-12 before:-z-10 before:backdrop-blur-[1px] before:[mask-image:radial-gradient(closest-side,black_70%,transparent)] font-hand text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] text-balance font-normal [-webkit-text-stroke:0.01em_currentColor] tracking-tight wrap-break-word">
              {travel.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Layout */}
      <div className="max-w-7xl mx-auto px-8 md:px-20 pt-6 md:pt-8 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 min-w-0">
        {/* Main Content */}
        <div className="lg:col-span-8 lg:col-start-3 min-w-0">
          <TravelTabs
            content={travel.content}
            gallery={travel.gallery}
            timeline={travel.timeline}
            map={travel.map}
            coords={travel.coords}
            title={travel.title}
          />
        </div>
      </div>

      {/* Related Waypoints */}
      <RelatedWaypoints travels={relatedTravels} locale={locale as SupportedLocale} />
    </article>
  );
}
