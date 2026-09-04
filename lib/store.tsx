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

export type AboutDrawerId = "about-us" | "philosophy";

type Overlay =
  | { type: "menu" }
  | { type: "about-drawer"; drawerId: AboutDrawerId }
  // The one-time launch announcement (components/GiftingPopup.tsx). Lives in
  // the store so the shared scroll lock applies and it can never stack on top
  // of the menu or a drawer.
  | { type: "promo" }
  | null;

interface Nav {
  overlay: Overlay;
  openMenu: () => void;
  openAboutDrawer: (drawerId: AboutDrawerId) => void;
  openPromo: () => void;
  closeOverlay: () => void;
}

const NavContext = createContext<Nav | null>(null);

/**
 * Overlay state only. Navigation moved to real App Router routes in Tier 2 —
 * this no longer knows which screen is showing, and nothing here reads the URL.
 *
 * Product detail is a real page (/bars/<slug>) as of Task 4, so there is no
 * product overlay: only the menu and the About drawers remain.
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
  const openAboutDrawer = useCallback(
    (drawerId: AboutDrawerId) => setOverlay({ type: "about-drawer", drawerId }),
    [],
  );
  // Only opens over nothing: if the visitor already has the menu or a drawer
  // up, the announcement must not replace it.
  const openPromo = useCallback(
    () => setOverlay((prev) => (prev === null ? { type: "promo" } : prev)),
    [],
  );
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const value = useMemo<Nav>(
    () => ({
      overlay,
      openMenu,
      openAboutDrawer,
      openPromo,
      closeOverlay,
    }),
    [overlay, openMenu, openAboutDrawer, openPromo, closeOverlay],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
