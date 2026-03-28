import { TravelCard } from "@/components/TravelCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Travel } from "@/lib/travels";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface TravelsHighlightSectionProps {
  travels: Travel[];
  locale: SupportedLocale;
}

export function TravelsHighlightSection({ travels, locale }: TravelsHighlightSectionProps) {
  const t = getTranslations(locale);

  return (
    <section className="space-y-6 px-4 lg:px-24">
      <SectionHeader
        label={t.components.sectionHeader.latestPublications}
        linkText={t.components.sectionHeader.seeAll}
        linkHref="/viaggi"
      />

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {travels.map((travel) => (
          <TravelCard key={travel.slug} travel={travel} />
        ))}
      </div>
    </section>
  );
}

