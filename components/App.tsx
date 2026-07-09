"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { NavProvider, useNav } from "@/lib/store";
import { LangProvider } from "@/lib/i18n";
import Header from "./Header";
import StickyNav from "./StickyNav";
import MobileMenu from "./MobileMenu";
import ProductDetailModal from "./ProductDetailModal";
import AboutDrawer from "./AboutDrawer";
import HomeScreen from "./screens/HomeScreen";
import BarsScreen from "./screens/BarsScreen";
import NutritionScreen from "./screens/NutritionScreen";
import AboutScreen from "./screens/AboutScreen";
import OrderingScreen from "./screens/OrderingScreen";
import WholesaleScreen from "./screens/WholesaleScreen";
import { useContent } from "@/lib/i18n";

function Shell() {
  const { view, overlay, closeOverlay } = useNav();
  const c = useContent();

  // Single source of truth for the body scroll lock. Locking is keyed only on
  // "is ANY overlay open", and always restores to the real default ("") — so
  // overlapping overlays (e.g. the menu exit-animating while a drawer opens)
  // can never hand a stale "hidden" value forward and wedge the page. Each
  // overlay used to save/restore body.style.overflow itself, which leaked a
  // permanent scroll lock and made the whole app unclickable.
  const hasOverlay = overlay !== null;
  useEffect(() => {
    document.body.style.overflow = hasOverlay ? "hidden" : "";
  }, [hasOverlay]);

  // Every view is its own "page" — reset scroll to the top whenever the view
  // changes, no matter how (sticky nav, menu, header, back button/hash). Runs
  // after the new screen renders, and writes scrollTop directly so it's instant
  // even with `scroll-behavior: smooth` set globally.
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [view]);

  return (
    <main className="grain relative min-h-[100dvh] w-full">
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
        className="stage-bg fixed inset-y-0 left-1/2 -z-10 w-full max-w-[540px] -translate-x-1/2 lg:border-x lg:border-[var(--hairline)]"
        style={{ boxShadow: "0 0 140px 20px rgba(15,3,7,0.6)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden lg:block"
      >
        <span className="c-watermark absolute left-[3%] top-1/2 -translate-y-1/2 select-none font-display text-[40rem]">
          C
        </span>
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
      {view === "home" && <HomeScreen key="home" />}
      {view === "bars" && <BarsScreen key="bars" />}
      {view === "nutrition" && <NutritionScreen key="nutrition" />}
      {view === "about" && <AboutScreen key="about" />}
      {view === "ordering" && <OrderingScreen key="ordering" />}
      {view === "wholesale" && <WholesaleScreen key="wholesale" />}

      {/* Bottom scrim — fades page content into the burgundy behind the nav so
          the floating bar reads as grounded instead of clashing with content
          that scrolls up underneath it. Sits above screens (z-10), below nav. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-32"
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
        {overlay?.type === "product" && (
          <ProductDetailModal
            key="product"
            product={c.products[overlay.productId]}
            onClose={closeOverlay}
          />
        )}
        {overlay?.type === "about-drawer" && (
          <AboutDrawer
            key="drawer"
            drawerId={overlay.drawerId}
            onClose={closeOverlay}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <LangProvider>
      <NavProvider>
        <Shell />
      </NavProvider>
    </LangProvider>
  );
}
