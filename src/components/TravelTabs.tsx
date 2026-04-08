"use client";

import { useState } from "react";
import { TravelGallery } from "@/components/TravelGallery";
import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";
import { TravelItineraryAccordion } from "@/components/TravelItineraryAccordion";
import { hasItineraryAccordionItems } from "@/lib/itineraryAccordion";
import { useTranslations } from "@/i18n/hooks";
import type { TravelCoords, TravelMapData, TravelTimelineItem } from "@/lib/travels";

interface TravelTabsProps {
  content: string;
  gallery?: string[];
  timeline?: TravelTimelineItem[];
  map?: TravelMapData;
  coords?: TravelCoords;
  title: string;
  /** When true, the map is not repeated in the Itinerary tab (e.g. shown above on moto pages). */
  hideItineraryMap?: boolean;
}

type Tab = "narrative" | "itinerary" | "gallery";

export function TravelTabs({
  content,
  gallery,
  timeline,
  map,
  coords,
  title,
  hideItineraryMap = false,
}: TravelTabsProps) {
  const t = useTranslations();
  const hasGallery = (gallery?.length ?? 0) > 0;
  const hasMap = !!(map?.gpx || map?.kml || map?.kmz || (map?.points?.length ?? 0) > 0);
  const hasItinerary =
    (timeline?.length ?? 0) > 0 ||
    (map?.points?.length ?? 0) > 0 ||
    (!hideItineraryMap && !!(map?.gpx || map?.kml || map?.kmz));

  const [activeTab, setActiveTab] = useState<Tab>("narrative");

  const hasAccordionItems = hasItineraryAccordionItems(timeline, map);

  const tabs = [
    { id: "narrative" as Tab, label: t.components.travelTabs.narrative, show: true },
    { id: "itinerary" as Tab, label: t.components.travelTabs.itinerary, show: hasItinerary },
    { id: "gallery" as Tab, label: t.components.travelTabs.gallery, show: hasGallery },
  ].filter((tab) => tab.show);

  return (
    <div className="min-w-0">
      {tabs.length > 1 && (
        <div className="flex items-center gap-10 border-b border-brand-outline-variant/30 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-headline text-lg md:text-xl transition-colors focus:outline-none ${
                activeTab === tab.id
                  ? "text-brand-primary border-b-2 border-brand-primary -mb-px"
                  : "text-brand-outline hover:text-brand-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "narrative" && (
        <div
          className="prose-travel"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {activeTab === "itinerary" && hasItinerary && (
        <div
          className={`grid grid-cols-1 gap-12 ${!hideItineraryMap && hasMap && map ? "md:grid-cols-2" : ""}`}
        >
          <TravelItineraryAccordion timeline={timeline} map={map} />
          {!hideItineraryMap && hasMap && map && (
            <div
              className={`h-[480px] overflow-hidden rounded-xl bg-brand-surface-low${!hasAccordionItems ? " md:col-span-2" : ""}`}
            >
              <TravelDetailMapLazy map={map} fallbackCoords={coords} title={title} />
            </div>
          )}
        </div>
      )}

      {activeTab === "gallery" && hasGallery && (
        <TravelGallery images={gallery} title={title} />
      )}
    </div>
  );
}
