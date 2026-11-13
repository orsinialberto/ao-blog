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
  /** Short name written under the canister of the film roll. */
  shortTitle: Localized;
  /** Drawing on the canister of the roll: a 342×891 file in `public/images/galleria/labels/`. */
  label: string;
  /** Cloudinary folder path, e.g. "travels/vietnam-2026". */
  folder: string;
  /** The label drawing, uncropped, behind the title of the album page (a file in `public`). */
  emblem: string;
  /** The emblem already spells the album's name: the album page shows it alone, without the written title. */
  emblemIsTitle?: boolean;
  /** A whole painting rather than a symbol: the album page gives it a taller header. */
  emblemLarge?: boolean;
}

export const albums: AlbumDefinition[] = [
  {
    slug: "vietnam-2026",
    date: "2026-09-10",
    title: { it: "Vietnam", en: "Vietnam" },
    shortTitle: { it: "Vietnam", en: "Vietnam" },
    folder: "travels/vietnam-2026",
    label: "/images/galleria/labels/vietnam-2026.webp",
    emblem: "/images/galleria/emblems/vietnam-2026.webp",
  },
  {
    slug: "dolomiti-2026",
    date: "2026-01-10",
    title: { it: "Settimana bianca sul Sellaronda", en: "Ski week on the Sellaronda" },
    shortTitle: { it: "Sellaronda", en: "Sellaronda" },
    folder: "travels/sellaronda-2026",
    label: "/images/galleria/labels/dolomiti-2026.webp",
    emblem: "/images/galleria/emblems/dolomiti-2026.webp",
    emblemLarge: true,
  },
  {
    slug: "cammino-dei-borghi-silenti-2025",
    date: "2025-09-16",
    title: { it: "Cammino dei Borghi Silenti", en: "Cammino dei Borghi Silenti" },
    shortTitle: { it: "Borghi Silenti", en: "Silent Villages" },
    folder: "travels/borghi-silenti-2025",
    label: "/images/galleria/labels/cammino-dei-borghi-silenti-2025.webp",
    emblem: "/images/galleria/emblems/cammino-dei-borghi-silenti-2025.webp",
  },
  {
    slug: "cambogia-2025",
    date: "2025-06-02",
    title: { it: "Cambogia", en: "Cambodia" },
    shortTitle: { it: "Cambogia", en: "Cambodia" },
    folder: "travels/cambogia-2025",
    label: "/images/galleria/labels/cambogia-2025.webp",
    emblem: "/images/galleria/emblems/cambogia-2025.webp",
  },
  {
    slug: "fishermens-trail-2024",
    date: "2024-09-13",
    title: { it: "Rota Vicentina - Fishermen's Trail", en: "Rota Vicentina - Fishermen's Trail" },
    shortTitle: { it: "Rota Vicentina", en: "Rota Vicentina" },
    folder: "travels/fishermens-trail-2024",
    label: "/images/galleria/labels/fishermens-trail-2024.webp",
    emblem: "/images/galleria/emblems/fishermens-trail-2024.webp",
    emblemIsTitle: true,
  },
  {
    slug: "italia-on-the-road-2024",
    date: "2024-04-25",
    title: { it: "Italia on the road", en: "Italy on the road" },
    shortTitle: { it: "Italia on the road", en: "Italy on the road" },
    folder: "travels/italia-on-the-road-2024",
    label: "/images/galleria/labels/italia-on-the-road-2024.webp",
    emblem: "/images/galleria/emblems/italia-on-the-road-2024.webp",
    emblemLarge: true,
  },
  {
    slug: "cammino-di-santiago-2023",
    date: "2023-09-06",
    title: { it: "Cammino di Santiago - Inglese e di Finisterre", en: "Way of St. James - English Way and Finisterre" },
    shortTitle: { it: "Santiago", en: "Santiago" },
    folder: "travels/cammino-inglese-finisterre-2023",
    label: "/images/galleria/labels/cammino-di-santiago-2023.webp",
    emblem: "/images/galleria/emblems/cammino-di-santiago-2023.webp",
  },
  {
    slug: "via-degli-dei-2022",
    date: "2022-09-18",
    title: { it: "Via degli Dei", en: "Via degli Dei" },
    shortTitle: { it: "Via degli Dei", en: "Way of the Gods" },
    folder: "travels/via-degli-dei-2022",
    label: "/images/galleria/labels/via-degli-dei-2022.webp",
    emblem: "/images/galleria/emblems/via-degli-dei-2022.webp",
    emblemIsTitle: true,
  },
];
