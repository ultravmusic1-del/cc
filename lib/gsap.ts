"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";

/**
 * Single registration point for GSAP.
 *
 * SplitText, DrawSVG and Inertia used to be paid Club plugins; they ship free
 * in GSAP 3.13+, which is why this design is buildable at all.
 *
 * Registering twice is harmless but the eases are not idempotent-free — the
 * flag keeps CustomEase.create from rebuilding on every Fast Refresh.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    CustomEase,
    DrawSVGPlugin,
    InertiaPlugin,
  );

  // The house eases. `couture` is the default: a long, late-settling curve
  // that makes everything feel weighted rather than springy.
  CustomEase.create("couture", "0.625, 0.05, 0, 1");
  CustomEase.create("energy", "M0,0 C0.32,0.72 0,1 1,1");

  gsap.defaults({ ease: "couture", duration: 0.6 });
}

/** The signature landing ease. Overshoots, then settles crooked. */
export const PLOP_EASE = "elastic.out(1, 0.72)";

/** Shared stagger rhythm so unrelated sections still feel related. */
export const STAGGER = 0.05;

/**
 * True when the visitor has asked for less motion.
 *
 * Every animation in this codebase is gated on this. The rule is that the
 * page must be complete and readable with zero animation — entrance
 * animations set their own end state rather than being skipped, so nothing
 * is left stranded at opacity 0.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Desktop pointer only — hover and inertia effects are meaningless on touch. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export { gsap, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin };
