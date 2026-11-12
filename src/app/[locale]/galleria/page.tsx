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

const ROLLS_PER_ROW = 3;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

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
  const albums = await getGalleryAlbums(locale);

  return (
    <>
      {/* The ruled paper also runs under the fixed navbar, as on the on-the-road page. */}
      <div className="notebook-paper -mt-(--header-height) pt-(--header-height)">
        <header className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 pb-16 pt-4 md:gap-6 md:pb-20 md:pt-6">
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

      <div className="roll-rows mx-auto max-w-6xl px-6 pb-8 md:pb-12">
        {chunk(albums, ROLLS_PER_ROW).map((row) => (
          <div key={row[0].slug} className="roll-row">
            {row.map((album) => (
              <RollCard
                key={album.slug}
                album={album}
                href={`/galleria/${album.slug}`}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
