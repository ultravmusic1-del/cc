"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Leaf, Sprout, Heart, Lock } from "lucide-react";
import Logo from "./Logo";
import { useNav, type ViewId, type AboutDrawerId } from "@/lib/store";

const mainItems: { id: ViewId | "about-expand"; label: string }[] = [
  { id: "bars", label: "Bars" },
  { id: "nutrition", label: "Nutrition" },
  { id: "about-expand", label: "About" },
  { id: "ordering", label: "Ordering" },
  { id: "wholesale", label: "Wholesale" },
];

const aboutItems: {
  id: AboutDrawerId | "soon";
  label: string;
  icon: typeof Leaf;
  soon?: boolean;
}[] = [
  { id: "about-us", label: "About Us", icon: Leaf },
  { id: "philosophy", label: "Product Philosophy", icon: Sprout },
  { id: "gifting", label: "Gifting", icon: Heart },
  { id: "soon", label: "Brand Testimonials", icon: Lock, soon: true },
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
  const [level, setLevel] = useState<"main" | "about">("main");

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
      className="stage-bg fixed inset-0 z-[60] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
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
              onClick={() => (level === "about" ? setLevel("main") : onClose())}
              aria-label={level === "about" ? "Back" : "Close menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/5"
            >
              {level === "about" ? (
                <ArrowLeft className="h-6 w-6" strokeWidth={1.5} />
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
          {level === "main" ? (
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
                  onClick={() =>
                    item.id === "about-expand"
                      ? setLevel("about")
                      : goTo(item.id as ViewId)
                  }
                  className="group flex items-center justify-between border-b border-[var(--hairline)] py-5 text-left"
                >
                  <span className="font-display text-[2.1rem] font-medium leading-none text-cream transition-colors group-hover:text-pink">
                    {item.label}
                  </span>
                  <ArrowRight className="h-6 w-6 text-coral transition-transform group-hover:translate-x-1" />
                </motion.button>
              ))}
            </motion.nav>
          ) : (
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
                About
              </motion.p>
              {aboutItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={rowRise}
                  disabled={item.soon}
                  onClick={() =>
                    !item.soon && openDrawer(item.id as AboutDrawerId)
                  }
                  className={`group flex items-center gap-4 border-b border-[var(--hairline)] py-4 text-left ${
                    item.soon ? "opacity-55" : ""
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(159,149,54,0.4)]">
                    <item.icon className="h-5 w-5 text-olive" strokeWidth={1.5} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-heading text-[1.35rem] font-medium text-cream">
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="text-[0.72rem] text-[rgba(227,210,194,0.55)]">
                        Coming soon
                      </span>
                    )}
                  </span>
                  {!item.soon && (
                    <ArrowRight className="h-5 w-5 text-coral transition-transform group-hover:translate-x-1" />
                  )}
                </motion.button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <p className="relative z-10 pb-8 pt-4 text-center text-[0.72rem] uppercase tracking-[0.24em] text-[rgba(227,210,194,0.45)] pb-safe">
        Handcrafted in Bahrain
      </p>
    </motion.div>
  );
}
