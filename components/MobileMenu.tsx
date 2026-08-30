"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import TransitionLink from "./TransitionLink";
import WhatsAppButton from "./ui/WhatsAppButton";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";
import { ROUTES, productPath } from "@/lib/routes";
import { CONTACT } from "@/lib/content";
import { useContent, useT, useLang } from "@/lib/i18n";

/**
 * Full-screen menu.
 *
 * Focus is trapped while it is open and returned to whatever opened it on
 * close, because this covers the whole page — a keyboard user tabbing past the
 * last link would otherwise land on the site behind it with no way back.
 */
export default function MobileMenu({ onClose }: { onClose: () => void }) {
  const c = useContent();
  const t = useT();
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const links = [
    { href: ROUTES.home, label: t.menu.items.home },
    { href: ROUTES.bars, label: t.menu.items.bars },
    { href: productPath("cookie"), label: c.products.cookie.name },
    { href: productPath("protein"), label: c.products.protein.name },
    { href: ROUTES.nutrition, label: t.menu.items.nutrition },
    { href: ROUTES.ordering, label: t.menu.items.ordering },
    { href: ROUTES.wholesale, label: t.menu.items.wholesale },
    { href: ROUTES.about, label: t.menu.items.about },
  ];

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (!panel) return;

    registerGsap();

    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.from(panel, { yPercent: -100, duration: 0.7, ease: "couture" });
      gsap.from("[data-menu-item]", {
        opacity: 0,
        y: 26,
        duration: 0.6,
        stagger: 0.045,
        delay: 0.18,
        ease: "couture",
      });
    }, panel);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      ctx.revert();
      openerRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.menu.aria}
      ref={panelRef}
      className="slab slab--burgundy fixed inset-0 z-[1200] overflow-y-auto"
    >
      <div className="flex min-h-full flex-col px-gutter py-gutter">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-black leading-none tracking-tight">
            Candy
            <span className="ml-1.5 font-couture italic text-[var(--slab-accent)]">
              Couture
            </span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.menu.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream text-brand-burgundy transition-transform duration-300 ease-couture hover:scale-105"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <nav aria-label={t.menu.aria} className="mt-auto pt-16">
          <ul>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} data-menu-item>
                  <TransitionLink
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`block py-2 font-display text-[clamp(2rem,8vw,4rem)] font-black leading-[1.05] tracking-tight transition-colors duration-300 ease-couture hover:text-[var(--slab-accent)] ${
                      active ? "text-[var(--slab-accent)]" : ""
                    }`}
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          data-menu-item
          className="mt-auto flex flex-col gap-6 pt-14 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-col gap-3">
            <span className="eyebrow">{t.menu.language}</span>
            <div className="flex gap-2">
              {(["en", "ar"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`rounded-full px-5 py-2.5 text-[0.85rem] font-bold leading-none transition-colors duration-300 ease-couture ${
                    lang === l
                      ? "bg-brand-cream text-brand-burgundy"
                      : "border border-[var(--slab-rule)]"
                  }`}
                >
                  {l === "en" ? t.menu.langEnglish : t.menu.langArabic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <WhatsAppButton />
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-block py-2 text-[0.85rem] text-[var(--slab-ink-soft)] transition-colors duration-300 ease-couture hover:text-[var(--slab-accent)]"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
