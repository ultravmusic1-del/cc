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
 */
export default function Template({ children }: { children: ReactNode }) {
  const { reveal } = useCurtain();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => reveal());
    return () => window.cancelAnimationFrame(id);
  }, [reveal]);

  return <>{children}</>;
}
