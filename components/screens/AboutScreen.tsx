"use client";

import { motion } from "framer-motion";
import { Leaf, Sprout, Heart, ArrowRight, Lock } from "lucide-react";
import ScreenShell from "../ScreenShell";
import Footer from "../Footer";
import { useNav, type AboutDrawerId } from "@/lib/store";
import { useContent, useT } from "@/lib/i18n";

export default function AboutScreen() {
  const { openAboutDrawer } = useNav();
  const c = useContent();
  const t = useT();

  const cards: {
    id: AboutDrawerId;
    title: string;
    note: string;
    icon: typeof Leaf;
  }[] = [
    { id: "about-us", title: t.about.aboutUsT, note: t.about.aboutUsN, icon: Leaf },
    {
      id: "philosophy",
      title: t.about.philosophyT,
      note: t.about.philosophyN,
      icon: Sprout,
    },
    { id: "gifting", title: t.about.giftingT, note: t.about.giftingN, icon: Heart },
  ];

  return (
    <ScreenShell>
      <header>
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">{t.about.eyebrow}</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          {t.about.title}
        </h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-[rgba(227,210,194,0.78)]">
          {c.brand.storyLede}
        </p>
      </header>

      <div className="hairline my-6" />

      <div className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openAboutDrawer(card.id)}
            className="glass-card flex items-center gap-4 rounded-2xl px-4 py-4 text-start transition-colors hover:border-[rgba(236,91,69,0.5)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(159,149,54,0.45)]">
              <card.icon className="h-5 w-5 text-olive" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[1.05rem] font-semibold text-cream">
                {card.title}
              </span>
              <span className="block text-[0.76rem] text-[rgba(227,210,194,0.62)]">
                {card.note}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-coral rtl:-scale-x-100" />
          </motion.button>
        ))}

        {/* Coming soon */}
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--hairline)] px-4 py-4 opacity-70">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)]">
            <Lock className="h-4 w-4 text-[rgba(233,173,190,0.6)]" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-[1.05rem] font-semibold text-[rgba(227,210,194,0.7)]">
              {t.about.testimonialsT}
            </span>
            <span className="block text-[0.76rem] text-[rgba(227,210,194,0.5)]">
              {t.about.comingSoon}
            </span>
          </span>
        </div>
      </div>

      <Footer />
    </ScreenShell>
  );
}
