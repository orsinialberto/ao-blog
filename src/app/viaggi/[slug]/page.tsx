import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TravelGallery } from "@/components/TravelGallery";
import { TravelDetailMap } from "@/components/TravelDetailMap";
import { TravelTimeline } from "@/components/TravelTimeline";
import { TravelNavigationCard } from "@/components/TravelNavigationCard";
import { formatDateRange } from "@/lib/dates";
import { getAllTravels, getTravelBySlug } from "@/lib/travels";
import { getTravelNavigation } from "@/lib/travelNavigation";

interface TravelPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  const travels = await getAllTravels();
  return travels.map((travel) => ({ slug: travel.slug }));
}

export async function generateMetadata({
  params,
}: TravelPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const travel = await getTravelBySlug(resolvedParams.slug);

  return {
    title: travel.title,
    description: travel.description,
    openGraph: {
      title: travel.title,
      description: travel.description,
      images: [travel.coverImage],
    },
  };
}

export default async function TravelPage({ params }: TravelPageProps) {
  const resolvedParams = await params;
  const travel = await getTravelBySlug(resolvedParams.slug);
  const travels = await getAllTravels();
  const { previous: previousTravel, next: nextTravel } = getTravelNavigation(travels, travel.slug);

  return (
    <article className="container mx-auto max-w-4xl space-y-12">
      {/* Box unico con titolo, descrizione e copertina */}
      <div className="overflow-hidden bg-white shadow-card">
        <div className="px-8 pt-8 pb-4">
          {/* Meta info sopra il titolo */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted mb-4">
            <span>{formatDateRange(travel.date, travel.endDate)}</span>
            <span>•</span>
            <span>{travel.duration}</span>
            {travel.totalKilometers && (
              <>
                <span>•</span>
                <span>{travel.totalKilometers} km</span>
              </>
            )}
          </div>
          
          {/* Titolo */}
          <h1 className="font-comforter text-5xl md:text-6xl lg:text-7xl font-normal text-brand-primary pt-6 mb-4">
            {travel.title}
          </h1>
          
          {/* Descrizione */}
          <p className="font-klee text-lg text-brand-muted leading-relaxed mb-2">
            {travel.description}
          </p>
        </div>
        
        {/* Immagine copertina */}
        <div className="px-8 pt-2 pb-8">
          <div className="relative h-[500px] w-full">
            <Image
              src={travel.coverImage}
              alt={travel.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        
        {/* Tag e location */}
        <div className="px-8 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {travel.tags.map((tag) => (
              <Link
                key={tag}
                href={`/viaggi?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted hover:text-brand-primary transition"
              >
                #{tag}
              </Link>
            ))}
            <Link
              href={`/viaggi?tag=${encodeURIComponent(travel.location)}`}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted hover:text-brand-primary transition"
            >
              #{travel.location}
            </Link>
          </div>
        </div>
        
        {/* Contenuto del racconto */}
        <div className="px-8 pb-8">
          <div
            className="prose-travel"
            dangerouslySetInnerHTML={{ __html: travel.content }}
          />
        </div>
      </div>

      {travel.timeline && <TravelTimeline timeline={travel.timeline} />}

      <TravelGallery images={travel.gallery} title={travel.title} />

      {travel.map && (
        <TravelDetailMap map={travel.map} coords={travel.coords} title={travel.title} />
      )}

      <nav className="grid gap-6 md:grid-cols-2">
        <TravelNavigationCard label="Viaggio precedente" travel={previousTravel} />
        <TravelNavigationCard label="Viaggio successivo" travel={nextTravel} align="end" />
      </nav>
    </article>
  );
}
