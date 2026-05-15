"use client";

import { useEffect, useState } from "react";
import { TravelGallery } from "@/components/TravelGallery";
import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";
import { TravelItineraryAccordion } from "@/components/TravelItineraryAccordion";
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

function IconExpand() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function IconCompress() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

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
  const hasMap = !!(
    map?.gpx ||
    map?.kml ||
    map?.kmz ||
    (map?.gpxSegments?.length ?? 0) > 0 ||
    (map?.points?.length ?? 0) > 0
  );
  const hasItinerary =
    (timeline?.length ?? 0) > 0 ||
    (map?.points?.length ?? 0) > 0 ||
    (!hideItineraryMap &&
      !!(map?.gpx || map?.kml || map?.kmz || (map?.gpxSegments?.length ?? 0) > 0));

  const [activeTab, setActiveTab] = useState<Tab>("narrative");
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  useEffect(() => {
    if (!isMapFullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMapFullscreen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMapFullscreen]);

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
              className={`pb-4 font-label text-xs uppercase tracking-[0.2em] transition-colors focus:outline-none ${
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
        <div className="flex flex-col gap-12">
          {!hideItineraryMap && hasMap && map && (
            <div
              className={
                isMapFullscreen
                  ? "fixed inset-0 z-50 bg-brand-surface-low"
                  : "relative h-[520px] overflow-hidden rounded-xl bg-brand-surface-low"
              }
            >
              <TravelDetailMapLazy map={map} fallbackCoords={coords} title={title} />
              <button
                type="button"
                onClick={() => setIsMapFullscreen((v) => !v)}
                aria-label={isMapFullscreen ? "Riduci mappa" : "Ingrandisci mappa a tutto schermo"}
                className="absolute bottom-3 right-3 z-10 rounded-md bg-white/90 p-1.5 shadow-md hover:bg-white transition-colors"
              >
                {isMapFullscreen ? <IconCompress /> : <IconExpand />}
              </button>
            </div>
          )}
          <TravelItineraryAccordion timeline={timeline} map={map} />
        </div>
      )}

      {activeTab === "gallery" && hasGallery && (
        <TravelGallery images={gallery} title={title} />
      )}
    </div>
  );
}
