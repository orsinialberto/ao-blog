import type { Metadata } from "next";

import MasonryGallery from "@/components/MasonryGallery";
import { getAllTravels } from "@/lib/travels";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";
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

interface PhotoWithMetadata {
  url: string;
  travelTitle: string;
  travelSlug: string;
  location: string;
}

export default async function GalleriaPage({ params }: GalleriaPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = getTranslations(locale as SupportedLocale);
  // Get all travels for the current locale
  const travels = await getAllTravels(locale);

  // Filter only travels with gallery
  const travelsWithGallery = travels.filter(
    (travel) => travel.gallery && travel.gallery.length > 0
  );

  // Collect all photos maintaining order by travel
  const allPhotos: PhotoWithMetadata[] = travelsWithGallery.flatMap((travel) =>
    (travel.gallery || []).map((photo) => ({
      url: photo,
      travelTitle: travel.title,
      travelSlug: travel.slug,
      location: travel.location,
    }))
  );

  // Format numbers with locale-specific formatting
  const photoCount = new Intl.NumberFormat(locale).format(allPhotos.length);
  const travelCount = new Intl.NumberFormat(locale).format(travelsWithGallery.length);

  // Format statistics text
  const statisticsText = t.pages.gallery.statistics
    .replace("{photoCount}", photoCount)
    .replace("{travelCount}", travelCount);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-brand-primary">
          {t.pages.gallery.heading}
        </h1>
        <p className="text-brand-muted text-lg">
          {statisticsText}
        </p>
      </div>

      <MasonryGallery photos={allPhotos} />
    </main>
  );
}
