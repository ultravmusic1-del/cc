"use client";

import { Instagram } from "lucide-react";
import TransitionLink from "./TransitionLink";
import WhatsAppButton from "./ui/WhatsAppButton";
import Marquee from "./motion/Marquee";
import { ROUTES, productPath } from "@/lib/routes";
import { CONTACT } from "@/lib/content";
import { useContent, useT } from "@/lib/i18n";

/**
 * Footer, and the site's internal-linking backstop.
 *
 * Every route is linked from here in server-rendered HTML. That matters: the
 * menu is the only other place /wholesale and /about are reachable, and it
 * mounts on open, so a crawler never sees those links. Both pages were
 * effectively orphaned — in the sitemap, but with no inbound internal links.
 * Rendering the full set on every page is the fix.
 */
export default function Footer() {
  const c = useContent();
  const t = useT();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t.menu.items.bars,
      links: [
        { href: ROUTES.bars, label: t.menu.items.bars },
        { href: productPath("cookie"), label: c.products.cookie.name },
        { href: productPath("protein"), label: c.products.protein.name },
        { href: ROUTES.nutrition, label: t.menu.items.nutrition },
      ],
    },
    {
      title: t.menu.items.ordering,
      links: [
        { href: ROUTES.ordering, label: t.menu.items.ordering },
        { href: ROUTES.wholesale, label: t.menu.items.wholesale },
      ],
    },
    {
      title: t.menu.items.about,
      links: [
        { href: ROUTES.about, label: t.menu.items.about },
        { href: ROUTES.home, label: t.menu.items.home },
      ],
    },
  ];

  return (
    <footer className="slab slab--burgundy relative overflow-hidden">
      <Marquee
        items={[c.brand.tagline, c.brand.location, "Candy Couture"]}
        className="border-y border-[var(--slab-rule)] py-5 text-[var(--slab-accent)]"
        speed={30}
      />

      {/* Extra bottom padding: the nav cluster floats ~1.5rem above the
          viewport bottom for the whole page, so the last thing on the page
          needs clearance or it sits underneath the pills. */}
      <div className="slab__inner pb-[7rem]">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-3xl font-black leading-none tracking-tight">
              Candy
              <span className="ml-2 font-couture italic text-[var(--slab-accent)]">
                Couture
              </span>
            </p>
            <p className="mt-4 max-w-[26ch] text-[0.95rem] leading-relaxed text-[var(--slab-ink-soft)]">
              {c.brand.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <WhatsAppButton />
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Instagram — ${CONTACT.instagram}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--slab-rule)] transition-colors duration-300 ease-couture hover:bg-[var(--slab-ink)] hover:text-[var(--slab-bg)]"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow">{col.title}</p>
              {/* Links are inline-block with vertical padding so each is ~36px
                  tall. They measured 20px, under the 24px WCAG 2.5.8 minimum.
                  36 rather than 44 here: this is a dense utility list, and a
                  column of eight 44px rows makes the footer enormous on a
                  phone. Primary nav and CTAs do get the full 44. */}
              <ul className="mt-2 space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <TransitionLink
                      href={link.href}
                      className="inline-block py-2 text-[0.95rem] leading-snug transition-colors duration-300 ease-couture hover:text-[var(--slab-accent)]"
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--slab-rule)] pt-6 text-[0.8rem] text-[var(--slab-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Candy Couture · {c.brand.location}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-block py-2 transition-colors duration-300 ease-couture hover:text-[var(--slab-accent)]"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
