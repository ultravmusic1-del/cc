"use client";

import { BRAND } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--hairline)] pt-5 text-center">
      <p className="font-display text-sm italic text-[rgba(233,173,190,0.75)]">
        {BRAND.tagline}
      </p>
      <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-[rgba(227,210,194,0.42)]">
        © {new Date().getFullYear()} Candy Couture · Bahrain
      </p>
    </footer>
  );
}
