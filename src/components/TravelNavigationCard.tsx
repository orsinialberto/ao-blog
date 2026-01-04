import { formatDateRange } from "@/lib/dates";
import type { Travel } from "@/lib/travels";
import { LocalizedLink } from "./LocalizedLink";
import type { SupportedLocale } from "@/config/locales";
import { getTranslations } from "@/i18n";

interface TravelNavigationCardProps {
  label: string;
  travel?: Travel;
  align?: "start" | "end";
  locale: SupportedLocale;
}

export function TravelNavigationCard({ 
  label, 
  travel, 
  align = "start",
  locale
}: TravelNavigationCardProps) {
  const t = getTranslations(locale);
  
  if (!travel) {
    return (
      <div className="border border-dashed border-slate-200 bg-white p-6 text-brand-muted">
        {label}
        <p className="text-sm">{t.components.travelNavigationCard.comingSoon}</p>
      </div>
    );
  }

  return (
    <LocalizedLink
      href={`/viaggi/${travel.slug}`}
      className={`bg-white p-6 shadow-card transition hover:-translate-y-1 ${
        align === "end" ? "text-right" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-brand-primary">{travel.title}</p>
      <p className="text-sm text-brand-muted">{formatDateRange(travel.date, travel.endDate, locale)}</p>
    </LocalizedLink>
  );
}

