"use client";

import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Slab from "../Slab";
import TransitionLink from "../TransitionLink";
import WhatsAppButton from "../ui/WhatsAppButton";
import Button from "../ui/Button";
import CountUp from "../ui/CountUp";
import SplitReveal from "../motion/SplitReveal";
import HandwrittenNote from "../motion/HandwrittenNote";
import PlopIn from "../motion/PlopIn";
import Marquee from "../motion/Marquee";
import type { ProductId } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { useContent, useT, fill } from "@/lib/i18n";

/**
 * Full product page — every section server-rendered.
 *
 * This replaced a bottom-sheet modal whose five tabs only existed after a
 * click, so none of it was crawlable. That constraint still governs the layout:
 * overview, ingredients, nutrition, storage and allergens are all plain
 * sections in the HTML, never behind an interaction.
 *
 * The product's own accent decides the slab tone for the hero, so the cookie
 * bar and the protein bar open on different colours.
 */
export default function ProductScreen({ productId }: { productId: ProductId }) {
  const c = useContent();
  const t = useT();
  const product = c.products[productId];

  const highlights = product.nutrition.filter((n) => n.highlight);
  const rest = product.nutrition.filter((n) => !n.highlight);
  const badge = productId === "protein" ? t.card.highProtein : t.card.classic;

  const facts = [
    { label: t.modal.servingSize, value: product.servingSize },
    { label: t.modal.price, value: fill(t.modal.perBarSlash, { price: product.pricePerBar }) },
    { label: t.modal.perBox, value: fill(t.modal.boxLine, { price: product.pricePerBox }) },
    { label: t.modal.minimumOrder, value: product.moq },
    { label: t.modal.shelfLife, value: product.shelfLife },
    { label: t.modal.made, value: t.modal.madeVal },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Slab
        tone={product.accent === "coral" ? "pink" : "beige"}
        shapes="a"
        shapeColor="var(--cream)"
        shapeOpacity={0.8}
        innerClassName="pt-32 lg:pt-36"
      >
        <TransitionLink
          href={ROUTES.bars}
          className="inline-flex items-center gap-1.5 text-[0.85rem] font-bold transition-opacity duration-300 ease-couture hover:opacity-70"
        >
          <ChevronLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
          {t.bars.title}
        </TransitionLink>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">{badge}</p>
            <SplitReveal
              as="h1"
              className="display-l mt-5 font-display font-black"
              delay={0.1}
            >
              {product.name}
            </SplitReveal>
            <p className="body-copy mt-6 max-w-[38ch] text-[1.05rem] leading-relaxed text-[var(--slab-ink-soft)]">
              {product.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-display text-[clamp(2.25rem,6vw,3.5rem)] font-black leading-none tracking-tight">
                {product.pricePerBar}
              </span>
              <span className="text-[0.9rem] font-semibold text-[var(--slab-ink-soft)]">
                {fill(t.card.perBoxOf10, { price: product.pricePerBox })}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton intent={productId} label={t.modal.orderCta} />
              <Button href={ROUTES.nutrition} variant="ghost">
                {t.nutrition.title}
              </Button>
            </div>
          </div>

          <PlopIn settle={product.accent === "coral" ? 7 : -6} start="top 95%">
            <Image
              src={product.image}
              alt={product.imageAlt}
              width={785}
              height={698}
              priority
              sizes="(min-width: 1024px) 28rem, 70vw"
              className="mx-auto h-auto w-[70%] max-w-[26rem] drop-shadow-[0_26px_40px_color-mix(in_srgb,var(--burgundy)_45%,transparent)] lg:w-full"
            />
          </PlopIn>
        </div>
      </Slab>

      {/* ── Hero ingredients ─────────────────────────────────────── */}
      <Slab tone="cream">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SplitReveal as="h2" className="display-m font-display font-black">
            {t.modal.heroIngredients}
          </SplitReveal>
          <HandwrittenNote tilt="right" className="md:mb-1">
            {c.brand.tagline}
          </HandwrittenNote>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.ingredientChips.map((chip, i) => (
            <PlopIn
              as="li"
              key={chip}
              delay={i * 0.06}
              settle={i % 2 === 0 ? -2.5 : 3}
            >
              <div className="flex h-full items-center rounded-card bg-brand-pink px-5 py-6 shadow-drop">
                <span className="font-display text-[1.05rem] font-black leading-tight text-brand-burgundy">
                  {chip}
                </span>
              </div>
            </PlopIn>
          ))}
        </ul>

        <p className="body-copy mt-10 max-w-[62ch] leading-relaxed text-[var(--slab-ink-soft)]">
          {product.ingredients}
        </p>
      </Slab>

      {/* ── Nutrition ────────────────────────────────────────────── */}
      <Slab
        tone="burgundy"
        inset
        shapes="c"
        shapeColor="var(--coral)"
        shapeOpacity={0.45}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SplitReveal as="h2" className="display-m font-display font-black">
            {t.modal.tabs.nutrition}
          </SplitReveal>
          <p className="text-[0.85rem] font-semibold text-[var(--slab-ink-soft)]">
            {fill(t.modal.per, { serving: product.servingSize })}
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
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
          {rest.map((n) => (
            <div key={n.label} className="flex items-center justify-between py-4">
              <dt className="body-copy text-[0.95rem] text-[var(--slab-ink-soft)]">
                {n.label}
              </dt>
              <dd className="font-display text-[1.05rem] font-black">{n.value}</dd>
            </div>
          ))}
        </dl>
      </Slab>

      {/* ── Facts, storage, allergens ────────────────────────────── */}
      <Slab tone="beige">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SplitReveal as="h2" className="display-s font-display font-black">
              {t.modal.tabs.overview}
            </SplitReveal>
            <dl className="mt-8 divide-y divide-[color-mix(in_srgb,var(--burgundy)_14%,transparent)] border-y border-[color-mix(in_srgb,var(--burgundy)_14%,transparent)]">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center justify-between gap-6 py-3.5"
                >
                  <dt className="body-copy text-[0.9rem] text-[var(--slab-ink-soft)]">
                    {fact.label}
                  </dt>
                  <dd className="text-end text-[0.92rem] font-bold">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-10">
            <div>
              <SplitReveal as="h2" className="display-s font-display font-black">
                {t.modal.tabs.storage}
              </SplitReveal>
              <ul className="body-copy mt-6 space-y-2.5 leading-relaxed text-[var(--slab-ink-soft)]">
                <li>{c.storage.shelfLife}</li>
                <li>{c.storage.keep}</li>
                <li>{c.storage.made}</li>
              </ul>
            </div>

            <div>
              <SplitReveal as="h2" className="display-s font-display font-black">
                {t.modal.tabs.allergens}
              </SplitReveal>
              <p className="body-copy mt-6 leading-relaxed text-[var(--slab-ink-soft)]">
                {product.allergens}
              </p>
            </div>
          </div>
        </div>
      </Slab>

      {/* ── Order ────────────────────────────────────────────────── */}
      <Slab tone="coral" as="div" innerClassName="!py-0 !px-0 !max-w-none">
        <Marquee
          items={[product.name, t.modal.orderCta, c.brand.location]}
          className="py-6"
          speed={28}
        />
      </Slab>

      <Slab tone="olive" shapes="b" shapeColor="var(--cream)" shapeOpacity={0.5}>
        <div className="flex flex-col items-center gap-7 text-center">
          <SplitReveal as="h2" className="display-l font-display font-black">
            {fill(t.nutrition.orderThe, { name: product.name })}
          </SplitReveal>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton intent={productId} label={t.modal.orderCta} />
            <Button href={ROUTES.ordering} variant="ghost">
              {t.ordering.title}
            </Button>
          </div>
        </div>
      </Slab>
    </>
  );
}
