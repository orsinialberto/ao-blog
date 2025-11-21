import Image from "next/image";
import Link from "next/link";

import { TravelCard } from "@/components/TravelCard";
import { TravelMap } from "@/components/TravelMap";
import { getAllTravels } from "@/lib/travels";

export default async function HomePage() {
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 6);

  return (
    <div className="container space-y-16">
      <section className="relative overflow-hidden rounded-[32px] bg-white px-8 py-14 shadow-card md:px-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 overflow-hidden rounded-l-[32px] md:block">
          <Image
            src="/images/home-hero.jpg"
            alt="I miei viaggi"
            fill
            priority
            sizes="(min-width: 768px) 33vw, 0vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary">
            Diario di viaggio
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-brand-primary md:text-5xl">
            I miei viaggi, raccontati con semplicità.
          </h1>
          <p className="text-lg text-brand-muted">
            Appunti, fotografie e mappe per ricordare i luoghi che ho attraversato 
            e condividere ciò che mi ha colpito davvero.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/viaggi"
              className="inline-flex items-center justify-center rounded-full bg-brand-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5"
            >
              Scopri tutti i viaggi
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-brand-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-secondary transition hover:-translate-y-0.5"
            >
              Chi sono
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
              Ultime pubblicazioni
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-brand-primary">
              Gli ultimi viaggi aggiunti
            </h2>
          </div>
          <Link
            href="/viaggi"
            className="text-sm font-semibold text-brand-secondary hover:underline"
          >
            Vedi tutti →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((travel) => (
            <TravelCard key={travel.slug} travel={travel} />
          ))}
        </div>
      </section>

      <TravelMap />
    </div>
  );
}
