"use client";

import { useEffect, type ReactNode } from "react";
import { useCurtain } from "@/components/motion/Curtain";

/**
 * template.tsx (not layout.tsx) on purpose: a template remounts on every
 * navigation, which is exactly the hook needed to drain the curtain once the
 * new route's DOM exists.
 *
 * useEffect rather than useLayoutEffect — the reveal should start after the
 * browser has painted the incoming page, otherwise the curtain retracts over a
 * blank frame.
 *
 * reveal() is called directly and NOT deferred through requestAnimationFrame.
 * It was, and that was a bug: rAF does not fire in a fully throttled tab, so
 * the call never happened — taking the curtain's own failsafe down with it,
 * since arming that was the first thing reveal() did. Anything responsible for
 * uncovering the page must not depend on the frame loop.
 */
export default function Template({ children }: { children: ReactNode }) {
  const { reveal } = useCurtain();

  useEffect(() => {
    reveal();
  }, [reveal]);

  return <>{children}</>;
}
