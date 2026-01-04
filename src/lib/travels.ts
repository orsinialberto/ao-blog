/**
 * Travel data parsing and management
 * 
 * Multilingual File Convention:
 * - Italian (default): [slug].md (e.g., cambogia-2025.md)
 * - English: [slug].en.md (e.g., cambogia-2025.en.md)
 * - Slug must be identical across all language versions
 * 
 * Field Translation Policy:
 * 
 * TRANSLATED FIELDS (must be localized in each language version):
 * - title: Travel title
 * - description: Short description/summary
 * - content: Main Markdown content body
 * - duration: Duration string with units (e.g., "14 giorni" → "14 days")
 * - map.points[].description: Map point descriptions
 * 
 * COMMON FIELDS (must be identical across all language versions):
 * - slug, date, endDate, coverImage, tags, location
 * - coords (lat, lng)
 * - map.gpx/kml/kmz, map.points[].name, map.points[].lat, map.points[].lng
 * - gallery, heroTitleVariant, totalKilometers
 * - timeline[].city (proper nouns, not translated), timeline[].km
 * 
 * See MARKDOWN_I18N_CONVENTION.md for complete documentation and field-by-field policy.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkBreaks from "remark-breaks";
import { CONTINENT_TAGS, isContinentTag } from "@/config/continents";
import { visitedCities } from "@/config/visitedCities";
import { isNonEmptyString, isValidNumber, isObject } from "./typeGuards";

export interface TravelCoords {
  lat: number;
  lng: number;
}

export interface TravelMapPoint {
  name: string;
  description?: string;
  lat: number;
  lng: number;
}

export interface TravelMapData {
  gpx?: string;
  kml?: string;
  kmz?: string;
  points?: TravelMapPoint[];
}

export interface TravelTimelineItem {
  city: string;
  km?: number;
}

export interface Travel {
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  description: string;
  coverImage: string;
  tags: string[];
  location: string;
  duration: string;
  content: string;
  gallery?: string[];
  coords?: TravelCoords;
  heroTitleVariant: "light" | "dark";
  map?: TravelMapData;
  totalKilometers?: number;
  timeline?: TravelTimelineItem[];
}

const travelsDirectory = path.join(process.cwd(), "src", "content", "travels");
export type Locale = "it" | "en";
const travelCache = new Map<Locale, Travel[]>();

/**
 * Gets the filename for a travel based on slug and locale.
 * 
 * @param slug - Base slug of the travel (without locale extension)
 * @param locale - Locale code ('it' for Italian, 'en' for English)
 * @returns Filename with appropriate locale extension
 */
function getTravelFileName(slug: string, locale: Locale): string {
  if (locale === "it") {
    return `${slug}.md`;
  }
  return `${slug}.${locale}.md`;
}

/**
 * Extracts the base slug and locale from a filename.
 * 
 * @param filename - Markdown filename (e.g., "cambogia-2025.md" or "cambogia-2025.en.md")
 * @returns Object with base slug and locale, or null if filename doesn't match pattern
 */
function parseFilename(filename: string): { slug: string; locale: Locale } | null {
  // Match pattern: [slug].md or [slug].[locale].md
  const match = filename.match(/^(.+?)(?:\.(en))?\.md$/);
  if (!match) {
    return null;
  }

  const [, slug, locale] = match;
  return {
    slug,
    locale: (locale as Locale) || "it",
  };
}

/**
 * Builds the travel cache for a specific locale by reading Markdown files.
 * 
 * File naming convention:
 * - [slug].md → Italian (default)
 * - [slug].en.md → English
 * See MARKDOWN_I18N_CONVENTION.md for details.
 * 
 * @param locale - Locale to build cache for
 * @returns Array of Travel objects for the specified locale
 */
function buildCache(locale: Locale): Travel[] {
  const files = fs.readdirSync(travelsDirectory);
  const travels: Travel[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) {
      continue;
    }

    const parsed = parseFilename(file);
    if (!parsed || parsed.locale !== locale) {
      continue;
    }

    try {
      const travel = parseTravelFromFile(parsed.slug, locale);
      travels.push(travel);
    } catch (error) {
      // Log error but continue processing other files
      console.error(`Error parsing travel file ${file}:`, error);
    }
  }

  const sorted = sortTravelsByDate(travels);
  travelCache.set(locale, sorted);
  return sorted;
}

/**
 * Ensures the cache is built for the specified locale.
 * 
 * @param locale - Locale to ensure cache for (defaults to 'it')
 * @returns Array of Travel objects for the specified locale
 */
function ensureCache(locale: Locale = "it"): Travel[] {
  const cached = travelCache.get(locale);
  if (cached) {
    return cached;
  }

  return buildCache(locale);
}

/**
 * Parses a travel Markdown file into a Travel object.
 * 
 * This function reads frontmatter fields and processes the Markdown content.
 * The parsing logic automatically handles translated fields based on the locale:
 * 
 * TRANSLATED FIELDS (read from locale-specific file):
 * - title: Travel title (e.g., "Cambogia" in Italian, "Cambodia" in English)
 * - description: Short description/summary (fully translated)
 * - content: Main Markdown content body (fully translated)
 * - duration: Duration string with localized units (e.g., "14 giorni" → "14 days")
 * - map.points[].description: Map point descriptions (fully translated)
 * 
 * COMMON FIELDS (must be identical in all language versions):
 * - slug, date, endDate, coverImage, tags, location
 * - coords (lat, lng)
 * - map.gpx/kml/kmz, map.points[].name, map.points[].lat, map.points[].lng
 * - gallery, heroTitleVariant, totalKilometers
 * - timeline[].city (proper nouns, not translated), timeline[].km
 * 
 * @param slug - Base slug of the travel (without locale extension)
 * @param locale - Locale to load ('it' for Italian, 'en' for English, defaults to 'it')
 * @returns Parsed Travel object with fields appropriate for the specified locale
 * @throws Error if file doesn't exist or mandatory fields are missing
 */
function parseTravelFromFile(slug: string, locale: Locale = "it"): Travel {
  const fileName = getTravelFileName(slug, locale);
  const filePath = path.join(travelsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Travel file not found: ${fileName} (slug: ${slug}, locale: ${locale})`
    );
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const processedContent = remark().use(remarkBreaks).use(html).processSync(content);

  if (!data.title || !data.date || !data.description || !data.coverImage) {
    throw new Error(
      `Missing mandatory fields in travel ${slug} (locale: ${locale})`
    );
  }

  return {
    slug: data.slug ?? slug,
    title: data.title,
    date: data.date,
    endDate: data.endDate,
    description: data.description,
    coverImage: data.coverImage,
    tags: Array.isArray(data.tags) ? data.tags : [],
    location: data.location ?? "",
    duration: data.duration ?? "",
    gallery: Array.isArray(data.gallery) ? data.gallery : undefined,
    coords: parseCoords(data.coords),
    content: processedContent.toString(),
    heroTitleVariant: parseHeroTitleVariant(data.heroTitleVariant),
    map: parseMap(data.map),
    totalKilometers: normalizeNumber(data.totalKilometers),
    timeline: parseTimeline(data.timeline),
  } satisfies Travel;
}

function parseCoords(rawCoords: unknown): Travel["coords"] {
  if (!isObject(rawCoords)) {
    return undefined;
  }

  const lat = normalizeNumber(rawCoords.lat);
  const lng = normalizeNumber(rawCoords.lng);

  if (lat === undefined || lng === undefined) {
    return undefined;
  }

  return { lat, lng };
}

function normalizeNumber(value: unknown): number | undefined {
  if (isValidNumber(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function parseHeroTitleVariant(value: unknown): Travel["heroTitleVariant"] {
  if (value === "dark") {
    return "dark";
  }

  return "light";
}

function parseMap(rawMap: unknown): Travel["map"] {
  if (!isObject(rawMap)) {
    return undefined;
  }

  const gpx = isNonEmptyString(rawMap.gpx) ? rawMap.gpx : undefined;
  const kml = isNonEmptyString(rawMap.kml) ? rawMap.kml : undefined;
  const kmz = isNonEmptyString(rawMap.kmz) ? rawMap.kmz : undefined;

  const pointsRaw = rawMap.points;
  const points = Array.isArray(pointsRaw)
    ? pointsRaw
        .map(parseMapPoint)
        .filter((point): point is TravelMapPoint => Boolean(point))
    : undefined;

  if (!gpx && !kml && !kmz && (!points || points.length === 0)) {
    return undefined;
  }

  return {
    gpx,
    kml,
    kmz,
    points,
  };
}

/**
 * Parses a map point from raw frontmatter data.
 * 
 * Note: The `description` field is translated (localized per language version),
 * while `name`, `lat`, and `lng` must remain identical across all language versions.
 * 
 * @param rawPoint - Raw point data from frontmatter
 * @returns Parsed TravelMapPoint or undefined if invalid
 */
function parseMapPoint(rawPoint: unknown): TravelMapPoint | undefined {
  if (!isObject(rawPoint)) {
    return undefined;
  }

  const lat = normalizeNumber(rawPoint.lat);
  const lng = normalizeNumber(rawPoint.lng);
  const name = isNonEmptyString(rawPoint.name) ? rawPoint.name.trim() : undefined;

  if (lat === undefined || lng === undefined || !name) {
    return undefined;
  }

  // Description is a translated field - it will be different in each language version
  const description = isNonEmptyString(rawPoint.description) 
    ? rawPoint.description.trim() 
    : undefined;

  return {
    name,
    description,
    lat,
    lng,
  };
}

function parseTimeline(rawTimeline: unknown): Travel["timeline"] {
  if (!Array.isArray(rawTimeline) || rawTimeline.length === 0) {
    return undefined;
  }

  const timeline = rawTimeline
    .map(parseTimelineItem)
    .filter((item): item is TravelTimelineItem => Boolean(item));

  if (timeline.length === 0) {
    return undefined;
  }

  return timeline;
}

function parseTimelineItem(rawItem: unknown): TravelTimelineItem | undefined {
  if (!isObject(rawItem)) {
    return undefined;
  }

  const city = isNonEmptyString(rawItem.city) ? rawItem.city.trim() : undefined;

  if (!city) {
    return undefined;
  }

  const km = normalizeNumber(rawItem.km);

  return {
    city,
    km,
  };
}

/**
 * Gets all travels for a specific locale.
 * 
 * @param locale - Locale to get travels for (defaults to 'it' for backward compatibility)
 * @returns Array of all Travel objects for the specified locale
 */
export async function getAllTravels(locale: Locale = "it"): Promise<Travel[]> {
  return ensureCache(locale);
}

/**
 * Gets a single travel by slug and locale.
 * 
 * @param slug - Base slug of the travel (without locale extension)
 * @param locale - Locale to load ('it' for Italian, 'en' for English, defaults to 'it')
 * @returns Travel object for the specified slug and locale
 * @throws Error if travel is not found
 */
export async function getTravelBySlug(
  slug: string,
  locale: Locale = "it"
): Promise<Travel> {
  const travels = ensureCache(locale);
  const travel = travels.find((item) => item.slug === slug);

  if (!travel) {
    throw new Error(
      `Travel with slug ${slug} not found for locale ${locale}`
    );
  }

  return travel;
}

/**
 * Gets all unique tags from travels for a specific locale.
 * 
 * @param locale - Locale to get tags for (defaults to 'it' for backward compatibility)
 * @returns Sorted array of unique tag strings
 */
export function getAllTags(locale: Locale = "it"): string[] {
  const travels = ensureCache(locale);
  const tags = new Set<string>();
  travels.forEach((travel) => {
    travel.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

/**
 * Gets all travels matching a specific tag for a locale.
 * 
 * @param tag - Tag to filter by
 * @param locale - Locale to filter travels for (defaults to 'it' for backward compatibility)
 * @returns Array of Travel objects matching the tag
 */
export function getTravelsByTag(tag: string, locale: Locale = "it"): Travel[] {
  const travels = ensureCache(locale);
  const normalized = tag.toLowerCase();
  return travels.filter((travel) =>
    travel.tags.some((travelTag) => travelTag.toLowerCase() === normalized)
  );
}

export function sortTravelsByDate(travels: Travel[]): Travel[] {
  return [...travels].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return bDate - aDate;
  });
}

export interface TravelStats {
  countriesVisited: number;
  continentsVisited: number;
  kilometersWalked: number;
  brokenShoes: number;
}

/**
 * Gets travel statistics for a specific locale.
 * 
 * @param locale - Locale to get stats for (defaults to 'it' for backward compatibility)
 * @returns TravelStats object with aggregated statistics
 */
export function getTravelStats(locale: Locale = "it"): TravelStats {
  const travels = ensureCache(locale);
  
  // Paesi visitati (dalla location dei travels + dalle città visitate)
  const countries = new Set<string>();
  travels.forEach((travel) => {
    if (travel.location && travel.location.trim()) {
      countries.add(travel.location.trim());
    }
  });
  // Aggiungi paesi dalle città visitate
  visitedCities.forEach((city) => {
    countries.add(city.country);
  });
  
  // Continenti visitati (dai tags dei travels + dalle città visitate)
  const continents = new Set<string>();
  travels.forEach((travel) => {
    travel.tags.forEach((tag) => {
      if (isContinentTag(tag)) {
        continents.add(tag);
      }
    });
  });
  // Aggiungi continenti dalle città visitate
  visitedCities.forEach((city) => {
    if (city.continent && isContinentTag(city.continent)) {
      continents.add(city.continent);
    }
  });
  
  // Km percorsi nei cammini (solo viaggi con tag "Cammini")
  const kilometersWalked = travels
    .filter((travel) => 
      travel.tags.some((tag) => tag.toLowerCase() === "cammini") &&
      travel.totalKilometers !== undefined
    )
    .reduce((sum, travel) => sum + (travel.totalKilometers || 0), 0);
  
  return {
    countriesVisited: countries.size,
    continentsVisited: continents.size,
    kilometersWalked: Math.round(kilometersWalked),
    brokenShoes: 4,
  };
}
