import type { TravelMapData, TravelTimelineItem } from "@/lib/travels";

/** Same rules as TravelItineraryAccordion’s item list (layout + visibility). */
export function hasItineraryAccordionItems(
  timeline?: TravelTimelineItem[],
  map?: TravelMapData,
): boolean {
  if (timeline && timeline.length > 0) return true;
  return (map?.points?.length ?? 0) > 0;
}

/** Moto (on the road): itinerary accordion only when `timeline` is set in frontmatter. */
export function hasMotoItineraryAccordionItems(
  timeline?: TravelTimelineItem[],
): boolean {
  return (timeline?.length ?? 0) > 0;
}
