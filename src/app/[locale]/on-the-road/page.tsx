import type { Metadata } from "next";

import { assertOnTheRoadTranslations } from "@/components/maps/assertTranslations";
import MapsWindow from "@/components/maps/MapsWindow";
import { getLocaleFromParams, getAllLocalizedPaths } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface OnTheRoadPageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  assertOnTheRoadTranslations();
  return getAllLocalizedPaths("/on-the-road");
}

export async function generateMetadata({
  params,
}: OnTheRoadPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);

  return {
    title: t.onTheRoad.metaTitle,
    description: t.onTheRoad.metaDescription,
  };
}

export default async function OnTheRoadPage({ params }: OnTheRoadPageProps) {
  const locale = await getLocaleFromParams(params);

  return <MapsWindow locale={locale as SupportedLocale} />;
}
