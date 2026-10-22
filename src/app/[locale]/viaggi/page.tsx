import type { Metadata } from "next";

import { TravelsWorldMap } from "@/components/TravelsWorldMap";
import { TravelsListClient } from "@/components/TravelsListClient";
import { getTravelsForArchive } from "@/lib/travels";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelsPageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/viaggi");
}

export async function generateMetadata({
  params,
}: TravelsPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);

  return {
    title: t.pages.travels.title,
    description: t.pages.travels.description,
  };
}

export default async function TravelsPage({ params }: TravelsPageProps) {
  const locale = await getLocaleFromParams(params);
  const allTravels = await getTravelsForArchive(locale);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <TravelsWorldMap />
      <TravelsListClient allTravels={allTravels} locale={locale} />
    </div>
  );
}
