import type { ReactNode } from "react";

import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";
import type { Travel } from "@/lib/travels";

interface MotoDetailStatsCardsProps {
  travel: Travel;
  locale: SupportedLocale;
}

function StatCard({
  label,
  value,
  valueClassName = "text-2xl md:text-3xl",
  children,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border-b-4 border-brand-primary bg-white p-6 shadow-xl md:p-8">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface-high text-brand-secondary">
        {children}
      </div>
      <p className="mb-1 font-label text-xs font-bold uppercase tracking-widest text-brand-outline">
        {label}
      </p>
      <p className={`font-headline font-bold tracking-tight text-brand-primary ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

export function MotoDetailStatsCards({ travel, locale }: MotoDetailStatsCardsProps) {
  const t = getTranslations(locale);
  const m = t.components.motoTravel;
  const nf = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US");
  const dash = m.notSpecified;

  const km =
    travel.totalKilometers != null
      ? `${nf.format(travel.totalKilometers)} ${t.components.travelTimeline.kilometers}`
      : dash;

  const motorcycle = travel.motorcycle?.trim() || dash;
  const regions = travel.motoRegions?.trim() || travel.location?.trim() || dash;

  return (
    <section className="relative z-10 -mt-16 px-6 md:px-12">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label={m.totalDistance} value={km}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M8.5 15.5L15.5 8.5" strokeLinecap="round" />
          </svg>
        </StatCard>
        <StatCard label={m.duration} value={travel.duration?.trim() || dash}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
        </StatCard>
        <StatCard label={m.motorcycle} value={motorcycle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.2-3.2L16 8h-3V6H9v5l-1.6 1.6c.3.6.5 1.3.5 2.2 0 2.2-1.8 4-4 4H5v-2h1c1.1 0 2-.9 2-2s-.9-2-2-2H5V8h4V6h2l1.2-3H19l-2.8 5.8z" />
          </svg>
        </StatCard>
        <StatCard label={m.regions} value={regions} valueClassName="text-base md:text-lg leading-snug">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
          </svg>
        </StatCard>
      </div>
    </section>
  );
}
