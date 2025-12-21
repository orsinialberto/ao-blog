import type { Travel } from "./travels";

export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

export function tagsMatch(tag1: string, tag2: string): boolean {
  return normalizeTag(tag1) === normalizeTag(tag2);
}

export function filterTravelsByTag(travels: Travel[], tag: string): Travel[] {
  const normalizedTag = normalizeTag(tag);
  return travels.filter((travel) =>
    travel.tags.some((travelTag) => tagsMatch(travelTag, tag)) ||
    tagsMatch(travel.location, tag)
  );
}

