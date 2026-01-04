import type { Metadata } from "next";

import MasonryGallery from "@/components/MasonryGallery";
import { galleryPageMetadata } from "@/config/pageMetadata";
import { getAllTravels } from "@/lib/travels";

export const metadata: Metadata = galleryPageMetadata;

interface PhotoWithMetadata {
  url: string;
  travelTitle: string;
  travelSlug: string;
  location: string;
}

export default async function GalleriaPage() {
  const travels = await getAllTravels();

  // Filtra solo i viaggi con galleria
  const travelsWithGallery = travels.filter(
    (travel) => travel.gallery && travel.gallery.length > 0
  );

  // Raccogli tutte le foto mantenendo l'ordine per viaggio
  const allPhotos: PhotoWithMetadata[] = travelsWithGallery.flatMap((travel) =>
    (travel.gallery || []).map((photo) => ({
      url: photo,
      travelTitle: travel.title,
      travelSlug: travel.slug,
      location: travel.location,
    }))
  );

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-brand-primary">
          Galleria Fotografica
        </h1>
        <p className="text-brand-muted text-lg">
          {allPhotos.length} foto da {travelsWithGallery.length} viaggi
        </p>
      </div>

      <MasonryGallery photos={allPhotos} />
    </main>
  );
}

