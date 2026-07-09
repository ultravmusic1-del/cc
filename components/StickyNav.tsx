"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { HeartPulse, ShoppingBag, LayoutGrid } from "lucide-react";
import MaskIcon from "./ui/MaskIcon";
import { useNav, type ViewId } from "@/lib/store";
import { useT } from "@/lib/i18n";

const items: {
  id: ViewId | "menu";
  labelKey: "bars" | "nutrition" | "order" | "menu";
  icon?: typeof HeartPulse;
  img?: string;
}[] = [
  { id: "bars", labelKey: "bars", img: "/images/icons/oat-bar-bold.png" },
  { id: "nutrition", labelKey: "nutrition", icon: HeartPulse },
  { id: "ordering", labelKey: "order", icon: ShoppingBag },
  { id: "menu", labelKey: "menu", icon: LayoutGrid },
];

export default function StickyNav() {
  const { view, overlay, goTo, openMenu } = useNav();
  const t = useT();
  const barRef = useRef<HTMLDivElement>(null);

  // One-time staggered entrance for the nav items (anime.js). Framer owns
  // the sliding active pill; this only animates the icons/labels in on load.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    animate(el.querySelectorAll("[data-nav-item]"), {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: stagger(70, { start: 250 }),
      ease: "out(3)",
    });
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-safe"
    >
      <div className="mx-auto w-full max-w-[var(--app-max)] px-4 pb-2">
        <div
          ref={barRef}
          className="flex items-stretch justify-between gap-1 rounded-full border border-[var(--hairline)] bg-[rgba(45,9,17,0.78)] px-2 py-1.5 shadow-[0_10px_34px_-14px_rgba(15,3,7,0.65)] backdrop-blur-xl"
        >
          {items.map(({ id, labelKey, icon: Ico, img }) => {
            const label = t.nav[labelKey];
            const active =
              id === "menu" ? overlay?.type === "menu" : view === id;
            const iconClass = `relative z-10 h-[19px] w-[19px] transition-colors ${
              active ? "text-coral" : "text-[rgba(227,210,194,0.7)]"
            }`;
            return (
              <button
                key={id}
                data-nav-item
                onClick={() => (id === "menu" ? openMenu() : goTo(id as ViewId))}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[rgba(236,91,69,0.16)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {img ? (
                  <MaskIcon src={img} className={iconClass} />
                ) : Ico ? (
                  <Ico className={iconClass} strokeWidth={1.6} />
                ) : null}
                <span
                  className={`relative z-10 text-[0.6rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    active ? "text-cream" : "text-[rgba(227,210,194,0.6)]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
