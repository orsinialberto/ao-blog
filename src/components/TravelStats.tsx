import type { TravelStats } from "@/lib/travels";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelStatsProps {
  stats: TravelStats;
  locale: SupportedLocale;
}

export function TravelStats({ stats, locale }: TravelStatsProps) {
  const t = getTranslations(locale);
  const localeString = locale === "it" ? "it-IT" : "en-US";

  const statsItems = [
    {
      value: stats.countriesVisited,
      label: t.components.travelStats.countriesVisited,
    },
    {
      value: stats.continentsVisited,
      label: t.components.travelStats.continentsVisited,
    },
    {
      value: stats.kilometersWalked,
      label: t.components.travelStats.kilometersWalked,
      suffix: ` ${t.components.travelTimeline.kilometers}`,
    },
    {
      value: stats.brokenShoes,
      label: t.components.travelStats.brokenShoes,
    },
  ];

  return (
    <section className="py-24 px-8 max-w-screen-xl mx-auto text-center">
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className="h-[1px] w-12 bg-brand-outline-variant/50" />
        <span className="font-label text-brand-secondary text-xs uppercase tracking-widest">
          {t.components.travelStats.sectionLabel ?? ""}
        </span>
        <span className="h-[1px] w-12 bg-brand-outline-variant/50" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {statsItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="font-headline text-3xl md:text-5xl text-brand-primary">
              {item.value.toLocaleString(localeString)}
              {item.suffix}
            </div>
            <div className="mt-2 font-label text-xs md:text-sm uppercase tracking-widest text-brand-muted">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

