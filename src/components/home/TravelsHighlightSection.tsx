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
    <section className="bg-brand-surface-low py-24 px-8">
      <div className="max-w-screen-2xl mx-auto">
        <SectionHeader
          label={t.components.sectionHeader.latestPublications}
          subtitle={t.components.sectionHeader.latestPublicationsSubtitle}
          linkText={t.components.sectionHeader.seeAll}
          linkHref="/viaggi"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Row 1: Feature card (7 cols) + sidebar stack (5 cols) */}
          <article className="md:col-span-7">
            <MosaicTravelCard
              travel={featured}
              locale={locale}
              variant="feature"
            />
          </article>

          <div className="md:col-span-5 flex flex-col gap-12">
            {rest[0] && (
              <MosaicTravelCard
                travel={rest[0]}
                locale={locale}
                variant="sidebar"
              />
            )}
            {rest[1] && (
              <MosaicTravelCard
                travel={rest[1]}
                locale={locale}
                variant="sidebar"
              />
            )}
          </div>

          {/* Row 2: Square card (4 cols) + wide card (8 cols) */}
          {rest[2] && (
            <article className="md:col-span-4">
              <MosaicTravelCard
                travel={rest[2]}
                locale={locale}
                variant="square"
              />
            </article>
          )}
          {rest[3] && (
            <article className="md:col-span-8">
              <MosaicTravelCard
                travel={rest[3]}
                locale={locale}
                variant="wide"
              />
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
