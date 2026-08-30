"use client";

import type { ElementType, ReactNode } from "react";
import { gsap, PLOP_EASE, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";

/**
 * The signature entrance: the element drops in from nothing, overshoots, and
 * settles *crooked*.
 *
 * The crookedness is the whole point. The reference site lands its objects at
 * a non-zero angle so they read as physical things placed by hand rather than
 * boxes snapping to a grid. `settle` defaults to a slight tilt for that
 * reason — pass 0 for anything that genuinely must sit square, like a card in
 * a tidy row.
 */
export default function PlopIn({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  settle = 4,
  from = -18,
  start = "top 85%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Resting angle in degrees. Non-zero on purpose. */
  settle?: number;
  /** Starting angle in degrees. */
  from?: number;
  start?: string;
}) {
  const ref = useGsapScope<HTMLDivElement>((scope) => {
    const item = scope.firstElementChild;
    if (!item) return;

    // Reduced motion still gets the resting tilt, just without the travel —
    // the layout is designed around things sitting at an angle.
    if (prefersReducedMotion()) {
      gsap.set(item, { rotate: settle, opacity: 1 });
      return;
    }

    gsap.set(item, { scale: 0, rotate: from, yPercent: -14, opacity: 0 });

    gsap.to(item, {
      scale: 1,
      rotate: settle,
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      delay,
      ease: PLOP_EASE,
      scrollTrigger: { trigger: scope, start, once: true },
    });
  }, [delay, settle, from, start]);

  return (
    <Tag ref={ref} className={className}>
      <div className="will-change-transform">{children}</div>
    </Tag>
  );
}
