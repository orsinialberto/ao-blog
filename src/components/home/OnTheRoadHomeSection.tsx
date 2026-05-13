import Image from "next/image";
import { getTranslations } from "@/i18n";
import { LocalizedLink } from "@/components/LocalizedLink";
import type { SupportedLocale } from "@/config/locales";

const BACKGROUND_IMAGE =
  "https://res.cloudinary.com/dx6hrvg6l/image/upload/c_crop,ar_16:5,g_south,q_auto,f_auto/v1775664072/Passo_Bernina_2024-07-27_13-03-20_1_lunrgy.jpg";

interface OnTheRoadHomeSectionProps {
  locale: SupportedLocale;
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a2.5 2.5 0 0 0 0-5H9" />
      <path d="M6 16V8l-2-2" />
      <path d="M9 8h6l4 4" />
      <path d="M18 12v7a3 3 0 0 1-3 3" />
    </svg>
  );
}

export function OnTheRoadHomeSection({ locale }: OnTheRoadHomeSectionProps) {
  const t = getTranslations(locale);
  const copy = t.components.onTheRoadSection;

  return (
    <section className="py-10 px-6 mb-12">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex min-h-[540px] items-center overflow-hidden rounded-[2rem] bg-slate-900">
          <Image
            src={BACKGROUND_IMAGE}
            alt={copy.imageAlt}
            fill
            className="object-cover object-center opacity-60"
            sizes="(max-width: 1536px) 100vw, 1536px"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent"
            aria-hidden
          />

          <div className="relative z-10 max-w-2xl px-8 py-16 md:px-16 md:py-20">
            <span className="mb-4 block font-label text-sm uppercase tracking-widest text-amber-200/90">
              {copy.eyebrow}
            </span>
            <h2 className="mb-6 font-headline text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-300">
              {copy.description}
            </p>
            <LocalizedLink
              href="/viaggi-in-moto"
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-container px-8 py-4 font-medium text-white shadow-[0_12px_40px_rgba(16,29,39,0.18)] transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.99]"
            >
              {copy.cta}
              <RouteIcon className="h-5 w-5 shrink-0" />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
