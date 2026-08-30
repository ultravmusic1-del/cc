"use client";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";

/**
 * The soft organic forms drifting behind each slab.
 *
 * The trick borrowed from the reference: these are *stroked* paths whose
 * stroke-width breathes between 0 and a large value on a slow sine loop. A
 * thick stroke on a curved open path reads as a fat organic blob, and animating
 * one number is far cheaper than morphing path data or blurring gradients.
 *
 * Two performance rules, both learned from this project's history of mobile
 * freezes: the loop is paused by ScrollTrigger whenever the slab is off-screen,
 * and there is no blend mode or backdrop filter anywhere near it.
 */
export default function BreathingShapes({
  variant = "a",
  color = "var(--brand-tint)",
  opacity = 0.5,
  className = "",
}: {
  variant?: "a" | "b" | "c";
  /** Any CSS colour. Callers pass a palette token. */
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const ref = useGsapScope<HTMLDivElement>(
    (scope) => {
      const paths = scope.querySelectorAll("path");
      if (!paths.length || prefersReducedMotion()) return;

      gsap.set(paths, {
        transformOrigin: "center center",
        transformBox: "fill-box",
      });

      const tl = gsap
        .timeline({ paused: true, repeat: -1, yoyo: true })
        .to(paths, {
          attr: { "stroke-width": (i: number) => 54 + i * 16 },
          rotate: 2,
          duration: 3.4,
          ease: "sine.inOut",
          stagger: 0.4,
        });

      ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });
    },
    [variant],
  );

  const paths = SHAPES[variant];

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        style={{ opacity }}
      >
        <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={0}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * Open curves, not closed blobs. A closed path fattened by stroke-width just
 * becomes a ring; an open one becomes a rolling hill, which is the shape the
 * whole design leans on.
 */
const SHAPES: Record<string, string[]> = {
  a: [
    "M-100 620 C 180 640, 260 420, 470 430 C 690 440, 720 660, 980 600 C 1150 560, 1220 470, 1320 500",
    "M-120 300 C 120 180, 300 340, 520 250 C 760 150, 900 320, 1150 230",
  ],
  b: [
    "M-100 240 C 200 120, 340 380, 600 320 C 860 260, 980 60, 1320 180",
    "M-120 640 C 160 700, 380 520, 620 600 C 880 690, 1020 520, 1320 580",
  ],
  c: [
    "M-100 460 C 240 300, 420 660, 700 480 C 940 330, 1080 600, 1320 420",
    "M-120 120 C 180 240, 420 40, 660 160 C 900 280, 1080 100, 1320 220",
  ],
};
