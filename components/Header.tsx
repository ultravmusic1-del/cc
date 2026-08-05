"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useNav } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { useT } from "@/lib/i18n";

/** Created once at module scope — re-creating a motion component during render
    remounts it and loses the animation state. */
const MotionLink = motion.create(Link);

/** Desktop-only inline nav. Mirrors StickyNav's destinations, which stays the
    primary nav on mobile (this header nav is hidden below lg, that one above). */
const deskItems: {
  id: "menu" | Exclude<keyof typeof ROUTES, "home">;
  labelKey: "bars" | "nutrition" | "order" | "menu";
}[] = [
  { id: "bars", labelKey: "bars" },
  { id: "nutrition", labelKey: "nutrition" },
  { id: "ordering", labelKey: "order" },
  { id: "menu", labelKey: "menu" },
];

export default function Header() {
  const { overlay, openMenu } = useNav();
  const pathname = usePathname();
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

        <Link
          href={ROUTES.home}
          aria-label={t.header.home}
          className="shrink-0 lg:me-10"
        >
          <Logo size="md" />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center gap-1 lg:flex"
        >
          {deskItems.map(({ id, labelKey }) => {
            const label = t.nav[labelKey];
            // Bars stays active on its product pages — see StickyNav.
            const active =
              id === "menu"
                ? overlay?.type === "menu"
                : id === "bars"
                  ? pathname === ROUTES.bars || pathname.startsWith(`${ROUTES.bars}/`)
                  : pathname === ROUTES[id];
            const inner = (
              <>
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
              </>
            );
            const className = "relative rounded-full px-4 py-2 transition-colors";

            // "Menu" opens an overlay rather than navigating, so it stays a
            // button; the rest are real destinations and must be crawlable.
            return id === "menu" ? (
              <button
                key={id}
                onClick={openMenu}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {inner}
              </button>
            ) : (
              <Link
                key={id}
                href={ROUTES[id]}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end lg:flex-none">
          <MotionLink
            whileTap={{ scale: 0.94 }}
            href={ROUTES.ordering}
            aria-label={t.header.ordering}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5 hover:text-coral"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </MotionLink>
        </div>
      </div>
    </header>
  );
}
