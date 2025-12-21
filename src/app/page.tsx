import Image from "next/image";
import Link from "next/link";

import { TravelCard } from "@/components/TravelCard";
import { TravelMap } from "@/components/TravelMap";
import { TravelStats } from "@/components/TravelStats";
import { getAllTravels, getTravelStats } from "@/lib/travels";
import { withBasePath } from "@/lib/paths";

export default async function HomePage() {
  const travels = await getAllTravels();
  const highlights = travels.slice(0, 4);
  const stats = getTravelStats();

  // Raccogli foto per la gallery preview (prime 6 foto dai viaggi più recenti)
  const galleryPreview = travels
    .filter((travel) => travel.gallery && travel.gallery.length > 0)
    .slice(0, 2) // Prendi i 2 viaggi più recenti con foto
    .flatMap((travel) =>
      (travel.gallery || []).slice(0, 3).map((photo) => ({
        url: photo,
        travelTitle: travel.title,
        travelSlug: travel.slug,
      }))
    )
    .slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Hero Section Full Width */}
      <section className="relative -mt-[73px] h-[calc(100vh+73px)]">
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
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-16">
        {/* About Preview Section */}
        <section className="relative">
          <div className="relative flex flex-col lg:flex-row">
            {/* Image */}
            <div className="relative w-full lg:w-7/12 xl:w-7/12 aspect-[4/3]">
              <Image
                src={withBasePath("/images/moto-profile.JPG")}
                alt="Alberto in moto"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Text Box */}
            <div className="relative w-full bg-white px-8 py-8 shadow-card lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:w-1/2 lg:px-12 lg:py-5 xl:absolute xl:right-8 xl:top-1/2 xl:-translate-y-1/2 xl:w-1/2 xl:px-12 xl:py-12">
              <div className="space-y-6 text-center">
                <h2 className="font-klee text-3xl font-normal text-brand-primary">
                 Metto lo zaino, seguo la strada e mi perdo
                </h2>
                <div className="space-y-4 text-brand-muted">
                  <p className="font-klee text-base leading-relaxed">
                   Ciao sono Alberto, e da qualche anno ho scoperto che la mia felicità pesa più o meno quanto uno zaino.
                   Cammino, viaggio in moto, esploro quando posso e come posso. 
                  </p>
                  <p className="font-klee text-base leading-relaxed">
                   Scrivo questo blog per fermare un po' di quella libertà che il viaggio regala, 
                   per ricordarmi ciò che ho visto e condividere ciò che mi è rimasto dentro.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Link
                    href="/about"
                    className="inline-flex w-fit items-center justify-center bg-sky-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                  >
                    Chi sono
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((travel) => (
            <TravelCard key={travel.slug} travel={travel} />
          ))}
        </div>
      </section>
      </div>

      <TravelStats stats={stats} />

      <div className="container space-y-16">
        {/* Gallery Preview Section */}
        {galleryPreview.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
                  Galleria fotografica
                </p>
              </div>
              <Link
                href="/galleria"
                className="text-sm font-semibold text-brand-secondary hover:underline"
              >
                Vedi tutte le foto →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {galleryPreview.map((photo, i) => (
                <Link
                  key={`${photo.url}-${i}`}
                  href="/galleria"
                  className="relative aspect-[4/3] overflow-hidden hover:scale-[1.02] transition-transform group"
                >
                  <Image
                    src={photo.url}
                    alt={photo.travelTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <TravelMap />
      </div>
    </div>
  );
}
