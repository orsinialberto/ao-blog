import type { Metadata } from "next";
import { Suspense } from "react";

import { TravelsListClient } from "@/components/TravelsListClient";
import { travelsPageMetadata } from "@/config/pageMetadata";
import {
  getAllTags,
  getAllTravels,
} from "@/lib/travels";

export const metadata: Metadata = travelsPageMetadata;

export default async function TravelsPage() {
  const allTravels = await getAllTravels();
  const tags = getAllTags();

  return (
    <div className="container space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
          Archivio
        </p>
        <h1 className="text-4xl font-semibold text-brand-primary">Tutti i viaggi</h1>
      </header>

      <Suspense fallback={<div>Caricamento...</div>}>
        <TravelsListClient allTravels={allTravels} allTags={tags} />
      </Suspense>
    </div>
  );
}
