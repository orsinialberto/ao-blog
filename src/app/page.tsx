import Image from "next/image";
import Link from "next/link";

import { TravelCard } from "@/components/TravelCard";
import { TravelMap } from "@/components/TravelMap";
import { getAllTravels } from "@/lib/travels";
import { withBasePath } from "@/lib/paths";

export default async function HomePage() {
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section Full Width */}
      <section className="relative -mx-4 -mt-[73px] h-[85vh] min-h-[600px] md:-mx-8 lg:-mx-12">
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
              <h1 className="font-comforter text-6xl font-normal leading-[1.1] text-white md:text-7xl lg:text-8xl">
                Quella voglia di partire che non passa mai
              </h1>
              <p className="font-klee text-xl leading-relaxed text-white/90 md:text-2xl">
                Partire, scoprire e raccontare: i viaggi che mi fanno stare bene.
              </p>
              <div className="flex items-center justify-center pt-2">
                <Link
                  href="/viaggi"
                  className="font-klee inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 text-base font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white/10"
                >
                  i miei viaggi
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
