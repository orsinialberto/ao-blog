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
  const motoTravels = getMotoTravels(locale);
  const stats = getMotoTravelStats(locale);

  return (
    <div className="min-w-0">
      <MotoStatsBanner stats={stats} locale={locale as SupportedLocale} />

      <section className="mx-auto max-w-screen-2xl space-y-16 px-6 py-20 md:px-12">
        {motoTravels.map((travel) => (
          <MotoTravelRow key={travel.slug} travel={travel} locale={locale as SupportedLocale} />
        ))}
      </section>
    </div>
  );
}
