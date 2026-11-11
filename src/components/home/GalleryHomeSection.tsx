import { LocalizedLink } from "@/components/LocalizedLink";
import { HandUnderline } from "@/components/HandUnderline";
import { HandHighlight } from "@/components/HandHighlight";
import { WigglyText } from "@/components/WigglyText";
import { Clothesline } from "@/components/home/Clothesline";
import { getGalleryAlbums } from "@/lib/gallery";
import { pickHomePhotos } from "@/lib/galleryLogic";
import { getTranslations } from "@/i18n";
import type { SupportedLocale } from "@/config/locales";

const MAX_PHOTOS = 6;

interface GalleryHomeSectionProps {
  locale: SupportedLocale;
}

export function GalleryHomeSection({ locale }: GalleryHomeSectionProps) {
  const { title, cta, photoAlt } = getTranslations(locale).components.galleryHome;
  const albums = getGalleryAlbums(locale);
  const items = pickHomePhotos(albums, MAX_PHOTOS).map(({ slug, photo }) => {
    const album = albums.find((a) => a.slug === slug)!;
    return { slug, photo, alt: photoAlt.replace("{title}", album.title) };
  });

  return (
    <section className="notebook-paper overflow-hidden px-6 py-16 md:py-24">
      <h2 className="mx-auto max-w-lg text-balance text-center font-hand text-4xl leading-tight text-brand-primary md:text-5xl xl:text-[3.5rem]">
        <span className="group relative inline-block pb-3">
          <WigglyText text={title} />
          <HandUnderline className="bottom-0 h-2 md:h-3" />
        </span>
      </h2>

      <div className="mx-auto mt-10 w-full max-w-5xl">
        <Clothesline items={items} />
      </div>

      <div className="mt-6 flex justify-center font-hand">
        <LocalizedLink
          href="/galleria"
          className="relative inline-block -rotate-2 px-10 py-4 text-2xl text-brand-primary transition-transform duration-300 hover:rotate-0 hover:scale-105 motion-reduce:transition-none"
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
          <span className="relative inline-block px-[0.3em]">
            <HandHighlight />
            {cta} →
          </span>
        </LocalizedLink>
      </div>
    </section>
  );
}
