"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import {
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Sprout,
  Heart,
  Lock,
  Mail,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Logo from "./Logo";
import { useNav, type ViewId, type AboutDrawerId } from "@/lib/store";
import { CONTACT } from "@/lib/content";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { useT, useLang } from "@/lib/i18n";

type MenuLevel = "main" | "about" | "contact";

const mainItems: {
  id: ViewId | "about-expand" | "contact-expand";
  key: "home" | "bars" | "nutrition" | "about" | "ordering" | "wholesale" | "contact";
}[] = [
  { id: "home", key: "home" },
  { id: "bars", key: "bars" },
  { id: "nutrition", key: "nutrition" },
  { id: "about-expand", key: "about" },
  { id: "ordering", key: "ordering" },
  { id: "wholesale", key: "wholesale" },
  { id: "contact-expand", key: "contact" },
];

const contactItems: {
  key: "email" | "instagram" | "whatsapp";
  value: string;
  href: string;
  icon: typeof Mail;
}[] = [
  {
    key: "email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: Mail,
  },
  {
    key: "instagram",
    value: CONTACT.instagram,
    href: CONTACT.instagramUrl,
    icon: Instagram,
  },
  {
    key: "whatsapp",
    value: CONTACT.whatsapp,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: MessageCircle,
  },
];

const aboutItems: {
  id: AboutDrawerId | "soon";
  key: "aboutUs" | "philosophy" | "gifting" | "testimonials";
  icon: typeof Leaf;
  soon?: boolean;
}[] = [
  { id: "about-us", key: "aboutUs", icon: Leaf },
  { id: "philosophy", key: "philosophy", icon: Sprout },
  { id: "gifting", key: "gifting", icon: Heart },
  { id: "soon", key: "testimonials", icon: Lock, soon: true },
];

const listStagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const rowRise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  const { goTo, openAboutDrawer } = useNav();
  const t = useT();
  const { lang, setLang } = useLang();
  const [level, setLevel] = useState<MenuLevel>("main");
  // Once dismissed, stop intercepting clicks immediately — even if the exit
  // animation stalls (e.g. RAF-throttled), so it can never wedge the page.
  const isPresent = useIsPresent();

  // Scroll lock is handled centrally in App's Shell (keyed on any overlay
  // being open). This effect only wires up Escape-to-close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const openDrawer = (id: AboutDrawerId) => {
    goTo("about");
    openAboutDrawer(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{ pointerEvents: isPresent ? undefined : "none" }}
      className="stage-bg fixed inset-0 z-[60] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t.menu.aria}
    >
      <span
        aria-hidden
        className="c-watermark absolute left-1/2 top-16 -translate-x-1/2 select-none font-display text-[16rem]"
      >
        C
      </span>

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe">
        <div className="flex h-16 items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={level}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => (level !== "main" ? setLevel("main") : onClose())}
              aria-label={level !== "main" ? t.menu.back : t.menu.close}
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5"
            >
              {level !== "main" ? (
                <ArrowLeft className="h-6 w-6 rtl:-scale-x-100" strokeWidth={1.5} />
              ) : (
                <X className="h-6 w-6" strokeWidth={1.5} />
              )}
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="translate-y-[2px]">
          <Logo size="sm" />
        </div>

        <div className="h-10 w-10" />
      </div>

      <div className="relative z-10 mx-4 mt-1 hairline" />

      {/* levels */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {level === "main" && (
            <motion.nav
              key="main"
              variants={listStagger}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }}
              exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
              className="flex flex-col px-6 pt-6"
            >
              {mainItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={rowRise}
                  onClick={() => {
                    if (item.id === "about-expand") setLevel("about");
                    else if (item.id === "contact-expand") setLevel("contact");
                    else goTo(item.id as ViewId);
                  }}
                  className="group flex items-center justify-between border-b border-[var(--hairline)] py-5 text-start"
                >
                  <span className="font-display text-[2.1rem] font-medium leading-none text-cream transition-colors group-hover:text-pink">
                    {t.menu.items[item.key]}
                  </span>
                  <ArrowRight className="h-6 w-6 text-coral transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                </motion.button>
              ))}
            </motion.nav>
          )}

          {level === "about" && (
            <motion.nav
              key="about"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }}
              exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
              className="flex flex-col px-6 pt-6"
            >
              <motion.p
                variants={rowRise}
                initial="initial"
                animate="animate"
                className="eyebrow mb-2 text-[rgba(233,173,190,0.7)]"
              >
                {t.menu.aboutHeader}
              </motion.p>
              {aboutItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={rowRise}
                  disabled={item.soon}
                  onClick={() =>
                    !item.soon && openDrawer(item.id as AboutDrawerId)
                  }
                  className={`group flex items-center gap-4 border-b border-[var(--hairline)] py-4 text-start ${
                    item.soon ? "opacity-55" : ""
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(159,149,54,0.4)]">
                    <item.icon className="h-5 w-5 text-olive" strokeWidth={1.5} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-heading text-[1.35rem] font-medium text-cream">
                      {t.menu.about[item.key]}
                    </span>
                    {item.soon && (
                      <span className="text-[0.72rem] text-[rgba(227,210,194,0.55)]">
                        {t.menu.comingSoon}
                      </span>
                    )}
                  </span>
                  {!item.soon && (
                    <ArrowRight className="h-5 w-5 text-coral transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                  )}
                </motion.button>
              ))}
            </motion.nav>
          )}

          {level === "contact" && (
            <motion.nav
              key="contact"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }}
              exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
              className="flex flex-col px-6 pt-6"
            >
              <motion.p
                variants={rowRise}
                initial="initial"
                animate="animate"
                className="eyebrow mb-2 text-[rgba(233,173,190,0.7)]"
              >
                {t.menu.contactHeader}
              </motion.p>
              {contactItems.map((item) => (
                <motion.a
                  key={item.key}
                  variants={rowRise}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 border-b border-[var(--hairline)] py-4 text-start"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(159,149,54,0.4)]">
                    <item.icon className="h-5 w-5 text-olive" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[rgba(233,173,190,0.7)]">
                      {t.menu.contact[item.key]}
                    </span>
                    <span className="block truncate font-heading text-[1.05rem] font-medium text-cream" dir="ltr">
                      {item.value}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-coral transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* language toggle */}
      <div className="relative z-10 mx-6 mb-3">
        <p className="eyebrow mb-2 text-center text-[rgba(233,173,190,0.6)]">
          {t.menu.language}
        </p>
        <div className="flex gap-1 rounded-full border border-[var(--hairline)] p-1">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`flex-1 rounded-full py-2 text-[0.82rem] font-semibold transition-colors ${
                lang === l
                  ? "btn-coral text-cream"
                  : "text-[rgba(227,210,194,0.7)] hover:text-cream"
              }`}
            >
              {l === "en" ? t.menu.langEnglish : t.menu.langArabic}
            </button>
          ))}
        </div>
      </div>

      <p className="relative z-10 pb-8 pt-1 text-center text-[0.72rem] uppercase tracking-[0.24em] text-[rgba(227,210,194,0.45)] pb-safe">
        {t.menu.tooGood}
      </p>
    </motion.div>
  );
}
