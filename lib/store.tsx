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

export type AboutDrawerId = "about-us" | "philosophy" | "gifting";

type Overlay =
  | { type: "menu" }
  | { type: "product"; productId: ProductId }
  | { type: "about-drawer"; drawerId: AboutDrawerId }
  | null;

interface Nav {
  overlay: Overlay;
  openMenu: () => void;
  openProduct: (productId: ProductId) => void;
  openAboutDrawer: (drawerId: AboutDrawerId) => void;
  closeOverlay: () => void;
}

const NavContext = createContext<Nav | null>(null);

/**
 * Overlay state only. Navigation moved to real App Router routes in Tier 2 —
 * this no longer knows which screen is showing, and nothing here reads the URL.
 *
 * `openProduct` and the `product` overlay survive on borrowed time: the product
 * detail modal is replaced by /bars/<slug> pages in Task 4, which deletes both.
 */
export function NavProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);

  // Own scroll position ourselves — stop the browser (esp. iOS Safari) from
  // restoring a scroll offset on navigation. Belongs to the app-shell scroll
  // model (body never scrolls; each screen is its own scroll container), not
  // to the router, so it stays here even though routing left.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
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
      overlay,
      openMenu,
      openProduct,
      openAboutDrawer,
      closeOverlay,
    }),
    [overlay, openMenu, openProduct, openAboutDrawer, closeOverlay],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
