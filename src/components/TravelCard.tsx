import Image from "next/image";
import Link from "next/link";

import type { Travel } from "@/lib/travels";
import { formatDateRange } from "@/lib/dates";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
  const titleColorClass =
    travel.heroTitleVariant === "dark" ? "text-slate-900" : "text-white";
  
  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: 800,
    quality: 80,
  });

  return (
    <Link href={`/viaggi/${travel.slug}`}>
      <article className="group relative aspect-square overflow-hidden bg-white transition-transform hover:scale-[1.02]">
        <Image
          src={optimizedCoverImage}
          alt={travel.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-1">
              {formatDateRange(travel.date, travel.endDate)}
            </p>
            <h3 className={`text-2xl font-semibold leading-tight line-clamp-2 ${titleColorClass}`}>
              {travel.title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
}
