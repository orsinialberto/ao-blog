import { MosaicTravelCard } from "./MosaicTravelCard";
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

  const [featured, ...rest] = travels;

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          label={t.components.sectionHeader.latestPublications}
          linkText={t.components.sectionHeader.seeAll}
          linkHref="/viaggi"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="md:col-span-2 h-72 md:h-96">
            <MosaicTravelCard
              travel={featured}
              locale={locale}
              variant="feature"
            />
          </article>

          {rest[0] && (
            <article className="h-56 md:h-64">
              <MosaicTravelCard
                travel={rest[0]}
                locale={locale}
                variant="square"
              />
            </article>
          )}
          {rest[1] && (
            <article className="h-56 md:h-64">
              <MosaicTravelCard
                travel={rest[1]}
                locale={locale}
                variant="square"
              />
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
