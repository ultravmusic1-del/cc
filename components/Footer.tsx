"use client";

import { useContent, useT, fill } from "@/lib/i18n";

export default function Footer() {
  const c = useContent();
  const t = useT();
  return (
    <footer className="mt-8 border-t border-[var(--hairline)] pt-5 text-center">
      <p className="font-display text-sm italic text-[rgba(233,173,190,0.75)]">
        {c.brand.tagline}
      </p>
      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-[rgba(227,210,194,0.42)]">
        {fill(t.footer.copyright, { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
