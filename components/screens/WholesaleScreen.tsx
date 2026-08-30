"use client";

import { Boxes, Gift, MapPin, Store } from "lucide-react";
import Slab from "../Slab";
import PageHero from "../PageHero";
import PlopIn from "../motion/PlopIn";
import SplitReveal from "../motion/SplitReveal";
import Marquee from "../motion/Marquee";
import WhatsAppButton from "../ui/WhatsAppButton";
import { useContent, useT } from "@/lib/i18n";

const ICONS = [Store, Boxes, Gift, MapPin];

export default function WholesaleScreen() {
  const c = useContent();
  const t = useT();
  const points = t.wholesale.p.map((p, i) => ({ ...p, Icon: ICONS[i] }));

  return (
    <>
      <PageHero
        eyebrow={t.wholesale.eyebrow}
        title={t.wholesale.title}
        note={t.wholesale.subtitle}
      />

      <Slab tone="pink" inset stack shapes="b" shapeColor="var(--cream)">
        <ul className="grid gap-4 sm:grid-cols-2">
          {points.map((point, i) => (
            <PlopIn
              as="li"
              key={point.t}
              delay={i * 0.07}
              settle={i % 2 === 0 ? -2 : 2.4}
            >
              <div className="card flex h-full items-center gap-5 px-6 py-6 shadow-drop">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-pink">
                  <point.Icon
                    className="h-6 w-6 text-brand-burgundy"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[1.15rem] font-black leading-tight text-brand-burgundy">
                    {point.t}
                  </span>
                  <span className="mt-1 block text-[0.88rem] text-[color-mix(in_srgb,var(--burgundy)_72%,transparent)]">
                    {point.n}
                  </span>
                </span>
              </div>
            </PlopIn>
          ))}
        </ul>
      </Slab>

      <Slab tone="coral" as="div" innerClassName="!py-0 !px-0 !max-w-none">
        <Marquee
          items={[t.wholesale.subtitle, c.brand.location, t.wholesale.title]}
          className="py-6"
          speed={32}
          reverse
        />
      </Slab>

      <Slab tone="burgundy" shapes="a" shapeColor="var(--pink)" shapeOpacity={0.4}>
        <div className="flex flex-col items-center gap-7 text-center">
          <SplitReveal as="h2" className="display-m font-display font-black">
            {t.wholesale.closing}
          </SplitReveal>
          <WhatsAppButton intent="wholesale" label={t.wholesale.enquire} />
        </div>
      </Slab>
    </>
  );
}
