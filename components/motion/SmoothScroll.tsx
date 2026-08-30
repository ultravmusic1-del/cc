"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis smooth scroll, driven off GSAP's ticker.
 *
 * Two separate rAF loops (Lenis's own plus GSAP's) drift apart and produce
 * visible jitter in scrubbed animations, so Lenis is stepped from the GSAP
 * ticker instead and lag smoothing is disabled.
 *
 * This component is also what replaced the old app-shell scroll model. The
 * document scrolls normally now; Lenis owns the scroll position and resets it
 * on navigation, which is what the per-screen `.screen-scroll` containers used
 * to do for iOS Safari.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();

    // Honour reduced motion by simply not smoothing. Native scrolling still
    // works; ScrollTrigger reads the document directly.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly-overshooting exponential decay: fast pickup, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    // Expose for route changes and for anything that needs to jump the page.
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // A new route means a new page of content: go to the top without animating,
  // then let ScrollTrigger re-measure against the new document height.
  // Back and forward are not new pages — they are a return to somewhere the
  // visitor has already been, and they expect to land where they left off.
  // Scrolling to the top unconditionally meant browsing halfway down /bars,
  // opening a product and pressing Back put you at the top of /bars again.
  // `history.scrollRestoration` is left at its "auto" default (the previous
  // "manual" override belonged to the removed app-shell model), so the browser
  // restores the offset on a pop and we simply stay out of its way.
  const cameFromHistory = useRef(false);
  useEffect(() => {
    const onPop = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
    } else {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }

    // Images and fonts settle a frame or two after mount and change the page
    // height under ScrollTrigger's feet; refresh once they have.
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
