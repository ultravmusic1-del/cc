"use client";

import {
  ShoppingBag,
  MapPin,
  Truck,
  Gift,
  CreditCard,
  Clock,
  Store,
} from "lucide-react";
import Slab from "../Slab";
import PageHero from "../PageHero";
import PlopIn from "../motion/PlopIn";
import SplitReveal from "../motion/SplitReveal";
import HandwrittenNote from "../motion/HandwrittenNote";
import WhatsAppButton from "../ui/WhatsAppButton";
import Button from "../ui/Button";
import { ROUTES } from "@/lib/routes";
import { useContent, useT } from "@/lib/i18n";

export default function OrderingScreen() {
  const c = useContent();
  const t = useT();

  const rules = [
    { icon: ShoppingBag, label: t.ordering.minimum, value: c.ordering.minimum },
    {
      icon: MapPin,
      label: t.ordering.deliveryArea,
      value: c.ordering.deliveryArea,
    },
    { icon: Truck, label: t.ordering.deliveryFee, value: c.ordering.deliveryFee },
    { icon: Gift, label: t.ordering.freeOver, value: c.ordering.freeDeliveryOver },
    { icon: CreditCard, label: t.ordering.payment, value: c.ordering.payment },
    { icon: Clock, label: t.ordering.cutoff, value: c.ordering.cutoff },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.ordering.eyebrow}
        title={t.ordering.title}
        note={t.ordering.subtitle}
      />

      <Slab tone="beige" inset stack>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule, i) => (
            <PlopIn
              as="li"
              key={rule.label}
              delay={i * 0.06}
              settle={i % 2 === 0 ? -1.8 : 2.2}
            >
              <div className="card flex h-full flex-col gap-3 px-6 py-7 shadow-drop">
                <rule.icon
                  className="h-6 w-6 text-brand-coral"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="eyebrow">{rule.label}</span>
                <span className="font-display text-[1.15rem] font-black leading-tight text-brand-burgundy">
                  {rule.value}
                </span>
              </div>
            </PlopIn>
          ))}
        </ul>

        <div className="mt-10 flex items-start gap-4 rounded-card bg-brand-cream px-6 py-5 shadow-drop">
          <Store
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-coral"
            strokeWidth={2}
            aria-hidden
          />
          <p className="body-copy text-[0.92rem] leading-relaxed text-brand-burgundy">
            {t.ordering.wholesaleNote}
          </p>
        </div>
      </Slab>

      <Slab tone="burgundy" shapes="c" shapeColor="var(--coral)" shapeOpacity={0.45}>
        <div className="flex flex-col items-center gap-7 text-center">
          <HandwrittenNote tilt="left">{t.ordering.subtitle}</HandwrittenNote>
          <SplitReveal as="h2" className="display-l font-display font-black">
            {t.ordering.orderCta}
          </SplitReveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton label={t.ordering.orderCta} />
            <Button href={ROUTES.wholesale} variant="ghost">
              {t.wholesale.title}
            </Button>
          </div>
        </div>
      </Slab>
    </>
  );
}
