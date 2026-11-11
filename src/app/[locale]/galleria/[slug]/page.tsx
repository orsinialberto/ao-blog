import type { Metadata } from "next";

import { SectionHeader } from "@/components/SectionHeader";
import { FilmSheet } from "@/components/gallery/FilmSheet";
import { getGalleryAlbum, getGalleryAlbums } from "@/lib/gallery";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { supportedLocales } from "@/config/locales";

interface AlbumPageProps {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}

export async function generateStaticParams() {
  return supportedLocales.flatMap((locale) =>
    getGalleryAlbums(locale).map((album) => ({ locale, slug: album.slug })),
  );
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = await getLocaleFromParams(resolvedParams);
  const album = getGalleryAlbum(resolvedParams.slug, locale);
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
  const album = getGalleryAlbum(resolvedParams.slug, locale);
  const t = getTranslations(locale).pages.galleryAlbum;

  return (
    <div className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <SectionHeader label={album.title} subtitle={album.year} className="mb-8 md:mb-12" />
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
