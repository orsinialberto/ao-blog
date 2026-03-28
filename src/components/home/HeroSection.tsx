import Image from "next/image";
import { withBasePath } from "@/lib/paths";
import { getTranslations } from "@/i18n";
import { LocalizedLink } from "@/components/LocalizedLink";
import type { SupportedLocale } from "@/config/locales";

interface HeroSectionProps {
  locale: SupportedLocale;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = getTranslations(locale);

  return (
    <section className="relative h-[870px] w-full overflow-hidden">
      <Image
        src={withBasePath("/images/home-hero.jpg")}
        alt={t.components.heroSection.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-primary/20" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          <span className="font-label text-white/90 text-sm uppercase tracking-[0.3em] mb-6 block">
            {t.components.heroSection.label}
          </span>
          <h1 className="font-headline text-5xl md:text-8xl font-normal italic text-white leading-tight mb-8">
            {t.components.heroSection.title}
          </h1>
          <LocalizedLink
            href="/viaggi"
            className="inline-flex items-center gap-3 bg-white text-brand-primary px-8 py-4 rounded-lg font-label text-sm uppercase tracking-widest hover:bg-brand-surface-low transition-all duration-300 active:scale-95"
          >
            {t.components.heroSection.cta}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

