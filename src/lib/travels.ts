import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkBreaks from "remark-breaks";

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
let travelCache: Travel[] | null = null;

function buildCache(): Travel[] {
  const files = fs.readdirSync(travelsDirectory);
  const travels = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return parseTravelFromFile(slug);
    });

  travelCache = sortTravelsByDate(travels);
  return travelCache;
}

function ensureCache(): Travel[] {
  if (!travelCache) {
    return buildCache();
  }

  return travelCache;
}

function parseTravelFromFile(slug: string): Travel {
  const filePath = path.join(travelsDirectory, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const processedContent = remark().use(remarkBreaks).use(html).processSync(content);

  if (!data.title || !data.date || !data.description || !data.coverImage) {
    throw new Error(`Missing mandatory fields in travel ${slug}`);
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
  if (
    !rawCoords ||
    typeof rawCoords !== "object" ||
    Array.isArray(rawCoords)
  ) {
    return undefined;
  }

  const maybeCoords = rawCoords as Record<string, unknown>;
  const lat = normalizeNumber(maybeCoords.lat);
  const lng = normalizeNumber(maybeCoords.lng);

  if (lat === undefined || lng === undefined) {
    return undefined;
  }

  return { lat, lng };
}

function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) {
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
  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) {
    return undefined;
  }

  const mapObject = rawMap as Record<string, unknown>;
  const gpx =
    typeof mapObject.gpx === "string" && mapObject.gpx.trim().length > 0
      ? mapObject.gpx
      : undefined;
  const kml =
    typeof mapObject.kml === "string" && mapObject.kml.trim().length > 0
      ? mapObject.kml
      : undefined;
  const kmz =
    typeof mapObject.kmz === "string" && mapObject.kmz.trim().length > 0
      ? mapObject.kmz
      : undefined;

  const pointsRaw = mapObject.points;
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

function parseMapPoint(rawPoint: unknown): TravelMapPoint | undefined {
  if (!rawPoint || typeof rawPoint !== "object" || Array.isArray(rawPoint)) {
    return undefined;
  }

  const point = rawPoint as Record<string, unknown>;
  const lat = normalizeNumber(point.lat);
  const lng = normalizeNumber(point.lng);
  const name =
    typeof point.name === "string" && point.name.trim().length > 0
      ? point.name.trim()
      : undefined;

  if (lat === undefined || lng === undefined || !name) {
    return undefined;
  }

  const description =
    typeof point.description === "string" &&
    point.description.trim().length > 0
      ? point.description.trim()
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
  if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
    return undefined;
  }

  const item = rawItem as Record<string, unknown>;
  const city =
    typeof item.city === "string" && item.city.trim().length > 0
      ? item.city.trim()
      : undefined;

  if (!city) {
    return undefined;
  }

  const km = normalizeNumber(item.km);

  return {
    city,
    km,
  };
}

export async function getAllTravels(): Promise<Travel[]> {
  return ensureCache();
}

export async function getTravelBySlug(slug: string): Promise<Travel> {
  const travels = ensureCache();
  const travel = travels.find((item) => item.slug === slug);

  if (!travel) {
    throw new Error(`Travel with slug ${slug} not found`);
  }

  return travel;
}

export function getAllTags(): string[] {
  const travels = ensureCache();
  const tags = new Set<string>();
  travels.forEach((travel) => {
    travel.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export function getTravelsByTag(tag: string): Travel[] {
  const travels = ensureCache();
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

export function getTravelStats(): TravelStats {
  const travels = ensureCache();
  
  // Paesi visitati (dalla location)
  const countries = new Set<string>();
  travels.forEach((travel) => {
    if (travel.location && travel.location.trim()) {
      countries.add(travel.location.trim());
    }
  });
  
  // Continenti visitati (dai tags)
  const continents = new Set<string>();
  const continentTags = ["Europa", "Asia", "Africa", "America", "Nord America", "Sud America", "Oceania", "Antartide"];
  travels.forEach((travel) => {
    travel.tags.forEach((tag) => {
      if (continentTags.includes(tag)) {
        continents.add(tag);
      }
    });
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
