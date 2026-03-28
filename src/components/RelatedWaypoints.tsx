import Image from "next/image";
import Link from "next/link";

import type { Travel } from "@/lib/travels";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { createLocalizedPath } from "@/lib/i18n/routing";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface RelatedWaypointsProps {
  travels: Travel[];
  locale: SupportedLocale;
}

export function RelatedWaypoints({ travels, locale }: RelatedWaypointsProps) {
  const t = getTranslations(locale);

  if (travels.length === 0) return null;

  return (
    <section className="bg-brand-surface-low py-24 px-8 md:px-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
          <div>
            <h2 className="font-headline text-4xl mb-4">
              {t.components.relatedWaypoints.title}
            </h2>
            <p className="font-body text-brand-muted">
              {t.components.relatedWaypoints.subtitle}
            </p>
          </div>
          <Link
            href={createLocalizedPath("/viaggi", locale)}
            className="font-label text-xs uppercase tracking-[0.2em] text-brand-primary font-bold border-b-2 border-brand-primary pb-1 whitespace-nowrap"
          >
            {t.components.relatedWaypoints.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {travels.map((travel) => (
            <Link
              key={travel.slug}
              href={createLocalizedPath(`/viaggi/${travel.slug}`, locale)}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6">
                <Image
                  src={optimizeCloudinaryUrl(travel.coverImage, { width: 600, quality: 80 })}
                  alt={travel.title}
                  width={600}
                  height={750}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-brand-outline">
                {t.components.relatedWaypoints.journalLabel} &bull; {travel.location}
              </span>
              <h3 className="font-headline text-xl mt-2 group-hover:text-brand-secondary transition-colors">
                {travel.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
