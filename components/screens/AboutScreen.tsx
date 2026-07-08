"use client";

import { motion } from "framer-motion";
import { Leaf, Sprout, Heart, ArrowRight, Lock } from "lucide-react";
import ScreenShell from "../ScreenShell";
import Footer from "../Footer";
import { useNav, type AboutDrawerId } from "@/lib/store";
import { BRAND } from "@/lib/content";

const cards: {
  id: AboutDrawerId;
  title: string;
  note: string;
  icon: typeof Leaf;
}[] = [
  { id: "about-us", title: "About Us", note: "Why we started Candy Couture", icon: Leaf },
  { id: "philosophy", title: "Product Philosophy", note: "Real ingredients, no shortcuts", icon: Sprout },
  { id: "gifting", title: "Gifting & Wholesale", note: "Boxes, bulk & business orders", icon: Heart },
];

export default function AboutScreen() {
  const { openAboutDrawer } = useNav();

  return (
    <ScreenShell>
      <header>
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">Our Story</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          Indulgent, honestly made.
        </h1>
        <p className="mt-3 text-[0.92rem] leading-relaxed text-[rgba(227,210,194,0.78)]">
          {BRAND.storyLede}
        </p>
      </header>

      <div className="hairline my-6" />

      <div className="flex flex-col gap-3">
        {cards.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openAboutDrawer(c.id)}
            className="glass-card flex items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors hover:border-[rgba(236,91,69,0.5)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(159,149,54,0.45)]">
              <c.icon className="h-5 w-5 text-olive" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[1.05rem] font-semibold text-cream">
                {c.title}
              </span>
              <span className="block text-[0.76rem] text-[rgba(227,210,194,0.62)]">
                {c.note}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-coral" />
          </motion.button>
        ))}

        {/* Coming soon */}
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--hairline)] px-4 py-4 opacity-70">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)]">
            <Lock className="h-4 w-4 text-[rgba(233,173,190,0.6)]" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-[1.05rem] font-semibold text-[rgba(227,210,194,0.7)]">
              Brand Testimonials
            </span>
            <span className="block text-[0.76rem] text-[rgba(227,210,194,0.5)]">
              Coming soon
            </span>
          </span>
        </div>
      </div>

      <Footer />
    </ScreenShell>
  );
}
