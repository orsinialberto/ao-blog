import type { Metadata } from "next";

import { MotoStatsBanner } from "@/components/moto/MotoStatsBanner";
import { MotoTravelRow } from "@/components/moto/MotoTravelRow";
import { getTranslations } from "@/i18n";
import { getAllLocalizedPaths, getLocaleFromParams } from "@/lib/i18n/routing";
import { getMotoTravelStats, getMotoTravels } from "@/lib/travels";
import type { SupportedLocale } from "@/config/locales";

interface PageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/viaggi-in-moto");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale);
  const p = t.pages.motorcycleTravels;
  return {
    title: p.title,
    description: p.description,
  };
}

export default async function MotorcycleTravelsPage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);
  const motoTravels = getMotoTravels(locale);
  const stats = getMotoTravelStats(locale);
  const p = t.pages.motorcycleTravels;

  return (
    <div className="container min-w-0 pb-32">
      <header className="mx-auto max-w-2xl space-y-6 pt-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-brand-primary md:text-6xl">
          {p.heading}
        </h1>
        <p className="font-headline text-lg italic leading-relaxed text-brand-muted/80">
          {p.subtitle}
        </p>
      </header>

      <div className="mt-8">
        <MotoStatsBanner stats={stats} locale={locale as SupportedLocale} />
      </div>

      <section className="mt-12 space-y-16 border-t border-brand-outline-variant/20 pt-12">
        {motoTravels.map((travel) => (
          <MotoTravelRow key={travel.slug} travel={travel} locale={locale as SupportedLocale} />
        ))}
      </section>
    </div>
  );
}
