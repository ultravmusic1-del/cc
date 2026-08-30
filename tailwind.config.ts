import type { Config } from "tailwindcss";

/**
 * Two colour groups here, and the distinction matters:
 *
 *   `brand.*`  — the literal palette. Use when a colour is fixed regardless
 *                of surroundings (the burgundy curtain, a coral blob).
 *   `slab.*`   — context colours published by the enclosing `.slab--*`.
 *                Use for anything that must recolour itself depending on
 *                which slab it lands in (nearly all text and buttons).
 *
 * Reaching for `brand.cream` on text is usually a bug: it will be invisible
 * the moment that component is dropped onto a cream slab.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  /**
   * Slab tone classes are built as `slab--${tone}`, so the literal strings
   * never appear in the source and Tailwind drops them from @layer components
   * as unused. That failed silently and very convincingly: every slab rendered
   * cream except burgundy, which survived only because Footer, MobileMenu and
   * not-found happen to spell it out. Keep this list in sync with SlabTone.
   */
  safelist: [
    // Created by GSAP SplitText at runtime, so it appears in no source file.
    // Without it the descender fix in globals.css is purged and every headline
    // gets its g/y/p sliced off again.
    "split-line-mask",
    "slab--cream",
    "slab--beige",
    "slab--pink",
    "slab--coral",
    "slab--olive",
    "slab--burgundy",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: "var(--burgundy)",
          "burgundy-soft": "var(--burgundy-soft)",
          "burgundy-deep": "var(--burgundy-deep)",
          "burgundy-dark": "var(--burgundy-dark)",
          coral: "var(--coral)",
          olive: "var(--olive)",
          pink: "var(--pink)",
          "pink-soft": "var(--pink-soft)",
          "pink-pale": "var(--pink-pale)",
          beige: "var(--beige)",
          cream: "var(--cream)",
        },
        slab: {
          bg: "var(--slab-bg)",
          ink: "var(--slab-ink)",
          "ink-soft": "var(--slab-ink-soft)",
          accent: "var(--slab-accent)",
          note: "var(--slab-note)",
          rule: "var(--slab-rule)",
          "cta-bg": "var(--slab-cta-bg)",
          "cta-ink": "var(--slab-cta-ink)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        note: ["var(--font-note)", "cursive"],
        couture: ["var(--font-couture)", "Georgia", "serif"],
      },
      borderRadius: {
        slab: "var(--slab-radius)",
        card: "clamp(1.25rem, 3vw, 2.25rem)",
      },
      spacing: {
        gutter: "var(--gutter)",
        chrome: "var(--chrome-h)",
      },
      maxWidth: {
        measure: "var(--measure)",
      },
      transitionTimingFunction: {
        couture: "cubic-bezier(0.625, 0.05, 0, 1)",
        energy: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      boxShadow: {
        // Contact shadows for objects that "sit" on a slab. Burgundy-tinted
        // rather than neutral black so shadows stay inside the palette.
        drop: "0 26px 50px -24px color-mix(in srgb, var(--burgundy) 55%, transparent)",
        lift: "0 40px 80px -32px color-mix(in srgb, var(--burgundy) 60%, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
