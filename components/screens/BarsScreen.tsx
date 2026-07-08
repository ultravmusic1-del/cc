"use client";

import { motion } from "framer-motion";
import { Box, Tag, Truck } from "lucide-react";
import ScreenShell from "../ScreenShell";
import ProductCard from "../ProductCard";
import { PRODUCT_LIST } from "@/lib/content";

const infoItems = [
  { icon: Box, title: "One pack", note: "10 bars" },
  { icon: Tag, title: "Wholesale", note: "Options available" },
  { icon: Truck, title: "Delivery", note: "Across Bahrain" },
];

export default function BarsScreen() {
  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">The Collection</p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream">
          Choose your bar
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          Wholesome ingredients. Indulgent taste.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PRODUCT_LIST.map((p, i) => (
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
              i < infoItems.length - 1 ? "border-r border-[var(--hairline)]" : ""
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
        One box equals <span className="text-coral">10 bars</span>. Minimum order 10.
      </p>
    </ScreenShell>
  );
}
