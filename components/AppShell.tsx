"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { NavProvider, useNav } from "@/lib/store";
import { LEGACY_HASH_ROUTES } from "@/lib/routes";
import { scrollToTop } from "@/lib/scroll";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { LangProvider } from "@/lib/i18n";
import Header from "./Header";
import StickyNav from "./StickyNav";
import MobileMenu from "./MobileMenu";
import AboutDrawer from "./AboutDrawer";
import GiftingPromo from "./GiftingPromo";

function Shell({ children }: { children: ReactNode }) {
  const { overlay, closeOverlay } = useNav();
  const pathname = usePathname();
  const router = useRouter();

  // Lock the active screen's internal scroll while any overlay is open.
  // (The document itself never scrolls — see body { overflow:hidden }.)
  // Keyed on both the overlay state and the pathname, since a route change
  // mounts a fresh screen element that would otherwise lose the lock.
  const hasOverlay = overlay !== null;
  useEffect(() => {
    const screen = document.querySelector<HTMLElement>("main > section");
    if (screen) screen.style.overflowY = hasOverlay ? "hidden" : "";
  }, [hasOverlay, pathname]);

  // Every route is its own page and starts at the top automatically: navigating
  // unmounts the old screen and mounts a brand-new scroll container, which the
  // browser starts at scrollTop 0 — no programmatic scroll needed (the fix for
  // iOS Safari, which ignored scrollTo/scrollTop/scrollIntoView). This is why
  // ScreenShell lives inside each screen and must never be hoisted into a
  // layout: a layout-level shell would persist across routes and stop
  // remounting. scrollToTop() is a belt-and-suspenders reset of the container.
  useIsoLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  // Links shared before Tier 2 used #bars, #nutrition, etc. Send them to the
  // real route once on mount, so nothing previously shared lands on Home.
  //
  // `Object.hasOwn` rather than a bare lookup: LEGACY_HASH_ROUTES is an object
  // literal, so `/#constructor`, `/#toString` and `/#__proto__` would otherwise
  // resolve to inherited members and hand a function to router.replace().
  // That happens to be benign in Next 15.5.22, but it is an accident rather
  // than a design and the next upgrade owns whether it stays that way.
  useEffect(() => {
    const key = window.location.hash.replace("#", "");
    if (!Object.hasOwn(LEGACY_HASH_ROUTES, key)) return;
    router.replace(LEGACY_HASH_ROUTES[key]);
  }, [router]);

  return (
    <main className="grain relative h-full w-full overflow-hidden">
      {/* ── Persistent desktop stage ─────────────────────────────
          Dark side gutters + an illuminated centre "panel" so the
          mobile-first column reads as a boutique app on wide screens. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #55101f, #470d1a 70%, #3d0b16)",
        }}
      />
      <div
        aria-hidden
        className="stage-bg fixed inset-y-0 left-1/2 -z-10 w-full max-w-[var(--stage-max)] -translate-x-1/2 lg:border-x lg:border-[var(--hairline)]"
        style={{ boxShadow: "0 0 140px 20px rgba(15,3,7,0.6)" }}
      />
      {/* Gutter flourishes. Gated at 2xl, not lg: once the stage is 1216px wide
          the side gutters are too narrow to hold them until ~1536px. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden 2xl:block"
      >
        <span
          className="absolute right-[8%] top-[18%] h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,91,69,0.12), transparent 70%)",
          }}
        />
        <p className="absolute right-[4%] top-1/2 -translate-y-1/2 rotate-90 font-display text-sm italic tracking-[0.3em] text-[rgba(233,173,190,0.28)]">
          Handcrafted in Bahrain
        </p>
      </div>

      <Header />

      {/* Base screens swap instantly with an entrance animation only.
          No blocking exit transition — taps never wedge mid-transition. */}
      {children}

      {/* Bottom scrim — fades page content into the burgundy behind the nav so
          the floating bar reads as grounded instead of clashing with content
          that scrolls up underneath it. Sits above screens (z-10), below nav. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-32 lg:hidden"
        style={{
          background:
            "linear-gradient(to top, #480d1a 16%, rgba(72,13,26,0.82) 44%, rgba(72,13,26,0) 100%)",
        }}
      />

      <StickyNav />

      {/* Overlays */}
      <AnimatePresence>
        {overlay?.type === "menu" && (
          <MobileMenu key="menu" onClose={closeOverlay} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay?.type === "about-drawer" && (
          <AboutDrawer
            key="drawer"
            drawerId={overlay.drawerId}
            onClose={closeOverlay}
          />
        )}
      </AnimatePresence>

      {/* Launch announcement — owns its own AnimatePresence and trigger. */}
      <GiftingPromo />
    </main>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <NavProvider>
        <Shell>{children}</Shell>
      </NavProvider>
    </LangProvider>
  );
}
