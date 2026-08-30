"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap, registerGsap } from "./gsap";

/**
 * Run GSAP work scoped to an element, cleaned up on unmount.
 *
 * `gsap.context` records every tween and ScrollTrigger created inside the
 * callback so `revert()` can undo all of it — including the inline styles
 * GSAP wrote. Without that, a client-side route change leaves dead
 * ScrollTriggers measuring a document that no longer exists, and elements
 * stranded at whatever opacity they were mid-tween.
 *
 * useLayoutEffect rather than useEffect so the "from" state is applied before
 * paint; otherwise elements flash at their final position for one frame.
 */
export function useGsapScope<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: T) => void,
  deps: unknown[] = [],
): RefObject<T> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();
    const ctx = gsap.context(() => setup(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
