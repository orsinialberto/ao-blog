import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

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
