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
    if (!travel.gallery?.length || !travel.shortTitle) return [];
    return [
      {
        slug: travel.slug,
        title: travel.title,
        shortTitle: travel.shortTitle,
        year: String(new Date(travel.date).getFullYear()),
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
