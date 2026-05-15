import Image from "next/image";
import Link from "next/link";

import type { Travel } from "@/lib/travels";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { createLocalizedPath } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import { formatDate } from "@/lib/dates";
import type { SupportedLocale } from "@/config/locales";

interface RelatedWaypointsProps {
  travels: Travel[];
  locale: SupportedLocale;
  /** Detail URL base without slug, e.g. "/viaggi-in-moto". Default "/viaggi". */
  travelBasePath?: string;
  /** "View all" link path. Default "/viaggi". */
  viewAllPath?: string;
  /** Override label for the "view all" link. */
  viewAllLabel?: string;
}

export function RelatedWaypoints({
  travels,
  locale,
  travelBasePath = "/viaggi",
  viewAllPath = "/viaggi",
  viewAllLabel,
}: RelatedWaypointsProps) {
  const t = getTranslations(locale);
  const detailBase = travelBasePath.replace(/\/$/, "");
  const viewAll = viewAllLabel ?? t.components.relatedWaypoints.viewAll;

  if (travels.length === 0) return null;

  return (
    <section className="bg-brand-surface-low py-12">
      <div className="max-w-7xl mx-auto px-8 md:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="font-headline text-4xl">
              {t.components.relatedWaypoints.title}
            </h2>
          </div>
          <Link
            href={createLocalizedPath(viewAllPath, locale)}
            className="font-label text-xs uppercase tracking-[0.2em] text-brand-primary font-bold border-b-2 border-brand-primary pb-1 whitespace-nowrap"
          >
            {viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {travels.map((travel) => (
            <Link
              key={travel.slug}
              href={createLocalizedPath(`${detailBase}/${travel.slug}`, locale)}
              className="group flex flex-col"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={optimizeCloudinaryUrl(travel.coverImage, { width: 800, quality: 80 })}
                  alt={travel.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="pt-6 pb-4 px-1 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-label text-[10px] font-bold text-foreground/50 uppercase tracking-tight">
                    {travel.location}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-brand-accent" />
                  <time className="font-label text-[10px] text-foreground/40 uppercase tracking-widest">
                    {formatDate(travel.date, locale, { month: "short", year: "numeric" })}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
