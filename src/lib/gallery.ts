import { albums, type AlbumDefinition } from "@/data/albums";
import { listFolderPhotos } from "./cloudinaryFolder";
import type { Locale } from "./travels";

export interface GalleryAlbum {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  photos: string[];
  emblem?: string;
}

async function loadAlbum(album: AlbumDefinition, locale: Locale): Promise<GalleryAlbum> {
  return {
    slug: album.slug,
    title: album.title[locale],
    shortTitle: album.shortTitle[locale],
    year: album.date.slice(0, 4),
    photos: await listFolderPhotos(album.folder),
    emblem: album.emblem,
  };
}

/** Every album, newest first. */
export function getGalleryAlbums(locale: Locale): Promise<GalleryAlbum[]> {
  const newestFirst = [...albums].sort((a, b) => b.date.localeCompare(a.date));
  return Promise.all(newestFirst.map((album) => loadAlbum(album, locale)));
}

export function getGalleryAlbum(slug: string, locale: Locale): Promise<GalleryAlbum> {
  const album = albums.find((a) => a.slug === slug);
  if (!album) throw new Error("No gallery album for " + slug);
  return loadAlbum(album, locale);
}
