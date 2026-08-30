"use client";

import type { ElementType, ReactNode } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { useLang } from "@/lib/i18n";

/**
 * Headline reveal: split into lines, each rising out from behind a mask.
 *
 * Two things worth knowing:
 *
 * 1. It re-splits when the language changes. SplitText caches the DOM it
 *    chopped up, so a language swap without a re-split leaves Arabic text
 *    wrapped in spans measured for English.
 * 2. `revert()` on cleanup puts the original text nodes back. Skipping it
 *    means the next split nests spans inside spans and the mask maths drifts.
 *
 * Arabic is split by word, not character: Arabic script is cursive and
 * splitting it per-glyph breaks the joining forms into isolated letters.
 */
export default function SplitReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
}) {
  const { lang } = useLang();

  const ref = useGsapScope<HTMLHeadingElement>(
    (scope) => {
      if (prefersReducedMotion()) {
        gsap.set(scope, { opacity: 1 });
        return;
      }

      const split = new SplitText(scope, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });

      gsap.set(scope, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 0.9,
        delay,
        stagger,
        ease: "couture",
        scrollTrigger: { trigger: scope, start, once: true },
      });

      return () => split.revert();
    },
    [lang, delay, stagger, start],
  );

  // Keyed on language so React throws the element away and builds a new one on
  // a language switch. SplitText replaces the element's children with its own
  // spans, so the DOM no longer matches what React rendered; reconciling that
  // in place left the Arabic copy showing the original English text. Remounting
  // sidesteps the conflict entirely.
  return (
    <Tag key={lang} ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
