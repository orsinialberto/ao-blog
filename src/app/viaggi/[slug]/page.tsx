import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TravelGallery } from "@/components/TravelGallery";
import { TravelDetailMap } from "@/components/TravelDetailMap";
import { formatDateRange } from "@/lib/dates";
import { getAllTravels, getTravelBySlug, type Travel } from "@/lib/travels";

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
  const currentIndex = travels.findIndex((item) => item.slug === travel.slug);
  const previousTravel = travels[currentIndex + 1];
  const nextTravel = travels[currentIndex - 1];

  const meta = [
    formatDateRange(travel.date, travel.endDate),
    travel.duration,
    travel.location,
    travel.totalKilometers ? `${travel.totalKilometers} km` : undefined,
  ].filter(Boolean) as string[];

  const heroTitleClass =
    travel.heroTitleVariant === "dark" ? "text-slate-900" : "text-white";

  return (
    <article className="container space-y-12">
      <div className="overflow-hidden rounded-[40px] bg-white shadow-card">
        <div className="relative h-[420px] w-full">
          <Image
            src={travel.coverImage}
            alt={travel.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">
              {travel.location}
            </p>
            <h1
              className={`mt-3 max-w-2xl text-4xl font-semibold leading-tight ${heroTitleClass}`}
            >
              {travel.title}
            </h1>
          </div>
        </div>
        <div className="space-y-6 p-8 md:p-10">
          <div className="flex flex-wrap gap-6 text-sm text-brand-muted">
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {travel.tags.map((tag) => (
              <Link
                key={tag}
                href={`/viaggi?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-brand-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-[32px] bg-white p-8 shadow-card">
        <div
          className="prose-travel"
          dangerouslySetInnerHTML={{ __html: travel.content }}
        />
      </section>

      <TravelGallery images={travel.gallery} title={travel.title} />

      {travel.map && (
        <TravelDetailMap map={travel.map} coords={travel.coords} title={travel.title} />
      )}

      <nav className="grid gap-6 md:grid-cols-2">
        <NavigationCard label="Viaggio precedente" travel={previousTravel} />
        <NavigationCard label="Viaggio successivo" travel={nextTravel} align="end" />
      </nav>
    </article>
  );
}

interface NavigationCardProps {
  label: string;
  travel?: Travel;
  align?: "start" | "end";
}

function NavigationCard({ label, travel, align = "start" }: NavigationCardProps) {
  if (!travel) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-brand-muted">
        {label}
        <p className="text-sm">Arriverà presto.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/viaggi/${travel.slug}`}
      className={`rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-1 ${
        align === "end" ? "text-right" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-brand-primary">{travel.title}</p>
      <p className="text-sm text-brand-muted">{formatDateRange(travel.date, travel.endDate)}</p>
    </Link>
  );
}
