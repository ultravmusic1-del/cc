"use client";

import Image from "next/image";
import { gsap, PLOP_EASE, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import MomentumHover from "./motion/MomentumHover";
import HandwrittenNote from "./motion/HandwrittenNote";
import { useContent } from "@/lib/i18n";

/**
 * Positions overflow the box deliberately — negative insets and >100% widths.
 * Objects cropped by the edge of the slab read as a scattered pile; objects
 * politely contained read as a product grid. The hero column is narrow, so the
 * bars are sized against it and allowed to spill left into the headline's
 * whitespace and past the right edge.
 *
 * The rest angles are large and uneven on purpose. Small tidy rotations read as
 * a mistake; seventeen degrees reads as a decision.
 */
const LAYOUT = [
  {
    src: "/images/oat-protein-bar-v2.png",
    className: "-left-[12%] top-[2%] w-[58%]",
    rotate: -17,
    drift: -60,
  },
  {
    src: "/images/oat-bar-hero-2.png",
    className: "left-[14%] top-[26%] w-[82%]",
    rotate: 5,
    drift: 30,
  },
  {
    src: "/images/oat-cookie-bar-v2.png",
    className: "right-[2%] top-[6%] w-[52%]",
    rotate: 19,
    drift: -95,
  },
];

/**
 * The hero composition: bars thrown across the slab at angles.
 *
 * Three things stack here — a staggered plop-in on load, a scrubbed parallax
 * that drifts each bar at its own rate as you scroll, and the inertia flick on
 * hover. They compose rather than conflict because each owns a different
 * property: the entrance animates scale and rotation, parallax owns y on a
 * wrapper element, and the flick works on a third nested element — so no two
 * ever write the same transform.
 */
export default function HeroBars() {
  const c = useContent();

  const ref = useGsapScope<HTMLDivElement>((scope) => {
    const layers = gsap.utils.toArray<HTMLElement>("[data-bar]", scope);
    if (!layers.length) return;

    if (prefersReducedMotion()) {
      gsap.set(layers, { opacity: 1, scale: 1 });
      return;
    }

    layers.forEach((layer, i) => {
      const angle = Number(layer.dataset.rotate ?? 0);
      const drift = Number(layer.dataset.drift ?? 0);

      gsap.fromTo(
        layer,
        { opacity: 0, scale: 0.55, rotate: angle - 26, yPercent: -18 },
        {
          opacity: 1,
          scale: 1,
          rotate: angle,
          yPercent: 0,
          duration: 0.95,
          delay: 0.35 + i * 0.12,
          ease: PLOP_EASE,
        },
      );

      // Parallax on a wrapper, so it never overwrites the rotation above.
      gsap.to(layer.parentElement, {
        y: drift,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* visible-overflow so the bars can break the column edges */}
      <MomentumHover className="relative aspect-square w-full max-w-[30rem] lg:mx-0 lg:ml-auto lg:max-w-none">
        {LAYOUT.map((bar, i) => (
          <div key={bar.src} className={`absolute ${bar.className}`}>
            <div
              data-bar
              data-rotate={bar.rotate}
              data-drift={bar.drift}
              data-momentum-item
              className="will-change-transform"
              style={{ opacity: 0 }}
            >
              <div data-momentum-target>
                <Image
                  src={bar.src}
                  alt={i === 1 ? c.hero.imageAlt : ""}
                  aria-hidden={i !== 1}
                  width={785}
                  height={698}
                  priority={i === 1}
                  sizes="(min-width: 1024px) 26rem, 60vw"
                  className="h-auto w-full drop-shadow-[0_22px_34px_color-mix(in_srgb,var(--burgundy)_42%,transparent)]"
                />
              </div>
            </div>
          </div>
        ))}
      </MomentumHover>

      <HandwrittenNote
        tilt="right"
        className="absolute -bottom-2 right-2 z-10 lg:right-6"
      >
        {c.brand.location}
      </HandwrittenNote>
    </div>
  );
}
