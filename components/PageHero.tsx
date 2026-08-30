"use client";

import type { ReactNode } from "react";
import Slab, { type SlabTone } from "./Slab";
import SplitReveal from "./motion/SplitReveal";
import HandwrittenNote from "./motion/HandwrittenNote";

/**
 * Opening slab for an interior page.
 *
 * Interior pages get a shorter hero than home — enough to establish the tone
 * and give the travelling nav room to leave the top, but not a second full
 * screen of scrolling before any content.
 */
export default function PageHero({
  eyebrow,
  title,
  note,
  tone = "cream",
  shapes = "b",
  children,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  tone?: SlabTone;
  shapes?: "a" | "b" | "c";
  children?: ReactNode;
}) {
  return (
    <Slab
      tone={tone}
      shapes={shapes}
      shapeColor="var(--pink)"
      shapeOpacity={0.75}
      innerClassName="pt-36 lg:pt-40"
    >
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <SplitReveal
            as="h1"
            className="display-l mt-5 font-display font-black"
            delay={0.1}
          >
            {title}
          </SplitReveal>
        </div>
        {note && (
          <HandwrittenNote tilt="right" className="md:mb-2">
            {note}
          </HandwrittenNote>
        )}
      </div>
      {children}
    </Slab>
  );
}
