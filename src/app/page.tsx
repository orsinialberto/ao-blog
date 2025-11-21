import Image from "next/image";
import Link from "next/link";

import { TravelCard } from "@/components/TravelCard";
import { TravelMap } from "@/components/TravelMap";
import { getAllTravels } from "@/lib/travels";
import { withBasePath } from "@/lib/paths";

export default async function HomePage() {
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 -mt-10 h-[85vh] min-h-[600px] md:-mx-8 lg:-mx-12">
        <div className="relative h-full w-full">
          <Image
            src={withBasePath("/images/home-hero.jpg")}
            alt="I miei viaggi"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container w-full">
            <div className="mx-auto max-w-3xl space-y-8 text-center text-white/90 animate-in fade-in duration-1000">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                Diario di viaggio
              </p>
              <h1 className="font-comforter text-6xl font-normal leading-[1.1] text-white md:text-7xl lg:text-8xl">
                I miei viaggi, raccontati con semplicità.
              </h1>
              <p className="font-klee text-xl leading-relaxed text-white/90 md:text-2xl">
                Appunti, fotografie e mappe per ricordare i luoghi che ho attraversato 
                e condividere ciò che mi ha colpito davvero.
              </p>
              <div className="flex flex-col items-center justify-center gap-5 pt-2 sm:flex-row">
                <Link
                  href="/viaggi"
                  className="font-klee inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold uppercase tracking-wide text-brand-primary backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/95"
                >
                  Scopri tutti i viaggi
                </Link>
                <Link
                  href="/about"
                  className="font-klee inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 text-base font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white/10"
                >
                  Chi sono
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-16">

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
    </div>
  );
}
