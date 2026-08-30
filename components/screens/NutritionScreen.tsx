"use client";

import { useState } from "react";
import Slab from "../Slab";
import PageHero from "../PageHero";
import Segmented from "../ui/Segmented";
import CountUp from "../ui/CountUp";
import WhatsAppButton from "../ui/WhatsAppButton";
import HandwrittenNote from "../motion/HandwrittenNote";
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
    <>
      <PageHero
        eyebrow={t.nutrition.eyebrow}
        title={t.nutrition.title}
        note={t.nutrition.subtitle}
      />

      <Slab tone="burgundy" inset stack shapes="c" shapeColor="var(--coral)" shapeOpacity={0.4}>
        <Segmented
          className="mx-auto w-full max-w-[24rem]"
          value={id}
          onChange={setId}
          options={[
            { id: "cookie", label: t.nutrition.segCookie },
            { id: "protein", label: t.nutrition.segProtein },
          ]}
        />

        <p className="mt-8 text-center text-[0.8rem] font-semibold text-[var(--slab-ink-soft)]">
          {fill(t.nutrition.per, { serving: product.servingSize })}
        </p>

        {/* Keyed on the product so switching remounts the numbers and the
            count-up runs again — the animation IS the feedback that the
            panel changed. */}
        <dl
          key={id}
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4"
        >
          {highlights.map((n) => (
            <div key={n.label}>
              <dt className="eyebrow">{n.label}</dt>
              <dd>
                <CountUp
                  value={n.value}
                  duration={1100}
                  className="mt-3 block font-display text-[clamp(2rem,5vw,3.25rem)] font-black leading-none tracking-tight text-[var(--slab-accent)]"
                />
              </dd>
            </div>
          ))}
        </dl>

        <dl className="mt-14 divide-y divide-[var(--slab-rule)] border-y border-[var(--slab-rule)]">
          {rest.map((n, i) => (
            <div key={n.label} className="flex items-center justify-between py-4">
              <dt className="body-copy text-[0.95rem] text-[var(--slab-ink-soft)]">
                {n.label}
              </dt>
              <dd>
                <CountUp
                  value={n.value}
                  duration={900}
                  delay={150 + i * 70}
                  className="font-display text-[1.05rem] font-black"
                />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="body-copy max-w-[38ch] text-[0.85rem] text-[var(--slab-ink-soft)]">
            {product.allergens}
          </p>
          <WhatsAppButton
            intent={id}
            label={fill(t.nutrition.orderThe, { name: product.name })}
          />
        </div>
      </Slab>

      <Slab tone="beige">
        <div className="flex flex-col items-center gap-6 text-center">
          <HandwrittenNote tilt="left" size="large">
            {c.brand.tagline}
          </HandwrittenNote>
          <p className="body-copy max-w-[52ch] leading-relaxed text-[var(--slab-ink-soft)]">
            {product.ingredients}
          </p>
        </div>
      </Slab>
    </>
  );
}
