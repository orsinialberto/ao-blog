import Image from "next/image";
import { withBasePath } from "@/lib/paths";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface HeroSectionProps {
  locale: SupportedLocale;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = getTranslations(locale);

  return (
    <section className="relative -mt-[73px] h-[calc(110vh+73px)] min-h-[700px]">
      <div className="relative h-full w-full">
        <Image
          src={withBasePath("/images/home-hero.jpg")}
          alt={t.components.heroSection.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full px-4 lg:px-24">
          <div className="mx-auto max-w-3xl text-center text-white/90 animate-in fade-in duration-1000">
            <h1 className="font-comforter text-6xl font-normal leading-[1.1] text-white md:text-7xl lg:text-8xl">
              {t.components.heroSection.title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

