'use client';

import { TravelCard } from '@/components/TravelCard';
import type { Travel } from '@/lib/travels';
import type { SupportedLocale } from '@/config/locales';
import { useTranslations } from '@/i18n/hooks';

interface TravelsListClientProps {
  allTravels: Travel[];
  locale: SupportedLocale;
}

export function TravelsListClient({ allTravels, locale }: TravelsListClientProps) {
  const t = useTranslations();

  if (allTravels.length === 0) {
    return (
      <p className="border border-dashed border-slate-200 bg-white p-6 text-center text-brand-muted">
        {t.components.travelsList.noTravelsWithTag}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allTravels.map((travel) => (
        <TravelCard key={travel.slug} travel={travel} locale={locale} />
      ))}
    </div>
  );
}
