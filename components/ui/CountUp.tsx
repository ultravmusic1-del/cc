"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

/**
 * Counts a numeric value up from zero on mount, powered by anime.js.
 * - Preserves any non-digit suffix in the value ("g", "%") and passes
 *   non-numeric values ("Fresh", "Zero") straight through untouched.
 * - Renders the real value on the server so it's correct with JS disabled
 *   and for SEO; the animation only enhances on the client.
 * - Respects `prefers-reduced-motion`.
 */
export default function CountUp({
  value,
  className,
  duration = 1500,
  delay = 0,
}: {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Leading number (optionally decimal) + any trailing suffix ("g", "%",
    // " kcal"). Non-numeric values ("Fresh", "Zero") fall through untouched.
    const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const numStr = match[1];
    const suffix = match[2] ?? "";
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = numStr + suffix;
      return;
    }

    const obj = { n: 0 };
    el.textContent = (0).toFixed(decimals) + suffix;
    const anim = animate(obj, {
      n: target,
      duration,
      delay,
      ease: "out(3)",
      onUpdate: () => {
        el.textContent = obj.n.toFixed(decimals) + suffix;
      },
      onComplete: () => {
        el.textContent = numStr + suffix; // land on the exact original string
      },
    });

    return () => {
      anim.pause();
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
