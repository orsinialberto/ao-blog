'use client';

import { useSearchParams } from 'next/navigation';
import { TagFilter } from '@/components/TagFilter';
import { TravelCard } from '@/components/TravelCard';
import type { Travel } from '@/lib/travels';

interface TravelsListClientProps {
  allTravels: Travel[];
  allTags: string[];
}

export function TravelsListClient({ allTravels, allTags }: TravelsListClientProps) {
  const searchParams = useSearchParams();
  const rawTag = searchParams.get('tag');
  const selectedTag = rawTag ? decodeURIComponent(rawTag) : undefined;
  const normalizedTag = selectedTag?.toLowerCase();
  
  // Filtra i viaggi lato client
  const travels = selectedTag
    ? allTravels.filter((travel) =>
        travel.tags.some((travelTag) => travelTag.toLowerCase() === normalizedTag) ||
        travel.location.toLowerCase() === normalizedTag
      )
    : allTravels;

  return (
    <>
      <TagFilter tags={allTags} activeTag={normalizedTag} />

      {selectedTag && (
        <p className="text-sm text-brand-muted">
          Filtrati per tag: <span className="font-semibold text-brand-secondary">#{selectedTag}</span>
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {travels.map((travel) => (
          <TravelCard key={travel.slug} travel={travel} />
        ))}
      </div>

      {!travels.length && (
        <p className="border border-dashed border-slate-200 bg-white p-6 text-center text-brand-muted">
          Nessun viaggio con questo tag per ora. Torna presto!
        </p>
      )}
    </>
  );
}

