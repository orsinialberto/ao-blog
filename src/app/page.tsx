import type { Metadata } from "next";

import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { TravelsHighlightSection } from "@/components/home/TravelsHighlightSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { TravelMap } from "@/components/TravelMap";
import { TravelStats } from "@/components/TravelStats";
import { homePageMetadata } from "@/config/pageMetadata";
import { getAllTravels, getTravelStats } from "@/lib/travels";

export const metadata: Metadata = homePageMetadata;

// Fisher-Yates shuffle algorithm for random array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomePage() {
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
      <HeroSection />

      <div className="mt-24">
        <AboutPreviewSection />
      </div>

      <div className="mt-24">
        <TravelStats stats={stats} />
      </div>

      <div className="mt-24">
        <TravelsHighlightSection travels={highlights} />
      </div>
      
      <div className="mt-24">
        <GalleryPreviewSection photos={galleryPreview} />
      </div>

      <div className="mt-24">
        <TravelMap />
      </div>

    </div>
  );
}
