import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface HeroQuoteSectionProps {
  locale: SupportedLocale;
}

export function HeroQuoteSection({ locale }: HeroQuoteSectionProps) {
  const t = getTranslations(locale);
  const { lines, author, source } = t.components.heroQuote;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote>
          <p className="font-hero text-2xl md:text-3xl lg:text-4xl italic text-stone-700 leading-loose">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {i === 0 && <>&ldquo;</>}
                {line}
                {i === lines.length - 1 && <>&rdquo;</>}
              </span>
            ))}
          </p>
          <footer className="mt-8">
            <cite className="not-italic font-label text-xs uppercase tracking-[0.25em] text-stone-400">
              {author}
              <span className="mx-2 text-stone-300">/</span>
              {source}
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
