import { getTranslations } from "@/i18n";
import { BearReveal } from "./BearReveal";
import type { SupportedLocale } from "@/config/locales";

// The hiking bear further down the page waits for this bear to scroll out of view
export const REST_BEAR_ID = "rest-bear";

interface HeroQuoteSectionProps {
  locale: SupportedLocale;
}

export function HeroQuoteSection({ locale }: HeroQuoteSectionProps) {
  const t = getTranslations(locale);
  const { lines, author, source } = t.components.heroQuote;

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <blockquote>
          <p className="font-hero text-2xl md:text-3xl italic text-stone-600 leading-relaxed">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {i === 0 && <>&ldquo;</>}
                {line}
                {i === lines.length - 1 && <>&rdquo;</>}
              </span>
            ))}
          </p>
          <footer className="mt-6">
            <cite className="not-italic font-label text-xs uppercase tracking-[0.25em] text-stone-600">
              {author}
              <span className="mx-2 text-stone-300">/</span>
              {source}
            </cite>
          </footer>
        </blockquote>
        <BearReveal bear="rest" id={REST_BEAR_ID} className="mx-auto mt-10 w-36 md:w-64" />
      </div>
    </section>
  );
}
