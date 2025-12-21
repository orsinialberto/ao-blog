import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { TravelsHighlightSection } from "@/components/home/TravelsHighlightSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { TravelMap } from "@/components/TravelMap";
import { TravelStats } from "@/components/TravelStats";
import { getAllTravels, getTravelStats } from "@/lib/travels";

export default async function HomePage() {
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 4);
  const stats = getTravelStats();

  // Raccogli foto per la gallery preview (prime 6 foto dai viaggi più recenti)
  const galleryPreview = travels
    .filter((travel) => travel.gallery && travel.gallery.length > 0)
    .slice(0, 2) // Prendi i 2 viaggi più recenti con foto
    .flatMap((travel) =>
      (travel.gallery || []).slice(0, 3).map((photo) => ({
        url: photo,
        travelTitle: travel.title,
        travelSlug: travel.slug,
      }))
    )
    .slice(0, 6);

  return (
    <div className="space-y-16">
      <HeroSection />

      <div className="container space-y-16">
        <AboutPreviewSection />
        <TravelsHighlightSection travels={highlights} />
      </div>

      <TravelStats stats={stats} />

      <div className="container space-y-16">
        <GalleryPreviewSection photos={galleryPreview} />
        <TravelMap />
      </div>
    </div>
  );
}
