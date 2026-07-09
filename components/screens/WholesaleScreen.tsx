"use client";

import { motion } from "framer-motion";
import { Boxes, Gift, MapPin, Store } from "lucide-react";
import ScreenShell from "../ScreenShell";
import WhatsAppButton from "../ui/WhatsAppButton";
import Footer from "../Footer";
import { useT } from "@/lib/i18n";

const icons = [Store, Boxes, Gift, MapPin];

export default function WholesaleScreen() {
  const t = useT();
  const points = t.wholesale.p.map((p, i) => ({ ...p, icon: icons[i] }));

  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">
          {t.wholesale.eyebrow}
        </p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.75rem]">
          {t.wholesale.title}
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          {t.wholesale.subtitle}
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-3 lg:mt-10 lg:grid lg:grid-cols-2 lg:gap-5">
        {points.map((p, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card flex items-center gap-4 rounded-2xl px-4 py-4 lg:px-6 lg:py-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(233,173,190,0.35)]">
              <p.icon className="h-5 w-5 text-pink" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block font-heading text-[1.02rem] font-semibold text-cream">
                {p.t}
              </span>
              <span className="block text-[0.78rem] text-[rgba(227,210,194,0.64)]">
                {p.n}
              </span>
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-[0.85rem] leading-relaxed text-[rgba(227,210,194,0.72)] lg:mx-auto lg:max-w-[62ch]">
        {t.wholesale.closing}
      </p>

      <div className="mx-auto mt-4 w-full max-w-[24rem]">
        <WhatsAppButton intent="wholesale" label={t.wholesale.enquire} />
      </div>

      <Footer />
    </ScreenShell>
  );
}
