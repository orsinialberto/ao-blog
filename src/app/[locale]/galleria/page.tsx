import type { Metadata } from "next";
import Image from "next/image";

import { RollCard } from "@/components/gallery/RollCard";
import { getGalleryAlbums } from "@/lib/gallery";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";
import { withBasePath } from "@/lib/paths";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface GalleriaPageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/galleria");
}

export async function generateMetadata({
  params,
}: GalleriaPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);

  return {
    title: t.pages.gallery.title,
    description: t.pages.gallery.description,
  };
}

export default async function GalleriaPage({ params }: GalleriaPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);
  const albums = getGalleryAlbums(locale);
  const formatNumber = new Intl.NumberFormat(locale).format;

  const photoTotal = albums.reduce((sum, album) => sum + album.photos.length, 0);
  const statisticsText = t.pages.gallery.statistics
    .replace("{photoCount}", formatNumber(photoTotal))
    .replace("{travelCount}", formatNumber(albums.length));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      <header className="mb-8 flex items-center gap-5 md:mb-12">
        <Image
          src={withBasePath("/images/galleria/camera.png")}
          alt=""
          width={1200}
          height={896}
          className="h-20 w-auto md:h-24"
          priority
        />
        <div>
          <h1 className="font-headline text-4xl text-brand-primary md:text-5xl">
            {t.pages.gallery.heading}
          </h1>
          <p className="mt-1 text-brand-muted">{statisticsText}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
        {albums.map((album) => (
          <RollCard
            key={album.slug}
            album={album}
            href={`/galleria/${album.slug}`}
            photoCountLabel={t.pages.gallery.photoCount.replace(
              "{count}",
              formatNumber(album.photos.length),
            )}
          />
        ))}
      </div>
    </div>
  );
}
