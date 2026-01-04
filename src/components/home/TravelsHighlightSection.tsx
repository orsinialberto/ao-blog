import { TravelCard } from "@/components/TravelCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Travel } from "@/lib/travels";
import { strings } from "@/config/strings";

interface TravelsHighlightSectionProps {
  travels: Travel[];
}

export function TravelsHighlightSection({ travels }: TravelsHighlightSectionProps) {
  return (
    <section className="relative">
      <div className="px-4 lg:px-24">
        <div className="space-y-6">
          <SectionHeader
            label={strings.components.sectionHeader.latestPublications}
            linkText={strings.components.sectionHeader.seeAll}
            linkHref="/viaggi"
          />

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {travels.map((travel) => (
              <TravelCard key={travel.slug} travel={travel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

