"use client";

import { useMemo } from "react";

import { useTranslations } from "@/i18n/hooks";
import type { TravelMapData, TravelTimelineItem } from "@/lib/travels";

interface AccordionItem {
  title: string;
  description?: string;
  from?: string;
  to?: string;
  km?: number;
  elevationGain?: number;
}

export interface TravelItineraryAccordionProps {
  timeline?: TravelTimelineItem[];
  map?: TravelMapData;
  /** Optional heading above the list (e.g. tab label “Tappe”). */
  heading?: string;
  className?: string;
}

export function TravelItineraryAccordion({
  timeline,
  map,
  heading,
  className = "",
}: TravelItineraryAccordionProps) {
  const t = useTranslations();

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
  }, [timeline, map]);

  if (accordionItems.length === 0) {
    return null;
  }

  return (
    <div className={`min-w-0 ${className}`.trim()}>
      {heading ? (
        <h2 className="mb-8 font-headline text-2xl font-bold tracking-tight text-brand-primary md:text-3xl">
          {heading}
        </h2>
      ) : null}
      <div className="divide-y divide-brand-outline-variant/30 border-t border-brand-outline-variant/30">
        {accordionItems.map((item, index) => {
          const hasStats = !!(
            item.from ||
            item.to ||
            item.km !== undefined ||
            item.elevationGain !== undefined
          );
          const hasContent = !!(item.description || hasStats);

          const headerInner = (
            <>
              <div className="flex min-w-0 items-center gap-4">
                <span className="shrink-0 font-label text-[10px] uppercase tracking-widest text-brand-outline">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-headline text-lg font-bold text-brand-primary break-words">
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
                  className="shrink-0 text-brand-outline transition-transform duration-300 group-open:rotate-180"
                  aria-hidden
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </>
          );

          if (hasContent) {
            return (
              <details key={index} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left transition-colors marker:content-none hover:text-brand-primary [&::-webkit-details-marker]:hidden">
                  {headerInner}
                </summary>
                <div className="space-y-4 pb-6 pl-10">
                  {item.description ? (
                    <p className="font-body text-sm text-brand-muted">{item.description}</p>
                  ) : null}
                  {hasStats ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {item.from && (
                        <div>
                          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                            {t.components.travelTabs.stageFrom}
                          </p>
                          <p className="font-body text-sm text-brand-muted">{item.from}</p>
                        </div>
                      )}
                      {item.to && (
                        <div>
                          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                            {t.components.travelTabs.stageTo}
                          </p>
                          <p className="font-body text-sm text-brand-muted">{item.to}</p>
                        </div>
                      )}
                      {item.km !== undefined && (
                        <div>
                          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                            {t.components.travelTabs.stageDistance}
                          </p>
                          <p className="font-body text-sm text-brand-muted">
                            {item.km} {t.components.travelTimeline.kilometers}
                          </p>
                        </div>
                      )}
                      {item.elevationGain !== undefined && (
                        <div>
                          <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                            {t.components.travelTabs.stageElevation}
                          </p>
                          <p className="font-body text-sm text-brand-muted">+{item.elevationGain} m</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </details>
            );
          }

          return (
            <div key={index} className="flex items-center justify-between gap-4 py-5">
              {headerInner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
