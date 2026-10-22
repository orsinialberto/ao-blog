import Image from "next/image";
import { NotebookReveal } from "./NotebookReveal";
import { HandHighlight } from "@/components/HandHighlight";
import { HandwrittenText } from "@/components/HandwrittenText";
import { getTranslations } from "@/i18n";
import { BEARS } from "@/config/bears";
import type { SupportedLocale } from "@/config/locales";

interface AboutSectionProps {
  locale: SupportedLocale;
}

export function AboutSection({ locale }: AboutSectionProps) {
  const t = getTranslations(locale);
  const { name, bio } = t.components.aboutSection;

  return (
    <section className="bg-white">
      <div className="md:hidden notebook-paper px-6 py-12 text-center text-[#173124]">
        <div className="relative mx-auto w-3/5 max-w-[240px] aspect-[2080/2456] -rotate-2">
          <Image
            src="/images/polaroid.png"
            alt=""
            fill
            className="object-contain"
            sizes="240px"
          />
        </div>
        <h2 className="mt-8 font-hand text-3xl font-bold uppercase leading-tight">
          {name}
        </h2>
        <div className="mt-4 space-y-4 font-hand text-lg font-bold uppercase leading-8">
          {bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="relative mx-auto mt-8 w-36 aspect-[900/576]">
          <Image
            src={BEARS.tent.src}
            alt=""
            fill
            className="object-contain"
            sizes="144px"
          />
        </div>
      </div>
      <div className="hidden md:block">
      <NotebookReveal
        leftPage={
          <>
            <div className="absolute left-[14%] top-[10%] w-[35%] aspect-[2080/2456]">
              <Image
                src="/images/polaroid.png"
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 1152px) 35vw, 403px"
              />
            </div>
            <div className="absolute left-[24%] top-[64%] w-[22%] aspect-[900/576]">
              <Image
                src={BEARS.tent.src}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 1152px) 22vw, 253px"
              />
            </div>
          </>
        }
        rightPage={
          <>
          <h2 className="absolute left-[52%] top-[15%] w-fit px-[1cqw] isolate before:absolute before:-inset-x-[0.5cqw] before:-inset-y-[0.3cqw] before:-z-10 before:rounded-full before:bg-white/45 before:blur-[0.6cqw] font-hand font-bold uppercase [-webkit-text-stroke:0.02em_currentColor] text-[3.7cqw] leading-none text-[#173124]">
            <HandHighlight />
            <HandwrittenText text={name} />
          </h2>

          {/* Line height matches the notebook's ruled-line pitch (28.4px of 1280) so each text line sits on a rule */}
          <div className="absolute left-[53%] top-[27.4%] w-[30%] isolate before:absolute before:-inset-x-[1cqw] before:-inset-y-[0.5cqw] before:-z-10 before:rounded-[2cqw] before:bg-white/45 before:blur-[0.6cqw] font-hand font-bold uppercase [-webkit-text-stroke:0.02em_currentColor] text-[1.85cqw] leading-[2.22cqw] text-[#173124]">
            {bio.map((paragraph, i) => (
              <p key={i} className="[&+p]:mt-[2.22cqw]">
                <HandwrittenText text={paragraph} seed={i * 100} />
              </p>
            ))}
          </div>
          </>
        }
      />
      </div>
    </section>
  );
}
