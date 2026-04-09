import type { Metadata } from "next";
import { Suspense } from "react";

import { TravelsListClient } from "@/components/TravelsListClient";
import { getArchiveTags, getTravelsForArchive } from "@/lib/travels";
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
  const t = getTranslations(locale as SupportedLocale);
  // Get all travels and tags for the current locale
  const allTravels = await getTravelsForArchive(locale);
  const tags = getArchiveTags(locale);

  return (
    <div className="container space-y-16 pb-32">
      <header className="text-center max-w-2xl mx-auto space-y-6 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold text-brand-primary tracking-tight">
          {t.pages.travels.heading}
        </h1>
        <p className="text-lg font-headline italic text-brand-muted/80 leading-relaxed">
          {t.pages.travels.subtitle}
        </p>
      </header>

      <Suspense fallback={<div>{t.common.loading}</div>}>
        <TravelsListClient allTravels={allTravels} allTags={tags} />
      </Suspense>
    </div>
  );
}
