import Image from "next/image";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

interface AboutSectionProps {
  locale: SupportedLocale;
}

export function AboutSection({ locale }: AboutSectionProps) {
  const t = getTranslations(locale);
  const { eyebrow, name, bio } = t.components.aboutSection;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center">

          <div className="relative h-[300px] md:h-[440px] w-full md:w-[48%] flex-shrink-0 overflow-hidden">
            <Image
              src="/images/profile.jpg"
              alt={name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 48vw"
            />
          </div>

          <div className="relative z-10 bg-[#faf9f7] md:-ml-16 flex-1 p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
            <div className="w-10 h-px bg-[#496455] mb-6" />
            <span className="font-label text-xs uppercase tracking-[0.25em] text-[#496455]">
              {eyebrow}
            </span>
            <h2 className="font-hero italic text-2xl md:text-3xl lg:text-4xl text-[#173124] mt-4 mb-6 leading-tight">
              {name}
            </h2>
            <div className="space-y-4">
              {bio.map((paragraph, i) => (
                <p key={i} className="font-body text-sm leading-relaxed text-[#424844]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
