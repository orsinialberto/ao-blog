import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/paths";

export function AboutPreviewSection() {
  return (
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
  );
}

