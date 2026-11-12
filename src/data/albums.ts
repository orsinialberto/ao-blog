import type { SupportedLocale } from "@/config/locales";

type Localized = Record<SupportedLocale, string>;

/**
 * A gallery album. It lives on its own: a travel may point at one with `album: <slug>`
 * in its frontmatter, but an album needs no travel.
 *
 * Photos are every image in the Cloudinary folder `folder`, listed at build time and
 * sorted by file name.
 */
export interface AlbumDefinition {
  slug: string;
  /** YYYY-MM-DD. Albums are shown newest first; the year is printed on the roll. */
  date: string;
  title: Localized;
  /** Short name written on the film roll. */
  shortTitle: Localized;
  /** Cloudinary folder path, e.g. "travels/vietnam-2026". */
  folder: string;
}

export const albums: AlbumDefinition[] = [
  {
    slug: "vietnam-2026",
    date: "2026-09-10",
    title: { it: "Vietnam", en: "Vietnam" },
    shortTitle: { it: "Vietnam", en: "Vietnam" },
    folder: "travels/vietnam-2026",
  },
  {
    slug: "dolomiti-2026",
    date: "2026-01-10",
    title: { it: "Settimana bianca sul Sellaronda", en: "Ski week on the Sellaronda" },
    shortTitle: { it: "Sellaronda", en: "Sellaronda" },
    folder: "travels/sellaronda-2026",
  },
  {
    slug: "cammino-dei-borghi-silenti-2025",
    date: "2025-09-16",
    title: { it: "Cammino dei Borghi Silenti", en: "Cammino dei Borghi Silenti" },
    shortTitle: { it: "Borghi Silenti", en: "Silent Villages" },
    folder: "travels/borghi-silenti-2025",
  },
  {
    slug: "cambogia-2025",
    date: "2025-06-02",
    title: { it: "Cambogia", en: "Cambodia" },
    shortTitle: { it: "Cambogia", en: "Cambodia" },
    folder: "travels/cambogia-2025",
  },
  {
    slug: "fishermens-trail-2024",
    date: "2024-09-13",
    title: { it: "Rota Vicentina - Fishermen's Trail", en: "Rota Vicentina - Fishermen's Trail" },
    shortTitle: { it: "Rota Vicentina", en: "Rota Vicentina" },
    folder: "travels/fishermens-trail-2024",
  },
  {
    slug: "italia-on-the-road-2024",
    date: "2024-04-25",
    title: { it: "Italia on the road", en: "Italy on the road" },
    shortTitle: { it: "Italia on the road", en: "Italy on the road" },
    folder: "travels/italia-on-the-road-2024",
  },
  {
    slug: "cammino-di-santiago-2023",
    date: "2023-09-06",
    title: { it: "Cammino di Santiago - Inglese e di Finisterre", en: "Way of St. James - English Way and Finisterre" },
    shortTitle: { it: "Santiago", en: "Santiago" },
    folder: "travels/cammino-inglese-finisterre-2023",
  },
  {
    slug: "via-degli-dei-2022",
    date: "2022-09-18",
    title: { it: "Via degli Dei", en: "Via degli Dei" },
    shortTitle: { it: "Via degli Dei", en: "Way of the Gods" },
    folder: "travels/via-degli-dei-2022",
  },
];
