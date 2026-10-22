import { TravelCard } from "./TravelCard";
import { SectionHeader } from "@/components/SectionHeader";
import { REST_BEAR_ID } from "./HeroQuoteSection";
import { ScrollPeekBear } from "./ScrollPeekBear";
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
    <section className="py-20 px-6 overflow-x-clip">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          plane
          label={t.components.sectionHeader.latestPublications}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Over half the bear shows at the viewport's left edge, looking at the cards; wide screens only, so it never covers one */}
          <ScrollPeekBear
            after={REST_BEAR_ID}
            className="absolute left-[calc(50%-50vw)] top-64 z-10 hidden w-60 -translate-x-[27%] min-[1440px]:block"
          />
          {travels.slice(0, 3).map((travel) => (
            <TravelCard key={travel.slug} travel={travel} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
