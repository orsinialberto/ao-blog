"use client";

import { useMemo, useState } from "react";
import { TravelGallery } from "@/components/TravelGallery";
import { TravelDetailMapLazy } from "@/components/map/TravelDetailMapLazy";
import { useTranslations } from "@/i18n/hooks";
import type { TravelCoords, TravelMapData, TravelTimelineItem } from "@/lib/travels";

interface TravelTabsProps {
  content: string;
  gallery?: string[];
  timeline?: TravelTimelineItem[];
  map?: TravelMapData;
  coords?: TravelCoords;
  title: string;
}

type Tab = "narrative" | "itinerary" | "gallery";

interface AccordionItem {
  title: string;
  description?: string;
  from?: string;
  to?: string;
  km?: number;
  elevationGain?: number;
}

export function TravelTabs({ content, gallery, timeline, map, coords, title }: TravelTabsProps) {
  const t = useTranslations();
  const hasGallery = (gallery?.length ?? 0) > 0;
  const hasMap = !!(map?.gpx || map?.kml || map?.kmz || (map?.points?.length ?? 0) > 0);
  const hasItinerary = (timeline?.length ?? 0) > 0 || hasMap;

  const [activeTab, setActiveTab] = useState<Tab>("narrative");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const accordionItems = useMemo<AccordionItem[]>(() => {
    if (timeline?.length) {
      return timeline.map((item) => {
        const matchingPoint = map?.points?.find(
          (p) => p.name.toLowerCase() === item.city.toLowerCase(),
        );
        return {
          title: item.city,
          description: matchingPoint?.description,
          from: item.from,
          to: item.to,
          km: item.km,
          elevationGain: item.elevationGain,
        };
      });
    }
    if ((map?.points?.length ?? 0) > 0) {
      return map!.points!.map((point) => ({
        title: point.name,
        description: point.description,
      }));
    }
    return [];
  }, [timeline, map?.points]);

  const tabs = [
    { id: "narrative" as Tab, label: t.components.travelTabs.narrative, show: true },
    { id: "itinerary" as Tab, label: t.components.travelTabs.itinerary, show: hasItinerary },
    { id: "gallery" as Tab, label: t.components.travelTabs.gallery, show: hasGallery },
  ].filter((tab) => tab.show);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {accordionItems.length > 0 && (
            <div className="divide-y divide-brand-outline-variant/30 border-t border-brand-outline-variant/30">
              {accordionItems.map((item, index) => {
                const isOpen = openIndex === index;
                const hasStats = !!(item.from || item.to || item.km !== undefined || item.elevationGain !== undefined);
                const hasContent = !!(item.description || hasStats);
                return (
                  <div key={index}>
                    <button
                      type="button"
                      onClick={() => hasContent && toggleAccordion(index)}
                      className={`w-full flex items-center justify-between py-5 text-left gap-4 transition-colors ${
                        hasContent ? "hover:text-brand-primary cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-label text-[10px] uppercase tracking-widest text-brand-outline shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-headline text-lg text-brand-primary font-bold">
                          {item.title}
                        </span>
                      </div>
                      {hasContent && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`shrink-0 text-brand-outline transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </button>
                    {isOpen && hasContent && (
                      <div className="pb-6 pl-10 space-y-4">
                        {hasStats && (
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {item.from && (
                              <div>
                                <p className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                                  {t.components.travelTabs.stageFrom}
                                </p>
                                <p className="font-body text-sm text-brand-muted">{item.from}</p>
                              </div>
                            )}
                            {item.to && (
                              <div>
                                <p className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                                  {t.components.travelTabs.stageTo}
                                </p>
                                <p className="font-body text-sm text-brand-muted">{item.to}</p>
                              </div>
                            )}
                            {item.km !== undefined && (
                              <div>
                                <p className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                                  {t.components.travelTabs.stageDistance}
                                </p>
                                <p className="font-body text-sm text-brand-muted">
                                  {item.km} {t.components.travelTimeline.kilometers}
                                </p>
                              </div>
                            )}
                            {item.elevationGain !== undefined && (
                              <div>
                                <p className="font-label text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1">
                                  {t.components.travelTabs.stageElevation}
                                </p>
                                <p className="font-body text-sm text-brand-muted">+{item.elevationGain} m</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {hasMap && (
            <div className={`h-[480px] overflow-hidden rounded-xl bg-brand-surface-low${accordionItems.length === 0 ? " md:col-span-2" : ""}`}>
              <TravelDetailMapLazy map={map!} fallbackCoords={coords} title={title} />
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
