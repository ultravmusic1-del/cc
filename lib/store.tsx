"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductId } from "./content";
import { scrollToTop } from "./scroll";

const VIEWS: ViewId[] = [
  "home",
  "bars",
  "nutrition",
  "about",
  "ordering",
  "wholesale",
];

function viewFromHash(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace("#", "") as ViewId;
  return VIEWS.includes(h) ? h : "home";
}

export type ViewId =
  | "home"
  | "bars"
  | "nutrition"
  | "about"
  | "ordering"
  | "wholesale";

export type AboutDrawerId = "about-us" | "philosophy" | "gifting";

type Overlay =
  | { type: "menu" }
  | { type: "product"; productId: ProductId }
  | { type: "about-drawer"; drawerId: AboutDrawerId }
  | null;

interface Nav {
  view: ViewId;
  overlay: Overlay;
  goTo: (view: ViewId) => void;
  openMenu: () => void;
  openProduct: (productId: ProductId) => void;
  openAboutDrawer: (drawerId: AboutDrawerId) => void;
  closeOverlay: () => void;
}

const NavContext = createContext<Nav | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);

  // Sync view <-> URL hash so the browser back button works and views
  // are deep-linkable. This is what makes the app feel like real pages.
  useEffect(() => {
    // Own scroll position ourselves — stop the browser (esp. iOS Safari)
    // from restoring a scroll offset on hash navigation.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    setView(viewFromHash());
    const onHash = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goTo = useCallback((next: ViewId) => {
    setOverlay(null);
    setView(next);
    if (typeof window !== "undefined") {
      if (next === "home") {
        history.replaceState(null, "", window.location.pathname);
      } else if (window.location.hash !== `#${next}`) {
        window.location.hash = next;
      }
      // Reset inside the tap gesture — iOS Safari honors gesture-context
      // scrolls far more reliably than a later effect. The App view-change
      // effect re-asserts (rAF + timeout) and covers hash/back navigation.
      scrollToTop();
    }
  }, []);

  const openMenu = useCallback(() => setOverlay({ type: "menu" }), []);
  const openProduct = useCallback(
    (productId: ProductId) => setOverlay({ type: "product", productId }),
    [],
  );
  const openAboutDrawer = useCallback(
    (drawerId: AboutDrawerId) => setOverlay({ type: "about-drawer", drawerId }),
    [],
  );
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const value = useMemo<Nav>(
    () => ({
      view,
      overlay,
      goTo,
      openMenu,
      openProduct,
      openAboutDrawer,
      closeOverlay,
    }),
    [view, overlay, goTo, openMenu, openProduct, openAboutDrawer, closeOverlay],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
