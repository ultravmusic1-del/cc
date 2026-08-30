"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavProvider, useNav } from "@/lib/store";
import { LangProvider, useLang, useT } from "@/lib/i18n";
import { LEGACY_HASH_ROUTES } from "@/lib/routes";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { CurtainProvider } from "./motion/Curtain";
import SmoothScroll from "./motion/SmoothScroll";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";

function Shell({ children }: { children: ReactNode }) {
  const { overlay, closeOverlay } = useNav();
  const { lang } = useLang();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();

  // Freeze the page behind an open overlay. The document scrolls normally now,
  // so this is Lenis's job rather than a per-screen overflow toggle.
  useEffect(() => {
    const lenis = window.__lenis;
    if (overlay) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay]);

  // Switching to Arabic re-flows every heading and changes the page height,
  // which leaves every ScrollTrigger measuring stale positions.
  useEffect(() => {
    registerGsap();
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lang, pathname]);

  // Links shared before the site moved to real routes used #bars, #nutrition
  // and friends. Object.hasOwn rather than a bare lookup so that /#constructor
  // and /#__proto__ cannot resolve to an inherited member and hand a function
  // to router.replace().
  useEffect(() => {
    const key = window.location.hash.replace("#", "");
    if (!Object.hasOwn(LEGACY_HASH_ROUTES, key)) return;
    router.replace(LEGACY_HASH_ROUTES[key]);
  }, [router]);

  return (
    <>
      <SmoothScroll />
      <a href="#main" className="skip-link">
        {t.header.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="grain relative">
        {children}
      </main>
      <Footer />
      {overlay?.type === "menu" && <MobileMenu onClose={closeOverlay} />}
    </>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <NavProvider>
        <CurtainProvider>
          <Shell>{children}</Shell>
        </CurtainProvider>
      </NavProvider>
    </LangProvider>
  );
}
