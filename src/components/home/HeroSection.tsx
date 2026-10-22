import { withBasePath } from "@/lib/paths";
import Image from "next/image";
import { LocalizedLink } from "@/components/LocalizedLink";
import { HandHighlight } from "@/components/HandHighlight";
import { HandUnderline } from "@/components/HandUnderline";
import { WigglyText } from "@/components/WigglyText";
import { BearReveal } from "./BearReveal";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface HeroSectionProps {
  locale: SupportedLocale;
}

const LINE_HEIGHT = 32;

const notebookPaper = {
  backgroundColor: "var(--color-white)",
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${LINE_HEIGHT - 1}px, rgba(120, 150, 190, 0.12) ${LINE_HEIGHT - 1}px, rgba(120, 150, 190, 0.12) ${LINE_HEIGHT}px)`,
};

export function HeroSection({ locale }: HeroSectionProps) {
  const t = getTranslations(locale);

  return (
    <section
      className="relative min-h-dvh w-full overflow-hidden"
      style={notebookPaper}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: `url(${withBasePath("/images/hero-sketch.jpg")})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-screen-2xl items-center justify-center px-8 pb-16">
        <div className="relative isolate text-center font-hand text-5xl md:text-7xl lg:text-8xl">
          <div
            aria-hidden
            className="absolute -inset-x-12 -inset-y-10 -z-10 bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),transparent)] md:-inset-x-32 md:-inset-y-16"
          />
          <p className="leading-none text-brand-primary">
            <span className="group relative inline-block">
              <WigglyText text={t.components.heroSection.label} />
              <HandUnderline className="-bottom-[0.12em] h-[0.1em]" />
            </span>
          </p>
          <p className="mt-6 text-[max(1rem,0.28em)] leading-tight text-brand-muted md:mt-9 lg:mt-12">
            <WigglyText text={t.components.heroSection.subtitle} />
          </p>
          <p className="mt-3 leading-tight text-brand-primary md:mt-4">
            <span className="mb-2 block text-[max(0.875rem,0.2em)] text-brand-muted md:mb-3">
              <WigglyText text={t.components.heroSection.byline} />
            </span>
            <span className="block text-[max(1.25rem,0.4em)]">
              <span className="relative inline-block px-[0.5em]">
                <HandHighlight />
                <WigglyText text="Alberto Orsini" />
              </span>
            </span>
          </p>
          <LocalizedLink
            href="/viaggi"
            className="mt-6 mb-8 inline-block translate-y-6 -rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105 motion-reduce:transition-none md:mt-8 md:translate-y-8"
          >
            <Image
              src={withBasePath("/images/hero-stamp.png")}
              alt={t.components.heroSection.cta}
              width={583}
              height={600}
              className="w-24 md:w-32"
            />
          </LocalizedLink>
        </div>
        <h1 className="sr-only">
          {t.components.heroSection.titleLine1}{" "}
          {t.components.heroSection.titleLine2}
        </h1>
      </div>
      <BearReveal
        bear="wave"
        variant="wave"
        className="absolute right-3 bottom-6 w-36 md:right-[6%] md:bottom-10 md:w-48 lg:w-60"
      />
    </section>
  );
}
