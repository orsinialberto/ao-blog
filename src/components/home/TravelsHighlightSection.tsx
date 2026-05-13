import { TravelCard } from "./TravelCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Travel } from "@/lib/travels";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelsHighlightSectionProps {
  travels: Travel[];
  locale: SupportedLocale;
}

export function TravelsHighlightSection({
  travels,
  locale,
}: TravelsHighlightSectionProps) {
  const t = getTranslations(locale);

  if (travels.length === 0) return null;

  return (
    <section className="pt-2 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label={t.components.sectionHeader.latestPublications}
          linkText={t.components.sectionHeader.seeAll}
          linkHref="/viaggi"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {travels.slice(0, 3).map((travel) => (
            <TravelCard key={travel.slug} travel={travel} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
