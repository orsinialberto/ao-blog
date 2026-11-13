import type { Metadata } from "next";
import { preload } from "react-dom";

import { SectionHeader } from "@/components/SectionHeader";
import { FilmSheet } from "@/components/gallery/FilmSheet";
import { FILM_TILE } from "@/config/galleryDrawings";
import { albums } from "@/data/albums";
import { getGalleryAlbum } from "@/lib/gallery";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { withBasePath } from "@/lib/paths";
import { supportedLocales } from "@/config/locales";

interface AlbumPageProps {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale) => albums.map((album) => ({ locale, slug: album.slug })));
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = await getLocaleFromParams(resolvedParams);
  const album = await getGalleryAlbum(resolvedParams.slug, locale);
  const description = getTranslations(locale).pages.galleryAlbum.description.replace(
    "{title}",
    album.title,
  );

  return {
    title: album.title,
    description,
    openGraph: {
      title: album.title,
      description,
      images: [optimizeCloudinaryUrl(album.photos[0], { width: 1200 })],
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const resolvedParams = await params;
  const locale = await getLocaleFromParams(resolvedParams);
  const album = await getGalleryAlbum(resolvedParams.slug, locale);
  const t = getTranslations(locale).pages.galleryAlbum;
  // The film is a CSS background: without a preload it is found only after the stylesheet.
  preload(withBasePath(FILM_TILE.src), { as: "image" });

  return (
    <div className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <header
          className={`relative mb-14 grid place-items-center md:mb-20 ${album.emblemLarge ? "min-h-64 md:min-h-[26rem]" : "min-h-44 md:min-h-64"}`}
        >
          {/* Multiplied so the drawing's white paper takes the colour of the page. Behind a written title it is
              washed out, to keep the title readable. */}
          <div
            aria-hidden
            className={`absolute inset-0 bg-contain bg-center bg-no-repeat mix-blend-multiply${album.emblemIsTitle ? "" : " opacity-60"}`}
            style={{ backgroundImage: `url(${withBasePath(album.emblem)})` }}
          />
          {album.emblemIsTitle ? (
            <h2 className="sr-only">{album.title}</h2>
          ) : (
            <SectionHeader label={album.title} className="relative mb-0" />
          )}
        </header>
        <FilmSheet
          title={album.title}
          photos={album.photos}
          labels={{
            close: t.close,
            previous: t.previousPhoto,
            next: t.nextPhoto,
            photoAlt: t.photoAlt,
          }}
        />
      </div>
    </div>
  );
}
