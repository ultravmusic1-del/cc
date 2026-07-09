"use client";

import { Menu, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useNav, type ViewId } from "@/lib/store";
import { useT } from "@/lib/i18n";

/** Desktop-only inline nav. Mirrors StickyNav's destinations, which stays the
    primary nav on mobile (this header nav is hidden below lg, that one above). */
const deskItems: {
  id: ViewId | "menu";
  labelKey: "bars" | "nutrition" | "order" | "menu";
}[] = [
  { id: "bars", labelKey: "bars" },
  { id: "nutrition", labelKey: "nutrition" },
  { id: "ordering", labelKey: "order" },
  { id: "menu", labelKey: "menu" },
];

export default function Header() {
  const { view, overlay, goTo, openMenu } = useNav();
  const t = useT();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--hairline)] bg-[rgba(70,13,27,0.92)] pt-safe backdrop-blur-md">
      {/* Three equal-weight zones keep the wordmark dead-centre while the
          menu and Order controls sit symmetrically at the edges.
          On desktop the hamburger zone drops out, so the logo falls to the
          start and the inline nav takes the freed space. */}
      <div className="mx-auto flex h-16 w-full max-w-[var(--app-max)] items-center px-4 lg:h-20 lg:px-8">
        <div className="flex flex-1 items-center justify-start lg:hidden">
          <button
            onClick={openMenu}
            aria-label={t.header.openMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5"
          >
            <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={() => goTo("home")}
          aria-label={t.header.home}
          className="shrink-0 lg:me-10"
        >
          <Logo size="md" />
        </button>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center gap-1 lg:flex"
        >
          {deskItems.map(({ id, labelKey }) => {
            const label = t.nav[labelKey];
            const active =
              id === "menu" ? overlay?.type === "menu" : view === id;
            return (
              <button
                key={id}
                onClick={() => (id === "menu" ? openMenu() : goTo(id as ViewId))}
                aria-current={active ? "page" : undefined}
                className="relative rounded-full px-4 py-2 transition-colors"
              >
                {active && (
                  // Distinct layoutId from StickyNav's pill: both navs stay
                  // mounted (the other is merely display:none), and Framer
                  // would otherwise try to animate one pill between them.
                  <motion.span
                    layoutId="nav-pill-desktop"
                    className="absolute inset-0 rounded-full bg-[rgba(236,91,69,0.16)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "text-cream"
                      : "text-[rgba(227,210,194,0.62)] hover:text-cream"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end lg:flex-none">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => goTo("ordering")}
            aria-label={t.header.ordering}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5 hover:text-coral"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
