import Image from "next/image";
import type { Travel } from "@/lib/travels";
import type { SupportedLocale } from "@/config/locales";
import { formatDate } from "@/lib/dates";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { LocalizedLink } from "@/components/LocalizedLink";

type CardVariant = "feature" | "sidebar" | "square" | "wide";

interface MosaicTravelCardProps {
  travel: Travel;
  locale: SupportedLocale;
  variant: CardVariant;
}

const imageWidths: Record<CardVariant, number> = {
  feature: 1200,
  sidebar: 800,
  square: 600,
  wide: 1200,
};

const titleClasses: Record<CardVariant, string> = {
  feature: "font-headline text-3xl",
  sidebar: "font-headline text-lg",
  square: "font-headline text-xl",
  wide: "font-headline text-2xl",
};

const paddingClasses: Record<CardVariant, string> = {
  feature: "p-6",
  sidebar: "p-4",
  square: "p-5",
  wide: "p-6",
};

export function MosaicTravelCard({ travel, locale, variant }: MosaicTravelCardProps) {
  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: imageWidths[variant],
    quality: 80,
  });

  return (
    <LocalizedLink href={`/viaggi/${travel.slug}`} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-xl bg-brand-surface">
        <Image
          src={optimizedCoverImage}
          alt={travel.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            variant === "feature" || variant === "wide"
              ? "(max-width: 768px) 100vw, 58vw"
              : "(max-width: 768px) 100vw, 42vw"
          }
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className={`absolute bottom-0 left-0 right-0 ${paddingClasses[variant]}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-label text-xs font-bold text-white/90 uppercase tracking-tight">
              {travel.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-accent" />
            <time className="font-label text-xs text-white/70 uppercase tracking-widest">
              {formatDate(travel.date, locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
          <h3
            className={`${titleClasses[variant]} leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2`}
          >
            {travel.title}
          </h3>
          {variant === "feature" && travel.description && (
            <p className="font-body text-white/75 leading-relaxed max-w-xl line-clamp-2 mt-2">
              {travel.description}
            </p>
          )}
        </div>
      </article>
    </LocalizedLink>
  );
}
