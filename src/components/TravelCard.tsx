import Image from "next/image";
import Link from "next/link";

import type { Travel } from "@/lib/travels";
import { formatDateRange } from "@/lib/dates";

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
  const highlights = [travel.location, travel.duration].filter(Boolean).join(" · ");

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
      <div className="relative h-60 w-full">
        <Image
          src={travel.coverImage}
          alt={travel.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-muted">
          {formatDateRange(travel.date, travel.endDate)}
        </p>
        <Link href={`/viaggi/${travel.slug}`} className="mt-2 text-2xl font-semibold text-brand-primary">
          {travel.title}
        </Link>
        <p className="mt-3 text-base text-brand-muted">{travel.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {travel.tags.map((tag) => (
            <Link
              key={tag}
              href={`/viaggi?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-brand-background px-3 py-1 text-xs font-semibold text-brand-muted transition hover:text-brand-secondary"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-brand-secondary">
          <span>{highlights || "In aggiornamento"}</span>
          <Link href={`/viaggi/${travel.slug}`}>Leggi →</Link>
        </div>
      </div>
    </article>
  );
}
