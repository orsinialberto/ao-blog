import type { Metadata } from "next";

import { TagFilter } from "@/components/TagFilter";
import { TravelCard } from "@/components/TravelCard";
import {
  getAllTags,
  getAllTravels,
  getTravelsByTag,
} from "@/lib/travels";

export const metadata: Metadata = {
  title: "Tutti i viaggi",
  description: "Archivio completo dei diari di viaggio con filtri per tag.",
};

type TravelsPageProps = {
  searchParams?:
    | {
        tag?: string | string[];
      }
    | Promise<{
        tag?: string | string[];
      }>;
};

export default async function TravelsPage({ searchParams }: TravelsPageProps) {
  const allTravels = await getAllTravels();
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawTag = resolvedSearchParams.tag;
  const selectedTag = Array.isArray(rawTag)
    ? rawTag[0]
    : rawTag
    ? decodeURIComponent(rawTag)
    : undefined;

  const normalizedTag = selectedTag?.toLowerCase();
  const travels = selectedTag ? getTravelsByTag(selectedTag) : allTravels;
  const tags = getAllTags();

  return (
    <div className="container space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          Archivio
        </p>
        <h1 className="text-4xl font-semibold text-brand-primary">Tutti i viaggi</h1>
        <p className="text-lg text-brand-muted">
          Sfoglia tutte le destinazioni, filtra per tag e trova ispirazione per il prossimo itinerario.
        </p>
      </header>

      <TagFilter tags={tags} activeTag={normalizedTag} />

      {selectedTag && (
        <p className="text-sm text-brand-muted">
          Filtrati per tag: <span className="font-semibold text-brand-secondary">#{selectedTag}</span>
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {travels.map((travel) => (
          <TravelCard key={travel.slug} travel={travel} />
        ))}
      </div>

      {!travels.length && (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-brand-muted">
          Nessun viaggio con questo tag per ora. Torna presto!
        </p>
      )}
    </div>
  );
}
