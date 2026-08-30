"use client";

import { useLang } from "@/lib/i18n";

/**
 * English / Arabic switch.
 *
 * Each label is written in its own script — "AR" in Arabic, "EN" in Latin — so
 * the button reads to a speaker of the language it switches *to*, which is the
 * only person who needs it.
 */
export default function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <button
      type="button"
      onClick={toggle}
      lang={lang === "en" ? "ar" : "en"}
      aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className="inline-flex h-11 min-w-11 items-center justify-center chrome-pill rounded-full px-3.5 text-[0.8rem] font-bold leading-none text-brand-burgundy transition-transform duration-300 ease-couture hover:scale-105"
    >
      {lang === "en" ? "ع" : "EN"}
    </button>
  );
}
