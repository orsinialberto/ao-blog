import { getTranslations } from "@/i18n";
import type { MotoTravelStats } from "@/lib/travels";
import type { SupportedLocale } from "@/config/locales";

interface MotoStatsBannerProps {
  stats: MotoTravelStats;
  locale: SupportedLocale;
}

export function MotoStatsBanner({ stats, locale }: MotoStatsBannerProps) {
  const t = getTranslations(locale);
  const nf = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US");
  const m = t.components.motoTravel;

  const items = [
    { value: nf.format(stats.totalKm), label: m.kmRidden },
    { value: nf.format(stats.countries), label: m.countriesVisited },
    { value: nf.format(stats.mountainPasses), label: m.mountainPasses },
    { value: nf.format(stats.mechanicalCompanions), label: m.mechanicalCompanion },
  ];

  return (
    <section className="bg-brand-surface-low py-12">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="font-headline text-2xl font-bold text-brand-primary md:text-3xl">
                {item.value}
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-brand-muted">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
