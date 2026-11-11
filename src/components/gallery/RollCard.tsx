"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { ROLL } from "@/config/galleryDrawings";
import { useInView } from "@/hooks/useInView";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { withBasePath } from "@/lib/paths";
import type { GalleryAlbum } from "@/lib/gallery";

interface RollCardProps {
  album: GalleryAlbum;
  photoCountLabel: string;
  href: string;
}

const NO_HOVER_QUERY = "(hover: none)";

function subscribeToNoHover(onChange: () => void) {
  const query = window.matchMedia(NO_HOVER_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Touch screens have no hover, so there the roll opens when it scrolls into view. */
function useNoHover() {
  return useSyncExternalStore(
    subscribeToNoHover,
    () => window.matchMedia(NO_HOVER_QUERY).matches,
    () => false,
  );
}

function percentBox(box: { left: number; top: number; width: number; height: number }) {
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  };
}

export function RollCard({ album, photoCountLabel, href }: RollCardProps) {
  const [rollRef, inView] = useInView<HTMLDivElement>({ threshold: 0.6 });
  const noHover = useNoHover();
  const isOpen = noHover && inView;
  const drawingSrc = withBasePath(ROLL.src);

  return (
    <LocalizedLink href={href} className={`roll-card block${isOpen ? " is-open" : ""}`}>
      <div
        ref={rollRef}
        className="relative"
        style={{ aspectRatio: `${ROLL.width} / ${ROLL.height}` }}
      >
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${ROLL.canEdge}%)` }}
        >
          <div className="roll-film absolute inset-0">
            {album.photos.slice(0, 3).map((photo, index) => (
              <Image
                key={photo}
                src={optimizeCloudinaryUrl(photo, { width: 400 })}
                alt=""
                width={400}
                height={267}
                className="roll-photo absolute object-cover"
                style={percentBox(ROLL.frames[index])}
              />
            ))}
            <Image
              src={drawingSrc}
              alt=""
              width={ROLL.width}
              height={ROLL.height}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
        <Image
          src={drawingSrc}
          alt=""
          width={ROLL.width}
          height={ROLL.height}
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - ROLL.canEdge}% 0 0)` }}
        />
        <span
          className="roll-label absolute font-hand text-brand-primary"
          style={percentBox(ROLL.label)}
        >
          {album.shortTitle}
        </span>
        <span
          className="absolute text-sm text-brand-muted"
          style={{ left: `${ROLL.frames[0].left}%`, top: "62%" }}
        >
          {album.year} · {photoCountLabel}
        </span>
      </div>
    </LocalizedLink>
  );
}
