"use client";

import { Box, Tag, Truck } from "lucide-react";
import Slab from "../Slab";
import PageHero from "../PageHero";
import ProductCard from "../ProductCard";
import MomentumHover from "../motion/MomentumHover";
import PlopIn from "../motion/PlopIn";
import WhatsAppButton from "../ui/WhatsAppButton";
import { useContent, useT, fill } from "@/lib/i18n";

export default function BarsScreen() {
  const c = useContent();
  const t = useT();

  const info = [
    { icon: Box, title: t.bars.onePack, note: t.bars.onePackVal },
    { icon: Tag, title: t.bars.wholesale, note: t.bars.wholesaleVal },
    { icon: Truck, title: t.bars.delivery, note: t.bars.deliveryVal },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.bars.eyebrow}
        title={t.bars.title}
        note={t.bars.tagline}
      />

      <Slab tone="pink" inset stack shapes="a" shapeColor="var(--cream)">
        <MomentumHover className="grid gap-24 sm:grid-cols-2 sm:gap-8">
          {(["cookie", "protein"] as const).map((id, i) => (
            <ProductCard key={id} product={c.products[id]} index={i} />
          ))}
        </MomentumHover>

        <p className="body-copy mt-12 text-[0.92rem] font-semibold text-[var(--slab-ink-soft)]">
          {fill(t.bars.boxNote, { n: c.products.cookie.boxQty })}
        </p>
      </Slab>

      <Slab tone="beige">
        <ul className="grid gap-4 sm:grid-cols-3">
          {info.map((item, i) => (
            <PlopIn
              as="li"
              key={item.title}
              delay={i * 0.07}
              settle={i % 2 === 0 ? -2 : 2.5}
            >
              <div className="card flex h-full flex-col gap-3 px-6 py-7 shadow-drop">
                <item.icon
                  className="h-6 w-6 text-brand-coral"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="eyebrow">{item.title}</span>
                <span className="font-display text-[1.15rem] font-black leading-tight text-brand-burgundy">
                  {item.note}
                </span>
              </div>
            </PlopIn>
          ))}
        </ul>

        <div className="mt-12">
          <WhatsAppButton label={t.ordering.orderCta} />
        </div>
      </Slab>
    </>
  );
}
