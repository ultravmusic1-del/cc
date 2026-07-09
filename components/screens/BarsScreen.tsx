"use client";

import { motion } from "framer-motion";
import { Box, Tag, Truck } from "lucide-react";
import ScreenShell from "../ScreenShell";
import ProductCard from "../ProductCard";
import { useContent, useT, fill } from "@/lib/i18n";

export default function BarsScreen() {
  const c = useContent();
  const t = useT();
  const products = [c.products.cookie, c.products.protein];

  const infoItems = [
    { icon: Box, title: t.bars.onePack, note: t.bars.onePackVal },
    { icon: Tag, title: t.bars.wholesale, note: t.bars.wholesaleVal },
    { icon: Truck, title: t.bars.delivery, note: t.bars.deliveryVal },
  ];

  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">{t.bars.eyebrow}</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          {t.bars.title}
        </h1>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

      {/* footer info strip */}
      <div className="glass-card mt-5 flex items-stretch justify-between rounded-2xl px-2 py-3">
        {infoItems.map((it, i) => (
          <div
            key={it.title}
            className={`flex flex-1 flex-col items-center gap-1 px-1 text-center ${
              i < infoItems.length - 1
                ? "border-e border-[var(--hairline)]"
                : ""
            }`}
          >
            <it.icon className="h-4 w-4 text-[rgba(233,173,190,0.85)]" strokeWidth={1.5} />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-cream">
              {it.title}
            </span>
            <span className="text-[0.62rem] text-[rgba(227,210,194,0.6)]">
              {it.note}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[0.75rem] text-[rgba(227,210,194,0.5)]">
        {fill(t.bars.boxNote, { n: c.products.cookie.boxQty })}
      </p>
    </ScreenShell>
  );
}
