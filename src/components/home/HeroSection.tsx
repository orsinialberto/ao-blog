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
    <section className="relative min-h-[calc(100dvh-var(--header-height))] w-full overflow-hidden">
      <Image
        src={withBasePath("/images/home-hero.jpg")}
        alt={t.components.heroSection.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-primary/30" />
      <div className="relative z-10 flex min-h-[calc(100dvh-var(--header-height))] w-full max-w-screen-2xl flex-col items-center justify-center px-8 text-center mx-auto">
        <div className="max-w-4xl w-full">
          <span className="font-label text-white/90 text-sm uppercase tracking-[0.3em] mb-6 block">
            {t.components.heroSection.label}
          </span>
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-normal italic text-white leading-tight mb-14">
            {t.components.heroSection.title}
          </h1>
        </div>
      </div>
    </section>
  );
}

