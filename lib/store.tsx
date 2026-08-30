"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AboutDrawerId = "about-us" | "philosophy" | "gifting";

type Overlay =
  | { type: "menu" }
  | { type: "about-drawer"; drawerId: AboutDrawerId }
  | null;

interface Nav {
  overlay: Overlay;
  openMenu: () => void;
  openAboutDrawer: (drawerId: AboutDrawerId) => void;
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

  const openMenu = useCallback(() => setOverlay({ type: "menu" }), []);
  const openAboutDrawer = useCallback(
    (drawerId: AboutDrawerId) => setOverlay({ type: "about-drawer", drawerId }),
    [],
  );
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const value = useMemo<Nav>(
    () => ({
      overlay,
      openMenu,
      openAboutDrawer,
      closeOverlay,
    }),
    [overlay, openMenu, openAboutDrawer, closeOverlay],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
