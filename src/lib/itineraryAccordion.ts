import type { TravelTimelineItem } from "@/lib/travels";

/** Moto (on the road): itinerary accordion only when `timeline` is set in frontmatter. */
export function hasMotoItineraryAccordionItems(
  timeline?: TravelTimelineItem[],
): boolean {
  return (timeline?.length ?? 0) > 0;
}
