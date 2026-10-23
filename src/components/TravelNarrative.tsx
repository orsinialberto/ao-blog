"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BearReveal } from "@/components/home/BearReveal";
import { CheersBear } from "@/components/home/CheersBear";
import { BEARS, type BearName } from "@/config/bears";

function isBearName(name: string): name is BearName {
  return name in BEARS;
}

function StoryBear({ name }: { name: BearName }) {
  const figure = "travel-bear-figure";
  // The snowball bear throws when hovered or tapped
  if (name === "throw1") {
    return (
      <BearReveal bear={name} className={figure}>
        <CheersBear from="throw1" to="throw2" replace className="pointer-events-auto" />
      </BearReveal>
    );
  }
  return <BearReveal bear={name} className={figure} />;
}

/**
 * The story HTML, with each `.travel-bear` slot (from a `:bear[name]` line in the Markdown) filled with that bear.
 * Slots are inside server-rendered HTML, so the bears are portalled in once the HTML is mounted.
 * Each bear sits in the white margin beside the text (see `.travel-bear` in globals.css).
 */
export function TravelNarrative({ content }: { content: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!rootRef.current) return;
    const found = Array.from(rootRef.current.querySelectorAll<HTMLElement>(".travel-bear"));
    // Bears alternate between the right and left margin of the text
    found.forEach((slot, index) => {
      slot.dataset.side = index % 2 === 0 ? "right" : "left";
    });
    setSlots(found);
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
