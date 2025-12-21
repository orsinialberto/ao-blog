import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

interface GalleryPhoto {
  url: string;
  travelTitle: string;
  travelSlug: string;
}

interface GalleryPreviewSectionProps {
  photos: GalleryPhoto[];
}

export function GalleryPreviewSection({ photos }: GalleryPreviewSectionProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        label="Galleria fotografica"
        linkText="Vedi tutte le foto"
        linkHref="/galleria"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <Link
            key={`${photo.url}-${i}`}
            href="/galleria"
            className="relative aspect-[4/3] overflow-hidden hover:scale-[1.02] transition-transform group"
          >
            <Image
              src={photo.url}
              alt={photo.travelTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  );
}

