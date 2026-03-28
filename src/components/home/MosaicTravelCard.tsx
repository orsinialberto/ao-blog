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

const aspectClasses: Record<CardVariant, string> = {
  feature: "aspect-[4/3]",
  sidebar: "aspect-[16/9]",
  square: "aspect-square",
  wide: "h-80",
};

const imageWidths: Record<CardVariant, number> = {
  feature: 1200,
  sidebar: 800,
  square: 600,
  wide: 1200,
};

const titleClasses: Record<CardVariant, string> = {
  feature: "font-headline text-3xl",
  sidebar: "font-headline text-xl",
  square: "font-headline text-xl",
  wide: "font-headline text-xl",
};

export function MosaicTravelCard({ travel, locale, variant }: MosaicTravelCardProps) {
  const optimizedCoverImage = optimizeCloudinaryUrl(travel.coverImage, {
    width: imageWidths[variant],
    quality: 80,
  });

  return (
    <LocalizedLink href={`/viaggi/${travel.slug}`} className="group block">
      <article>
        <div
          className={`relative overflow-hidden rounded-xl mb-4 bg-brand-surface ${aspectClasses[variant]}`}
        >
          <Image
            src={optimizedCoverImage}
            alt={travel.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={variant === "feature" || variant === "wide" ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
            loading="lazy"
          />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-label text-xs font-bold text-brand-primary uppercase tracking-tight">
            {travel.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-brand-accent" />
          <time className="font-label text-xs text-brand-muted uppercase tracking-widest">
            {formatDate(travel.date, locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>
        <h3
          className={`${titleClasses[variant]} mb-2 leading-snug text-brand-primary group-hover:text-brand-secondary transition-colors line-clamp-2`}
        >
          {travel.title}
        </h3>
        {variant === "feature" && travel.description && (
          <p className="font-body text-brand-muted leading-relaxed max-w-xl line-clamp-2">
            {travel.description}
          </p>
        )}
      </article>
    </LocalizedLink>
  );
}
