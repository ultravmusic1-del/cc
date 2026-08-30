"use client";

import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { useLang } from "@/lib/i18n";

/**
 * Marginalia — a short handwritten aside, tilted off-axis, that writes itself
 * on when scrolled to.
 *
 * Deliberately constrained: the CSS caps it at 14ch and centres it, because
 * handwriting reads as an annotation only while it stays shorter than the
 * thing it annotates. It is never body copy.
 *
 * Arabic gets a plain fade — the Caveat face has no Arabic glyphs (Cairo takes
 * over via the [lang="ar"] rules), and per-character animation would sever the
 * cursive joins.
 */
export default function HandwrittenNote({
  children,
  tilt = "right",
  size = "regular",
  className = "",
}: {
  children: string;
  tilt?: "left" | "right" | "none";
  size?: "regular" | "large";
  className?: string;
}) {
  const { lang } = useLang();

  const ref = useGsapScope<HTMLParagraphElement>(
    (scope) => {
      if (prefersReducedMotion()) {
        gsap.set(scope, { opacity: 1 });
        return;
      }

      if (lang === "ar") {
        gsap.fromTo(
          scope,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: { trigger: scope, start: "top 95%", once: true },
          },
        );
        return;
      }

      const split = new SplitText(scope, {
        type: "words,chars",
        wordsClass: "split-word",
        charsClass: "split-char",
      });

      gsap.set(scope, { opacity: 1 });
      gsap.fromTo(
        split.chars,
        { opacity: 0, rotate: 22, x: "-0.25em", y: "0.5em" },
        {
          opacity: 1,
          rotate: 0,
          x: 0,
          y: 0,
          duration: 0.75,
          // 16ms apart: fast enough to read as one gesture rather than
          // letters arriving one at a time.
          stagger: 0.016,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: { trigger: scope, start: "top 95%", once: true },
        },
      );

      return () => split.revert();
    },
    [lang],
  );

  const tiltClass =
    tilt === "right"
      ? "note--tilt-r"
      : tilt === "left"
        ? "note--tilt-l"
        : "";

  // See SplitReveal: keyed on language so the element is rebuilt rather than
  // reconciled against DOM that SplitText has rewritten.
  return (
    <p
      key={lang}
      ref={ref}
      className={`note ${size === "large" ? "note--l" : ""} ${tiltClass} ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </p>
  );
}
