"use client";

import { motion } from "framer-motion";
import { Cookie, HeartPulse, ShoppingBag, LayoutGrid } from "lucide-react";
import { useNav, type ViewId } from "@/lib/store";

const items: {
  id: ViewId | "menu";
  label: string;
  icon: typeof Cookie;
}[] = [
  { id: "bars", label: "Bars", icon: Cookie },
  { id: "nutrition", label: "Nutrition", icon: HeartPulse },
  { id: "ordering", label: "Order", icon: ShoppingBag },
  { id: "menu", label: "Menu", icon: LayoutGrid },
];

export default function StickyNav() {
  const { view, overlay, goTo, openMenu } = useNav();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-safe"
    >
      <div className="mx-auto w-full max-w-[var(--app-max)] px-4 pb-2">
        <div className="flex items-stretch justify-between gap-1 rounded-full border border-[var(--hairline)] bg-[rgba(45,9,17,0.82)] px-2 py-1.5 shadow-float backdrop-blur-xl">
          {items.map(({ id, label, icon: Ico }) => {
            const active =
              id === "menu" ? overlay?.type === "menu" : view === id;
            return (
              <button
                key={id}
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
                <Ico
                  className={`relative z-10 h-[19px] w-[19px] transition-colors ${
                    active ? "text-coral" : "text-[rgba(227,210,194,0.7)]"
                  }`}
                  strokeWidth={1.6}
                />
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
