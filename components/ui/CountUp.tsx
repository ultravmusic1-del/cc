"use client";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";

/**
 * Counts a numeric value up from zero when it scrolls into view.
 *
 * - Renders the real value on the server, so it is correct with JS disabled and
 *   for crawlers. The animation only ever enhances what is already there.
 * - Preserves any non-digit suffix ("g", " kcal") and passes non-numeric values
 *   ("Fresh", "Zero") straight through untouched.
 * - Lands on the exact original string rather than a re-formatted number, so
 *   "1.5" never renders as "1.50".
 *
 * Triggered on scroll rather than mount: these sit well down the page, and a
 * counter that finishes before you reach it has animated to nobody.
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

  const ref = useGsapScope<HTMLSpanElement>(
    (el) => {
      const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;

      const [, numStr, suffix = ""] = match;
      const target = parseFloat(numStr);
      const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

      if (prefersReducedMotion()) {
        el.textContent = numStr + suffix;
        return;
      }

      const counter = { n: 0 };
      gsap.to(counter, {
        n: target,
        duration: duration / 1000,
        delay: delay / 1000,
        ease: "power2.out",
        onStart: () => {
          el.textContent = (0).toFixed(decimals) + suffix;
        },
        onUpdate: () => {
          el.textContent = counter.n.toFixed(decimals) + suffix;
        },
        onComplete: () => {
          el.textContent = numStr + suffix;
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    [value, duration, delay],
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
