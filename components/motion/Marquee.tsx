"use client";

import { Fragment } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";

/**
 * A running band of display type — the punctuation between slabs.
 *
 * The track holds two identical copies of the items and translates by exactly
 * -50%, so the moment it wraps, copy two is sitting precisely where copy one
 * started. That is why the copy is duplicated in the DOM rather than animated
 * per-item: an xPercent loop on a single copy leaves a gap the width of the
 * viewport at the wrap point.
 *
 * `aria-hidden` on the duplicate keeps screen readers from reading the phrase
 * twice.
 */
export default function Marquee({
  items,
  speed = 26,
  reverse = false,
  className = "",
}: {
  items: string[];
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const ref = useGsapScope<HTMLDivElement>(
    (scope) => {
      const track = scope.querySelector<HTMLElement>("[data-marquee-track]");
      if (!track || prefersReducedMotion()) return;

      const tween = gsap.to(track, {
        xPercent: reverse ? 50 : -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
      gsap.set(track, { xPercent: reverse ? -50 : 0 });

      ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tween.play(),
        onEnterBack: () => tween.play(),
        onLeave: () => tween.pause(),
        onLeaveBack: () => tween.pause(),
      });
    },
    [speed, reverse, items.join("|")],
  );

  const run = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black leading-none tracking-tight">
            {item}
          </span>
          <span
            aria-hidden
            className="mx-[clamp(1rem,3vw,2.5rem)] inline-block h-[0.5em] w-[0.5em] shrink-0 rounded-full bg-current opacity-60"
          />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-marquee-track className="flex w-max will-change-transform">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
