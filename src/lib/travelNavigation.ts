import type { Travel } from "./travels";

export interface TravelNavigation {
  previous?: Travel;
  next?: Travel;
}

export function getTravelNavigation(
  travels: Travel[],
  currentSlug: string
): TravelNavigation {
  const currentIndex = travels.findIndex((item) => item.slug === currentSlug);
  
  return {
    previous: travels[currentIndex + 1],
    next: travels[currentIndex - 1],
  };
}

