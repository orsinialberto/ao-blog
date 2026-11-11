import { getTravelsForArchive, type Locale } from "./travels";

export interface GalleryAlbum {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  photos: string[];
}

export function getGalleryAlbums(locale: Locale): GalleryAlbum[] {
  return getTravelsForArchive(locale).flatMap((travel) => {
    if (!travel.gallery?.length) return [];
    // Parsing already requires shortTitle with a gallery; this guard only narrows the type.
    if (!travel.shortTitle) throw new Error("Missing shortTitle for gallery album " + travel.slug);
    return [
      {
        slug: travel.slug,
        title: travel.title,
        shortTitle: travel.shortTitle,
        // Read from the string: a Date would shift the year by time zone on 1 January.
        year: String(travel.date).slice(0, 4),
        photos: travel.gallery,
      },
    ];
  });
}

export function getGalleryAlbum(slug: string, locale: Locale): GalleryAlbum {
  const album = getGalleryAlbums(locale).find((a) => a.slug === slug);
  if (!album) throw new Error("No gallery album for " + slug);
  return album;
}
