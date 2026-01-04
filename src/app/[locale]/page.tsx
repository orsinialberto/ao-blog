import type { Metadata } from "next";

import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { TravelsHighlightSection } from "@/components/home/TravelsHighlightSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { TravelMap } from "@/components/TravelMap";
import { TravelStats } from "@/components/TravelStats";
import { homePageMetadata } from "@/config/pageMetadata";
import { getAllTravels, getTravelStats } from "@/lib/travels";
import { getLocaleFromParams } from "@/lib/i18n/routing";
import type { SupportedLocale } from "@/config/locales";
import { getAllLocalizedPaths } from "@/lib/i18n/routing";

interface HomePageProps {
  params: Promise<{ locale: string }> | { locale: string };
}

export async function generateStaticParams() {
  return getAllLocalizedPaths("/");
}

// Fisher-Yates shuffle algorithm for random array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await getLocaleFromParams(params);
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 4);
  const stats = getTravelStats();

  // Raccogli tutte le foto dai viaggi e selezionane 6 random
  const allPhotos = travels
    .filter((travel) => travel.gallery && travel.gallery.length > 0)
    .flatMap((travel) =>
      (travel.gallery || []).map((photo) => ({
        url: photo,
        travelTitle: travel.title,
        travelSlug: travel.slug,
      }))
    );
  
  const galleryPreview = shuffleArray(allPhotos).slice(0, 6);

  return (
    <div>
      <HeroSection locale={locale} />

      <div className="mt-24">
        <AboutPreviewSection locale={locale} />
      </div>

      <div className="mt-24">
        <TravelStats stats={stats} locale={locale} />
      </div>

      <div className="mt-24">
        <TravelsHighlightSection travels={highlights} locale={locale} />
      </div>
      
      <div className="mt-24">
        <GalleryPreviewSection photos={galleryPreview} locale={locale} />
      </div>

      <div className="mt-24">
        <TravelMap />
      </div>

    </div>
  );
}
