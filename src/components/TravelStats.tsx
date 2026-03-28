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
    <section className="relative z-10 -mt-20 px-4 lg:px-24">
      <div className="mx-auto max-w-5xl rounded-2xl bg-brand-primary px-6 py-10 md:px-12 md:py-14">
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {statsItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="font-klee text-2xl font-semibold text-white md:text-5xl">
                {item.value.toLocaleString(localeString)}
                {item.suffix}
              </div>
              <div className="mt-1 font-klee text-[10px] text-white/60 md:mt-2 md:text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

