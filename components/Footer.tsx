"use client";

import { useT, fill } from "@/lib/i18n";

export default function Footer() {
  const t = useT();
  return (
    <footer className="mt-8 border-t border-[var(--hairline)] pt-5 text-center">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[rgba(227,210,194,0.42)]">
        {fill(t.footer.copyright, { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
