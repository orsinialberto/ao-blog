import Image from "next/image";
import type { TravelStats } from "@/lib/travels";
import { withBasePath } from "@/lib/paths";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelStatsProps {
  stats: TravelStats;
  locale: SupportedLocale;
}

export function TravelStats({ stats, locale }: TravelStatsProps) {
  const t = getTranslations(locale);
  
  // Get locale string for number formatting (e.g., "it-IT", "en-US")
  const localeString = locale === "it" ? "it-IT" : "en-US";
  
  const statsItems = [
    {
      value: stats.countriesVisited,
      label: t.components.travelStats.countriesVisited,
      icon: withBasePath("/images/icons/countries.png"),
    },
    {
      value: stats.continentsVisited,
      label: t.components.travelStats.continentsVisited,
      icon: withBasePath("/images/icons/continents.png"),
    },
    {
      value: stats.kilometersWalked,
      label: t.components.travelStats.kilometersWalked,
      suffix: ` ${t.components.travelTimeline.kilometers}`,
      icon: withBasePath("/images/icons/kilometers.png"),
    },
    {
      value: stats.brokenShoes,
      label: t.components.travelStats.brokenShoes,
      icon: withBasePath("/images/icons/shoes.png"),
    },
  ];

  return (
    <section className="bg-gradient-to-br from-stone-50 via-slate-50 to-white border-y border-slate-200 pt-24 pb-24 w-full">
      <div className="lg:px-24">
        <div className="grid grid-cols-2 gap-16 md:grid-cols-4 md:gap-20">
          {statsItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-8 md:mb-10">
                <div className="relative w-20 h-20 md:w-28 md:h-28">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80px, 112px"
                  />
                </div>
              </div>
              <div className="font-klee text-3xl font-semibold text-brand-primary md:text-4xl">
                {item.value.toLocaleString(localeString)}
                {item.suffix}
              </div>
              <div className="mt-4 font-klee text-xs text-brand-muted md:text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

