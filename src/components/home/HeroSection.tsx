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
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      <Image
        src={withBasePath("/images/home-hero.jpg")}
        alt={t.components.heroSection.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex min-h-[100dvh] w-full max-w-screen-2xl flex-col items-center justify-center px-8 text-center mx-auto">
        <div className="max-w-4xl w-full">
          <span className="font-label text-white/90 text-sm uppercase tracking-[0.3em] mb-6 block">
            {t.components.heroSection.label}
          </span>
          <h1 className="mb-14">
            <span className="font-hero block text-6xl md:text-7xl lg:text-8xl font-bold italic text-white leading-none tracking-tight">
              {t.components.heroSection.titleLine1}
            </span>
            <span className="font-hero block text-3xl md:text-4xl lg:text-5xl font-light italic text-white/90 leading-snug mt-2">
              {t.components.heroSection.titleLine2}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}

