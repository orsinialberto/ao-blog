"use client";

import Image from "next/image";

import type { Travel } from "@/lib/travels";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { LocalizedLink } from "./LocalizedLink";

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: 800,
    quality: 80,
  });

  return (
    <LocalizedLink href={`/viaggi/${travel.slug}`}>
      <article className="group cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface mb-6">
          <Image
            src={optimizedCoverImage}
            alt={travel.title}
            fill
            className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col items-center text-center px-2">
          <span className="text-[9px] font-bold tracking-[0.3em] text-brand-muted/60 uppercase mb-3">
            {travel.location}
          </span>
          <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-brand-primary transition-colors">
            {travel.title}
          </h3>
        </div>
      </article>
    </LocalizedLink>
  );
}
