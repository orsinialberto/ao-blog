import Image from "next/image";
import type { Travel } from "@/lib/travels";
import type { SupportedLocale } from "@/config/locales";
import { formatDate } from "@/lib/dates";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { LocalizedLink } from "@/components/LocalizedLink";

interface TravelCardProps {
  travel: Travel;
  locale: SupportedLocale;
}

export function TravelCard({ travel, locale }: TravelCardProps) {
  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: 800,
    quality: 80,
  });

  return (
    <LocalizedLink href={`/viaggi/${travel.slug}`} className="group flex h-full">
      <article className="flex flex-col w-full">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={optimizedCoverImage}
            alt={travel.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>

        <div className="pt-8 pb-6 px-1 flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-label text-[10px] font-bold text-foreground/50 uppercase tracking-tight">
              {travel.location}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-brand-accent" />
            <time className="font-label text-[10px] text-foreground/40 uppercase tracking-widest">
              {formatDate(travel.date, locale, {
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <h3 className="font-label text-lg leading-snug text-foreground group-hover:text-foreground/70 transition-colors line-clamp-2 uppercase">
            {travel.title}
          </h3>
          {travel.description && (
            <p className="font-body text-xs text-foreground/50 leading-relaxed line-clamp-2">
              {travel.description}
            </p>
          )}
        </div>
      </article>
    </LocalizedLink>
  );
}
