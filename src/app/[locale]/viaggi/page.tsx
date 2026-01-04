import type { Metadata } from "next";
import { Suspense } from "react";

import { TravelsListClient } from "@/components/TravelsListClient";
import {
  getAllTags,
  getAllTravels,
} from "@/lib/travels";
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
  const allTravels = await getAllTravels();
  const tags = getAllTags();

  return (
    <div className="container space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          {t.pages.travels.archiveLabel}
        </p>
        <h1 className="text-4xl font-semibold text-brand-primary">{t.pages.travels.heading}</h1>
      </header>

      <Suspense fallback={<div>{t.common.loading}</div>}>
        <TravelsListClient allTravels={allTravels} allTags={tags} />
      </Suspense>
    </div>
  );
}
