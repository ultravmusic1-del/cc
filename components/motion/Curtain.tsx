"use client";

import {
  useEffect,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * The page-transition curtain.
 *
 * Reverse-engineered from the reference site, and the mechanism is the good
 * part: this is not a shape morph or a growing circle. It is ONE open path,
 * stroked. DrawSVG draws the stroke along the path from 0% to 100% while the
 * stroke-width swells from a thin line to wider than the viewport. So a
 * squiggle paints itself across the screen and then floods it — one path, two
 * animated numbers, no masks or clip paths.
 *
 * The same timeline runs backwards to uncover, which is why the reveal reads as
 * the ink draining away rather than a separate effect.
 *
 * It also solves a real problem. Headline reveals start at opacity 0, and
 * before hydration that HTML is already painted — so without something over the
 * top you would see the finished headline, then a jump as GSAP claims it. The
 * curtain covers the first paint, which is exactly why the reference has a
 * preloader too.
 */

type CurtainApi = {
  /** Draw the curtain closed. Resolves once the screen is fully covered. */
  cover: () => Promise<void>;
  /** Drain it away. */
  reveal: () => void;
};

const CurtainContext = createContext<CurtainApi | null>(null);

export function useCurtain() {
  const ctx = useContext(CurtainContext);
  if (!ctx) throw new Error("useCurtain must be used inside <CurtainProvider>");
  return ctx;
}

/** Wavy open path. Overshoots the box on both sides so the ends never show. */
const PATH =
  "M -30 72 C 8 34, 30 96, 52 62 C 72 31, 88 84, 130 44";

const THIN = 6;
/** Wide enough to cover the box corner-to-corner once scaled by `slice`. */
const FLOOD = 190;

export function CurtainProvider({ children }: { children: ReactNode }) {
  const pathRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const build = useCallback(() => {
    registerGsap();
    const path = pathRef.current;
    const logo = logoRef.current;
    if (!path || !logo) return null;

    const tl = gsap.timeline({ paused: true });

    tl.set(rootRef.current, { autoAlpha: 1, pointerEvents: "auto" }, 0);
    tl.set(path, { attr: { "stroke-width": THIN }, drawSVG: "0% 0%" }, 0);
    tl.set(logo, { scale: 0, rotate: -64, autoAlpha: 0 }, 0);

    // Draw first, flood last. Holding the thin stroke through the opening
    // beats is what makes it read as a drawn line rather than a wipe.
    tl.to(
      path,
      {
        keyframes: {
          "0%": { attr: { "stroke-width": THIN } },
          "55%": { drawSVG: "0% 100%", attr: { "stroke-width": THIN * 2.5 } },
          "100%": { drawSVG: "0% 100%", attr: { "stroke-width": FLOOD } },
        },
        duration: 1.1,
        ease: "couture",
      },
      0,
    );

    tl.to(
      logo,
      {
        scale: 1,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.72)",
      },
      0.55,
    );

    return tl;
  }, []);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const failsafeRef = useRef<number | undefined>(undefined);

  /**
   * Failsafe.
   *
   * The curtain covers the entire page, so anything that stops the reveal
   * finishing takes the whole site down with it. The animation is rAF-driven,
   * and rAF is throttled to a standstill in a background tab — a link opened
   * in one can sit fully covered indefinitely. A GSAP failure would do the
   * same thing permanently.
   *
   * setTimeout is deliberately used here: it still fires when the frame loop
   * is frozen, which is precisely the case this has to survive. Nothing on
   * this path may depend on rAF. Worst case the reveal is un-animated; the
   * page is never unreachable.
   */
  const armFailsafe = useCallback(() => {
    window.clearTimeout(failsafeRef.current);
    failsafeRef.current = window.setTimeout(() => {
      const root = rootRef.current;
      if (!root || getComputedStyle(root).opacity === "0") return;
      gsap.killTweensOf(root);
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    }, 2600);
  }, []);

  // Armed on mount as well as in reveal(), so the page still uncovers even if
  // nothing ever calls reveal() — a template that failed to mount, an error
  // boundary swallowing the render, a route that never committed.
  useEffect(() => {
    armFailsafe();
    return () => window.clearTimeout(failsafeRef.current);
  }, [armFailsafe]);

  const getTl = useCallback(() => {
    if (!tlRef.current) tlRef.current = build();
    return tlRef.current;
  }, [build]);

  const cover = useCallback(() => {
    // Reduced motion gets an instant, un-animated cover so navigation still
    // hides the pre-hydration flash without any movement.
    if (prefersReducedMotion()) {
      gsap.set(rootRef.current, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(pathRef.current, {
        attr: { "stroke-width": FLOOD },
        drawSVG: "0% 100%",
      });
      gsap.set(logoRef.current, { scale: 1, rotate: 0, autoAlpha: 1 });
      return Promise.resolve();
    }

    const tl = getTl();
    if (!tl) return Promise.resolve();
    return new Promise<void>((resolve) => {
      tl.eventCallback("onComplete", () => resolve());
      tl.play();
    });
  }, [getTl]);

  const reveal = useCallback(() => {
    armFailsafe();

    const tl = getTl();
    if (!tl) {
      gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: "none" });
      tl.pause(0);
      return;
    }

    // Jump to fully-covered, then run the same timeline backwards.
    tl.eventCallback("onComplete", null);
    tl.progress(1).eventCallback("onReverseComplete", () => {
      gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: "none" });
    });
    tl.reverse();
  }, [getTl, armFailsafe]);

  const api = useMemo(() => ({ cover, reveal }), [cover, reveal]);

  return (
    <CurtainContext.Provider value={api}>
      {children}

      {/* Starts covered so the very first paint is hidden; app/template.tsx
          calls reveal() once the route has mounted. */}
      <div
        ref={rootRef}
        aria-hidden
        className="fixed inset-0 z-[2000]"
        style={{ pointerEvents: "auto" }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d={PATH}
            fill="none"
            stroke="var(--burgundy)"
            strokeLinecap="round"
            strokeWidth={FLOOD}
          />
        </svg>

        <div
          ref={logoRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-cream text-brand-cream">
            <span className="font-couture text-3xl italic leading-none">CC</span>
          </span>
        </div>
      </div>
    </CurtainContext.Provider>
  );
}
