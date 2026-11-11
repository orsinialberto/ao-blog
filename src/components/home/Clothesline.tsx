"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { CLOTHESLINE } from "@/config/galleryDrawings";
import { useInView } from "@/hooks/useInView";
import {
  bodyClipPath,
  pegClipPath,
  pivot,
  ropeBandClipPath,
  windowMask,
  type Polaroid,
} from "@/lib/clotheslineGeometry";
import { optimizeCloudinaryUrl } from "@/lib/imageOptimization";
import { withBasePath } from "@/lib/paths";

export interface ClotheslineItem {
  slug: string;
  photo: string;
  alt: string;
}

interface ClotheslineProps {
  items: ClotheslineItem[];
}

const SWING_DELAY_STEP = 0.7;
const DEVELOP_DELAY_START = 0.3;
const DEVELOP_DELAY_STEP = 0.3;

/** One copy of the whole drawing, clipped to a single piece of it. */
function DrawingPiece({ clipPath }: { clipPath: string }) {
  return (
    <Image
      src={withBasePath(CLOTHESLINE.src)}
      alt=""
      width={CLOTHESLINE.width}
      height={CLOTHESLINE.height}
      className="clothesline-drawing"
      style={{ clipPath }}
    />
  );
}

/** The photo box in % of the drawing, masked to the polaroid window minus the holes where pegs overlap it. */
function photoStyle(polaroid: Polaroid): CSSProperties {
  const { box, svg } = windowMask(polaroid);
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0 / 100% 100% no-repeat`;
  return {
    left: `${(box.left / CLOTHESLINE.width) * 100}%`,
    top: `${(box.top / CLOTHESLINE.height) * 100}%`,
    width: `${(box.width / CLOTHESLINE.width) * 100}%`,
    height: `${(box.height / CLOTHESLINE.height) * 100}%`,
    mask,
    WebkitMask: mask,
  };
}

function polaroidStyle(polaroid: Polaroid, index: number): CSSProperties {
  const { x, y } = pivot(CLOTHESLINE, polaroid);
  return {
    transformOrigin: `${x} ${y}`,
    "--amp": `${polaroid.amp}deg`,
    "--dur": `${polaroid.dur}s`,
    "--delay": `${-SWING_DELAY_STEP * index}s`,
    "--develop-delay": `${DEVELOP_DELAY_START + DEVELOP_DELAY_STEP * index}s`,
  } as CSSProperties;
}

/**
 * The rope is one static layer that is never cut; each polaroid swings in its own layer,
 * which holds only the polaroid body (below the rope band), its photo and its pegs on top.
 */
export function Clothesline({ items }: ClotheslineProps) {
  const [lineRef, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div
      ref={lineRef}
      className={`clothesline${inView ? " is-developed" : ""}`}
      style={{ aspectRatio: `${CLOTHESLINE.width} / ${CLOTHESLINE.height}` }}
    >
      <div className="clothesline-layer">
        <DrawingPiece clipPath={ropeBandClipPath(CLOTHESLINE)} />
      </div>
      {CLOTHESLINE.polaroids.map((polaroid, index) => {
        const item = items[index];
        return (
          <div
            key={polaroid.pivotX}
            className="clothesline-layer clothesline-polaroid"
            style={polaroidStyle(polaroid, index)}
          >
            <DrawingPiece clipPath={bodyClipPath(CLOTHESLINE, polaroid)} />
            {item && (
              <LocalizedLink
                href={`/galleria/${item.slug}`}
                className="clothesline-photo"
                style={photoStyle(polaroid)}
              >
                <Image
                  src={optimizeCloudinaryUrl(item.photo, { width: 300 })}
                  alt={item.alt}
                  width={300}
                  height={300}
                />
              </LocalizedLink>
            )}
            {polaroid.pegs.map((peg) => (
              <DrawingPiece key={peg.x0} clipPath={pegClipPath(CLOTHESLINE, peg)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
