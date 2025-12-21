import Image from "next/image";
import { withBasePath } from "@/lib/paths";

export function HeroSection() {
  return (
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
  );
}

