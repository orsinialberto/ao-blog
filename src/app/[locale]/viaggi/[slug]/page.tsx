import type { Metadata } from "next";

import { RelatedWaypoints } from "@/components/RelatedWaypoints";
import { WigglyText } from "@/components/WigglyText";
import { TravelTabs } from "@/components/TravelTabs";
import {
  getAllTravels,
  getTravelBySlug,
  getTravelsForArchive,
} from "@/lib/travels";
import { withBasePath } from "@/lib/paths";
import { getRelatedTravels } from "@/lib/travelNavigation";
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

  return (
    <article>
      {/* Hero Section — ruled notebook paper with a faint sketch, as in the home hero */}
      <section className="notebook-paper relative flex h-[70vh] min-w-0 items-center overflow-hidden pt-(--header-height) md:h-[85vh]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url(${withBasePath(travel.heroImage)})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-8 md:px-20">
          <div className="mx-auto max-w-5xl -translate-y-8 md:-translate-y-12">
            <h1 className="relative isolate mx-auto w-fit text-balance text-center font-hand text-4xl leading-[1.3] font-normal tracking-tight text-brand-primary wrap-break-word sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="hand-underline-lines">
                <WigglyText text={travel.title} />
              </span>
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
