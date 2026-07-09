"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScreenShell from "../ScreenShell";
import Segmented from "../ui/Segmented";
import WhatsAppButton from "../ui/WhatsAppButton";
import CountUp from "../ui/CountUp";
import { type ProductId } from "@/lib/content";
import { useContent, useT, fill } from "@/lib/i18n";

export default function NutritionScreen() {
  const [id, setId] = useState<ProductId>("cookie");
  const c = useContent();
  const t = useT();
  const product = c.products[id];
  const highlights = product.nutrition.filter((n) => n.highlight);
  const rest = product.nutrition.filter((n) => !n.highlight);

  return (
    <ScreenShell>
      <header className="text-center">
        <p className="eyebrow text-[rgba(233,173,190,0.8)]">
          {t.nutrition.eyebrow}
        </p>
        <h1 className="mt-3 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.75rem]">
          {t.nutrition.title}
        </h1>
        <p className="mt-2 text-[0.9rem] text-[rgba(227,210,194,0.72)]">
          {t.nutrition.subtitle}
        </p>
      </header>

      <Segmented
        className="mx-auto mt-6 w-full max-w-[22rem]"
        layoutId="nutri-seg"
        value={id}
        onChange={setId}
        options={[
          { id: "cookie", label: t.nutrition.segCookie },
          { id: "protein", label: t.nutrition.segProtein },
        ]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <p className="mb-3 text-center text-[0.74rem] text-[rgba(227,210,194,0.55)]">
            {fill(t.nutrition.per, { serving: product.servingSize })}
          </p>

          {/* Plain block on mobile (children stack exactly as before); a
              two-up grid on desktop. */}
          <div className="lg:mx-auto lg:grid lg:max-w-[880px] lg:grid-cols-2 lg:items-start lg:gap-6">
          <div className="grid grid-cols-2 gap-3 lg:gap-5">
            {highlights.map((n) => (
              <div
                key={n.label}
                className="glass-card flex flex-col items-center rounded-2xl py-5 lg:py-8"
              >
                <CountUp
                  value={n.value}
                  duration={1100}
                  className="font-heading text-3xl font-bold text-coral lg:text-4xl"
                />
                <span className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[rgba(227,210,194,0.62)]">
                  {n.label}
                </span>
              </div>
            ))}
          </div>

          <div className="glass-card mt-3 rounded-2xl px-5 py-2 lg:mt-0">
            {rest.map((n, i) => (
              <div
                key={n.label}
                className="flex items-center justify-between border-b border-[var(--hairline)] py-3 last:border-b-0"
              >
                <span className="text-[0.85rem] text-[rgba(227,210,194,0.72)]">
                  {n.label}
                </span>
                <CountUp
                  value={n.value}
                  duration={900}
                  delay={150 + i * 80}
                  className="font-heading text-[0.95rem] font-semibold text-cream"
                />
              </div>
            ))}
          </div>
          </div>

          <p className="mt-4 text-center text-[0.72rem] text-[rgba(227,210,194,0.5)]">
            {product.allergens}
          </p>

          <div className="mx-auto mt-5 max-w-[22rem]">
            <WhatsAppButton
              intent={id}
              label={fill(t.nutrition.orderThe, { name: product.name })}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </ScreenShell>
  );
}
