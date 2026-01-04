import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { strings } from "@/config/strings";

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

  const [mainPhoto, ...otherPhotos] = photos;

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery.JPG"
          alt="Montagne panorama"
          fill
          className="object-cover opacity-90"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/75 via-slate-200/65 to-slate-100/75" />
      </div>

      {/* Content */}
      <div className="relative space-y-8 mx-auto px-4 lg:px-24">
        <SectionHeader
          label={strings.components.sectionHeader.photoGallery}
          linkText={strings.components.sectionHeader.seeAllPhotos}
          linkHref="/galleria"
          dark={false}
        />

        <div className="space-y-4">
          {/* Main Photo - Large */}
          <Link
            href="/galleria"
            className="relative block aspect-[21/9] overflow-hidden rounded-xl shadow-2xl hover:scale-[1.01] transition-transform duration-300 group"
          >
            <Image
              src={optimizeCloudinaryUrl(mainPhoto.url, { width: 1600, quality: 85 })}
              alt={mainPhoto.travelTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-lg font-medium">{mainPhoto.travelTitle}</p>
            </div>
          </Link>

          {/* Thumbnail Grid - Small photos below */}
          {otherPhotos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {otherPhotos.map((photo, i) => (
                <Link
                  key={`${photo.url}-${i}`}
                  href="/galleria"
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                >
                  <Image
                    src={optimizeCloudinaryUrl(photo.url, { width: 400, quality: 75 })}
                    alt={photo.travelTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

