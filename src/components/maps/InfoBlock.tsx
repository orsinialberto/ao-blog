import { LocalizedLink } from '@/components/LocalizedLink';
import type { SupportedLocale } from '@/config/locales';
import { getTranslations } from '@/i18n';
import { bikes } from '@/config/bikes';
import { cloudinaryUrlFromPath } from '@/lib/imageOptimization';
import { CloseIcon } from './icons';
import { fill } from './format';
import InfoCarousel from './InfoCarousel';

type Props = {
  locale: SupportedLocale;
};

/** Rendered at 2x the block's own max width (500px) for retina screens. */
const IMAGE_WIDTH = 1000;

/** Info's own panel-two replacement: a vertical card centred over the
    visible map — not the sidebar-hugging column the other sections use, so
    it renders here instead of inside `MapsPanel`.

    The outer element is a `<section aria-labelledby="maps-panel-title">`,
    the exact tag/attribute pair `MapsPanel` renders — that is what the
    MapLibre-control margin rules in globals.css key off (`.maps-window:has(>
    section[aria-labelledby="maps-panel-title"])`), so Info gets the same
    "make room for the open panel" treatment as every other section without
    a new CSS rule. Info and MapsPanel never render at the same time, so the
    shared id never collides. The card has no visible header — the photo
    starts at the card's own padding, caption underneath stands in for a
    title — so the `<h2>` that id points to is `sr-only`: present for the
    selector and for assistive tech, invisible on screen.

    `z-10`: `.map-pin` (globals.css) carries its own `z-index: 1` that escapes
    into the page's root stacking context, since nothing between it and this
    section establishes one of its own — without it, a marker under the block
    paints over it. Same reasoning as `MapsSidebar` and `MapsPanel`. */
export default function InfoBlock({ locale }: Props) {
  const t = getTranslations(locale).onTheRoad;

  const pages = bikes.map((bike) => {
    const { name, caption, text } = t.bikes[bike.id];
    return {
      id: bike.id,
      src: cloudinaryUrlFromPath(bike.image, IMAGE_WIDTH),
      name,
      caption,
      text,
      goToLabel: fill(t.bikeGoTo, { name }),
    };
  });

  return (
    <section
      aria-labelledby="maps-panel-title"
      className="panel-enter absolute inset-x-3 top-[52px] bottom-[76px] z-10 flex items-center justify-center md:inset-x-auto md:top-3 md:right-3 md:bottom-3 md:left-[206px]"
    >
      <div className="panel-glass flex max-h-full w-[min(500px,100%)] flex-col overflow-hidden md:h-[min(720px,100%)]">
        <h2 id="maps-panel-title" className="sr-only">
          {t.nav.info}
        </h2>
        <InfoCarousel
          pages={pages}
          prevLabel={t.bikePrev}
          nextLabel={t.bikeNext}
          groupLabel={t.infoCarouselLabel}
          closeButton={
            <LocalizedLink
              scroll={false}
              href="/on-the-road"
              aria-label={t.closePanel}
              className="absolute top-2 right-2 z-[3] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm before:absolute before:-inset-2.5 before:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <CloseIcon />
            </LocalizedLink>
          }
        />
      </div>
    </section>
  );
}
