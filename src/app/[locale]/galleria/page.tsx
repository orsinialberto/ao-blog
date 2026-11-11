import type { Metadata } from "next";
import Image from "next/image";

import { RollCard } from "@/components/gallery/RollCard";
import { SectionHeader } from "@/components/SectionHeader";
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
      <header className="mb-8 flex flex-col items-center md:mb-12">
        <SectionHeader
          label={t.pages.gallery.heading}
          className="mb-6"
        />
        <Image
          src={withBasePath("/images/galleria/camera.png")}
          alt=""
          width={640}
          height={478}
          className="h-44 w-auto md:h-60"
          priority
        />
      </header>

      <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
        {albums.map((album) => (
          <RollCard
            key={album.slug}
            album={album}
            href={`/galleria/${album.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
