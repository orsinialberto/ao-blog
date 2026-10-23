"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { BearReveal } from "@/components/home/BearReveal";
import { CheersBear } from "@/components/home/CheersBear";
import { BEARS, type BearName } from "@/config/bears";

function isBearName(name: string): name is BearName {
  return name in BEARS;
}

// A story bear plays once it is well inside the viewport, not as soon as its edge peeks in at the bottom
const STORY_BEAR_ROOT_MARGIN = "0px 0px -30% 0px";

/**
 * The snowplough skier. When the snowball bear throws (see `.hit-skier` in globals.css) the hit pose
 * shows over it, bottom-aligned and centred, wider than the skier's own canvas.
 */
function HitSkier() {
  const ski = BEARS.ski;
  const hit = BEARS.skiHit;
  return (
    <div className="hit-skier relative">
      <Image src={ski.src} alt="" width={ski.width} height={ski.height} className="h-auto w-full" />
      <Image
        src={hit.src}
        alt=""
        width={hit.width}
        height={hit.height}
        className="hit-skier-hit absolute bottom-0 left-1/2 max-w-none -translate-x-1/2"
      />
    </div>
  );
}

/** The sleeping bear breathes, and three Zs drift up from its muzzle (see `.sleeping-bear` in globals.css). */
function SleepingBear() {
  const { src, width, height } = BEARS.sleeping;
  return (
    <div className="sleeping-bear relative">
      <Image src={src} alt="" width={width} height={height} className="h-auto w-full" />
      <span className="sleeping-z">z</span>
      <span className="sleeping-z">z</span>
      <span className="sleeping-z">z</span>
    </div>
  );
}

// Bears that glide in from the page edge; the others rise into place or are already on the page
const GLIDING_BEARS: BearName[] = ["snowboard", "walker", "map"];

function StoryBear({ name }: { name: BearName }) {
  const figure = "travel-bear-figure";
  // The snowball bear throws when hovered or tapped
  if (name === "throw1") {
    return (
      <BearReveal bear={name} variant="static" className={figure} rootMargin={STORY_BEAR_ROOT_MARGIN}>
        <CheersBear from="throw1" to="throw2" replace autoplay className="pointer-events-auto" />
      </BearReveal>
    );
  }
  if (name === "ski") {
    return (
      <BearReveal bear={name} variant="glide" className={figure} rootMargin={STORY_BEAR_ROOT_MARGIN}>
        <HitSkier />
      </BearReveal>
    );
  }
  if (name === "sleeping") {
    return (
      <BearReveal bear={name} variant="rise" className={figure} rootMargin={STORY_BEAR_ROOT_MARGIN}>
        <SleepingBear />
      </BearReveal>
    );
  }
  if (name === "hush") {
    return <BearReveal bear={name} variant="rise" className={figure} rootMargin={STORY_BEAR_ROOT_MARGIN} />;
  }
  const variant = GLIDING_BEARS.includes(name) ? "glide" : "static";
  return <BearReveal bear={name} variant={variant} className={figure} rootMargin={STORY_BEAR_ROOT_MARGIN} />;
}

/**
 * The story HTML, with each `.travel-bear` slot (from a `:bear[name left|right]` line in the Markdown) filled with that bear.
 * Slots are inside server-rendered HTML, so the bears are portalled in once the HTML is mounted.
 * Each bear sits in the white margin beside the text, on the side its directive names (see `.travel-bear` in globals.css).
 */
export function TravelNarrative({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;
    setSlots(Array.from(rootRef.current.querySelectorAll<HTMLElement>(".travel-bear")));
  }, [content]);

  return (
    <>
      <div ref={rootRef} className="prose-travel" dangerouslySetInnerHTML={{ __html: content }} />
      {slots.map((slot, index) => {
        const name = slot.dataset.bear ?? "";
        if (!isBearName(name)) throw new Error(`Unknown bear "${name}" in travel content`);
        return createPortal(<StoryBear name={name} />, slot, `${index}-${name}`);
      })}
    </>
  );
}
