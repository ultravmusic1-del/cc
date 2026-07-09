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
      // Scroll-to-top is handled by the view-change effect in App (instant,
      // covers every nav path); doing it here too would race a smooth scroll.
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
