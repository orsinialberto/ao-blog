import type { TravelMapPointKind } from "@/lib/travels";

const PIN_OUTLINE =
  "M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z";

// SVG strings are constants; each call creates a fresh HTMLElement because a
// DOM node can only be attached to one MapLibre Marker at a time.
const TRAVEL_MARKER_SVG = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${PIN_OUTLINE}" fill="#dc2626"/>
  <circle cx="14" cy="14" r="6" fill="#ffffff"/>
  <path d="${PIN_OUTLINE}" stroke="#ffffff" stroke-width="2"/>
</svg>`;

const PASS_MARKER_SVG = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${PIN_OUTLINE}" fill="#0d9488"/>
  <circle cx="14" cy="14" r="6" fill="#ffffff"/>
  <path d="M9.2 16.2 L11.9 11 L13.7 13.8 L16.1 10.3 L18.8 16.2 Z" fill="#0f766e"/>
  <path d="${PIN_OUTLINE}" stroke="#ffffff" stroke-width="2"/>
</svg>`;

const CITY_MARKER_SVG = `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${PIN_OUTLINE}" fill="#2563eb"/>
  <circle cx="14" cy="14" r="6" fill="#ffffff"/>
  <path fill="#1d4ed8" d="M9.5 17.2h1.9v2.4H9.5zm3-1.2h2.1v3.6h-2.1zm3.3-1.8h2.4v5.4h-2.4z"/>
  <path d="${PIN_OUTLINE}" stroke="#ffffff" stroke-width="2"/>
</svg>`;

function createMarkerElement(svg: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "travel-marker-wrapper";
  el.innerHTML = svg;
  return el;
}

/** Classic red pin (default when `kind` is omitted on a map point). */
export function createTravelMarkerIcon(): HTMLElement {
  return createMarkerElement(TRAVEL_MARKER_SVG);
}

export function getTravelMarkerIconForKind(kind?: TravelMapPointKind): HTMLElement {
  if (kind === "pass") return createMarkerElement(PASS_MARKER_SVG);
  if (kind === "city") return createMarkerElement(CITY_MARKER_SVG);
  return createMarkerElement(TRAVEL_MARKER_SVG);
}

/** Returns the raw SVG string for a given kind — use with dangerouslySetInnerHTML in React. */
export function getMarkerSvgForKind(kind?: TravelMapPointKind): string {
  if (kind === "pass") return PASS_MARKER_SVG;
  if (kind === "city") return CITY_MARKER_SVG;
  return TRAVEL_MARKER_SVG;
}
