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
    <>
      <div className="notebook-paper">
        <header className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-8 md:gap-6 md:py-12">
          <Image
            src={withBasePath("/images/galleria/film-canister.png")}
            alt=""
            width={640}
            height={478}
            className="h-auto w-[22%] max-w-[280px] shrink-0"
            priority
          />
          <SectionHeader
            label={t.pages.gallery.heading}
            className="mb-0 min-w-0"
          />
          <Image
            src={withBasePath("/images/galleria/camera.png")}
            alt=""
            width={640}
            height={478}
            className="h-auto w-[22%] max-w-[280px] shrink-0"
            priority
          />
        </header>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
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
    </>
  );
}
