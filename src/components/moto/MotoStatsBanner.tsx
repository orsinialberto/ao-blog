import { getTranslations } from "@/i18n";
import type { MotoTravelStats } from "@/lib/travels";
import type { SupportedLocale } from "@/config/locales";

interface MotoStatsBannerProps {
  stats: MotoTravelStats;
  locale: SupportedLocale;
}

export function MotoStatsBanner({ stats, locale }: MotoStatsBannerProps) {
  const t = getTranslations(locale);
  const localeString = locale === "it" ? "it-IT" : "en-US";
  const m = t.components.motoTravel;

  const statsItems = [
    {
      value: stats.totalKm,
      label: m.kmRidden,
      suffix: ` ${t.components.travelTimeline.kilometers}`,
    },
    {
      value: stats.countries,
      label: m.countriesVisited,
    },
    {
      value: stats.mountainPasses,
      label: m.mountainPasses,
    },
    {
      value: stats.tiresConsumed,
      label: m.tiresConsumed,
    },
  ];

  return (
    <section className="mx-auto max-w-screen-xl px-8 py-10 text-center md:py-12">
      <div className="mb-6 flex items-center justify-center gap-4 md:mb-8">
        <span className="h-[1px] w-12 bg-brand-outline-variant/50" />
        <span className="font-label text-xs uppercase tracking-widest text-brand-secondary">
          {m.sectionLabel}
        </span>
        <span className="h-[1px] w-12 bg-brand-outline-variant/50" />
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
        {statsItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="font-headline text-2xl text-brand-primary tabular-nums md:text-3xl">
              {item.value.toLocaleString(localeString)}
              {item.suffix ?? ""}
            </div>
            <div className="mt-1.5 font-label text-xs uppercase tracking-widest text-brand-muted">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
