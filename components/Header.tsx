"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import TransitionLink from "./TransitionLink";
import LangToggle from "./ui/LangToggle";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useGsapScope } from "@/lib/useGsapScope";
import { useNav } from "@/lib/store";
import { ROUTES } from "@/lib/routes";
import { useT } from "@/lib/i18n";

/**
 * Site chrome: wordmark, the travelling nav cluster, and the menu button.
 *
 * The cluster does not stick to the top. Once you leave the hero it slides all
 * the way down and floats above the bottom edge — lifted from the reference,
 * where the nav migrates rather than docking. On this site it also lands where
 * the old bottom bar used to live, so the phone ergonomics are unchanged.
 *
 * Everything in here rides on cream pills rather than inheriting slab ink. The
 * chrome is fixed over sections that change colour underneath it, so giving it
 * its own opaque ground is what keeps it legible without measuring what is
 * behind it on every frame.
 */
export default function Header() {
  const pathname = usePathname();
  const t = useT();
  const { openMenu } = useNav();

  const items = [
    { href: ROUTES.bars, label: t.menu.items.bars },
    { href: ROUTES.nutrition, label: t.menu.items.nutrition },
    { href: ROUTES.ordering, label: t.menu.items.ordering },
  ];

  const ref = useGsapScope<HTMLDivElement>((scope) => {
    const cluster = scope.querySelector<HTMLElement>("[data-nav-cluster]");
    if (!cluster || prefersReducedMotion()) return;

    gsap.to(cluster, {
      // Measured in a function so a resize or a refresh recomputes the
      // landing point instead of freezing the first viewport height.
      y: () =>
        window.innerHeight -
        cluster.offsetHeight -
        parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5,
      duration: 0.8,
      ease: "energy",
      scrollTrigger: {
        start: 220,
        end: "max",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={ref}>
      {/* Wordmark — stays put at the top. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-gutter pt-gutter">
        <TransitionLink
          href={ROUTES.home}
          aria-label={t.header.home}
          className="pointer-events-auto chrome-pill inline-flex items-center rounded-full px-4 py-2.5"
        >
          <span className="font-display text-lg font-black leading-none tracking-tight text-brand-burgundy">
            Candy
          </span>
          <span className="ml-1.5 font-couture text-lg italic leading-none text-brand-coral">
            Couture
          </span>
        </TransitionLink>

        <div className="pointer-events-auto flex items-center gap-2">
          <LangToggle />
          <button
            type="button"
            onClick={openMenu}
            aria-label={t.header.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-burgundy text-brand-cream shadow-drop transition-transform duration-300 ease-couture hover:scale-105"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Travelling cluster. Fixed at the top, animated to the bottom. */}
      <nav
        aria-label="Primary"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-gutter pt-[4.75rem] lg:pt-gutter"
      >
        <div
          data-nav-cluster
          className="pointer-events-auto chrome-pill flex items-center gap-1 rounded-full p-1.5 will-change-transform"
        >
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.82rem] font-bold leading-none transition-colors duration-300 ease-couture ${
                  active
                    ? "bg-brand-burgundy text-brand-cream"
                    : "text-brand-burgundy hover:bg-brand-pink"
                }`}
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
