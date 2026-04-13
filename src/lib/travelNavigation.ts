import type { Travel } from "./travels";

export function getRelatedTravels(
  travels: Travel[],
  currentSlug: string,
  limit = 3
): Travel[] {
  const current = travels.find((t) => t.slug === currentSlug);
  if (!current) return [];

  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  const scored = travels
    .filter((t) => t.slug !== currentSlug)
    .map((t) => {
      const shared = t.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
      return { travel: t, score: shared };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.travel.date).getTime() - new Date(a.travel.date).getTime());

  return scored.slice(0, limit).map((entry) => entry.travel);
}

