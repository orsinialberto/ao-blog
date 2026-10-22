import Image from "next/image";
import { LocalizedLink } from "@/components/LocalizedLink";
import { WigglyText } from "@/components/WigglyText";
import { withBasePath } from "@/lib/paths";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface OnTheRoadHomeSectionProps {
  locale: SupportedLocale;
}

export function OnTheRoadHomeSection({ locale }: OnTheRoadHomeSectionProps) {
  const t = getTranslations(locale);
  const { title, cta, imageAlt } = t.components.onTheRoadHome;

  return (
    <section className="notebook-paper px-6 py-16 md:py-24">
      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:gap-8">
        <div className="w-full max-w-md md:ml-16 md:w-2/5 md:max-w-none md:shrink-0 lg:ml-32">
          <Image
            src={withBasePath("/images/on-the-road-sketch.jpg")}
            alt={imageAlt}
            width={1100}
            height={733}
            className="h-auto w-full mix-blend-multiply"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>

        <div className="flex w-full flex-col items-center text-center font-hand md:w-auto md:flex-none">
          <h2 className="mx-auto max-w-lg font-hand text-4xl leading-tight text-brand-primary md:text-5xl lg:text-[3.5rem]">
            <WigglyText text={title} />
          </h2>
          <LocalizedLink
            href="/on-the-road"
            className="relative mt-10 inline-block -rotate-2 px-10 py-4 text-2xl text-brand-primary transition-transform duration-300 hover:rotate-0 hover:scale-105 motion-reduce:transition-none"
          >
            <svg
              aria-hidden
              viewBox="0 0 200 60"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <path
                d="M6 8 C60 3 140 5 194 6 C198 20 197 40 194 53 C140 57 60 56 7 54 C3 40 4 22 6 8 Z M10 12 C70 8 130 9 190 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="relative">{cta} →</span>
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
