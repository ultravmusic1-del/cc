"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent, useT, fill } from "@/lib/i18n";
import { ROUTES, productPath } from "@/lib/routes";

/**
 * Site footer: a plain link to every route, rendered on every screen.
 *
 * This is the crawlable path to /wholesale and /about. The menu links them
 * too, but the menu only exists in the DOM once opened, so crawlers never see
 * it — without this footer /wholesale had no inbound internal links at all.
 */
export default function Footer({ className = "" }: { className?: string }) {
  const t = useT();
  const c = useContent();
  const pathname = usePathname();
  const items = t.menu.items;

  const links = [
    { href: ROUTES.home, label: items.home },
    { href: ROUTES.bars, label: items.bars },
    { href: productPath("cookie"), label: c.products.cookie.name },
    { href: productPath("protein"), label: c.products.protein.name },
    { href: ROUTES.nutrition, label: items.nutrition },
    { href: ROUTES.gifting, label: items.gifting },
    { href: ROUTES.ordering, label: items.ordering },
    { href: ROUTES.wholesale, label: items.wholesale },
    { href: ROUTES.about, label: items.about },
  ];

  return (
    <footer
      className={`mt-8 border-t border-[var(--hairline)] pt-5 text-center ${className}`}
    >
      <nav aria-label={t.footer.nav}>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className="text-[0.72rem] font-semibold tracking-wide text-[rgba(227,210,194,0.62)] transition-colors hover:text-cream aria-[current=page]:text-coral"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.2em] text-[rgba(227,210,194,0.42)]">
        {fill(t.footer.copyright, { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
