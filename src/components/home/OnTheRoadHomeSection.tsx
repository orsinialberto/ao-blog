import Image from "next/image";
import { getTranslations } from "@/i18n";
import { LocalizedLink } from "@/components/LocalizedLink";
import type { SupportedLocale } from "@/config/locales";

const BACKGROUND_IMAGE =
  "https://res.cloudinary.com/dx6hrvg6l/image/upload/c_crop,ar_16:5,g_south,q_auto,f_auto/v1775664072/Passo_Bernina_2024-07-27_13-03-20_1_lunrgy.jpg";

interface OnTheRoadHomeSectionProps {
  locale: SupportedLocale;
}


export function OnTheRoadHomeSection({ locale }: OnTheRoadHomeSectionProps) {
  const t = getTranslations(locale);
  const copy = t.components.onTheRoadSection;

  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center min-h-[520px]">
      <Image
        src={BACKGROUND_IMAGE}
        alt={copy.imageAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden />

      <div className="relative z-10 flex flex-col items-center text-center px-8 py-24 max-w-2xl mx-auto">
        <span className="mb-4 font-label text-xs uppercase tracking-[0.25em] text-white/60">
          {copy.eyebrow}
        </span>
        <h2 className="mb-6 font-headline text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
          {copy.title}
        </h2>
        <p className="mb-10 text-base leading-relaxed text-white/65 max-w-lg">
          {copy.description}
        </p>
        <LocalizedLink
          href="/viaggi-in-moto"
          className="font-label text-xs uppercase tracking-[0.2em] text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors"
        >
          {copy.cta} →
        </LocalizedLink>
      </div>
    </section>
  );
}
