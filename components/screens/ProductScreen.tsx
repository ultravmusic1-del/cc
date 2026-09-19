"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ScreenShell from "../ScreenShell";
import WhatsAppButton from "../ui/WhatsAppButton";
import CountUp from "../ui/CountUp";
import type { ProductId } from "@/lib/content";
import { ROUTES } from "@/lib/routes";
import { useContent, useT, fill } from "@/lib/i18n";
import Footer from "../Footer";

/**
 * Full product page — the replacement for the old bottom-sheet product modal
 * (deleted in Task 4). The sheet's five tabs (Overview / Ingredients /
 * Nutrition / Storage / Allergens) are now stacked sections, all present in the
 * server-rendered HTML, which is the entire point: the sheet's content was
 * invisible to crawlers because it only existed after a click.
 *
 * Content comes from `useContent()`, so this stays language-agnostic and the
 * Arabic bundle renders through the same markup.
 *
 * Deliberately NO framer `layoutId` anywhere — see HANDOFF.md. And no anime.js
 * `data-cascade`: that stagger was tuned for a six-row sheet opening, not a
 * ~30-row page, where it would run for over a second mostly below the fold.
 * `ScreenShell` already animates the page in.
 */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-2.5 last:border-b-0">
      <span className="text-[0.82rem] text-[rgba(227,210,194,0.7)]">{label}</span>
      <span className="text-end text-[0.85rem] font-semibold text-cream">
        {value}
      </span>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-8 lg:mt-12">
      <h2
        id={id}
        className="font-heading text-[1.3rem] font-semibold leading-tight text-cream lg:text-[1.6rem]"
      >
        {title}
      </h2>
      <div className="hairline mb-4 mt-2.5 lg:mb-5" />
      {children}
    </section>
  );
}

export default function ProductScreen({ productId }: { productId: ProductId }) {
  const c = useContent();
  const t = useT();
  const product = c.products[productId];
  const storage = c.storage;

  const isCoral = product.accent === "coral";
  const accent = isCoral ? "#ec5b45" : "#e9adbe";
  const highlights = product.nutrition.filter((n) => n.highlight);
  const rest = product.nutrition.filter((n) => !n.highlight);
  const allergenChips = [t.modal.gluten, t.modal.dairy, t.modal.nuts];

  return (
    <ScreenShell>
      {/* One column that matches the other screens' desktop measure (880px),
          so this page sits in the same grid as /bars and /nutrition. */}
      <div className="lg:mx-auto lg:w-full lg:max-w-[880px]">
        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-[rgba(227,210,194,0.55)]">
            <li>
              <Link
                href={ROUTES.bars}
                className="transition-colors hover:text-coral"
              >
                {t.nav.bars}
              </Link>
            </li>
            <li aria-hidden className="text-[rgba(227,210,194,0.35)]">
              /
            </li>
            <li aria-current="page" className="text-[rgba(227,210,194,0.75)]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* ── Hero + price ───────────────────────────────────── */}
        <div className="mt-5 lg:mt-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="relative mx-auto flex aspect-square w-[70%] max-w-[290px] items-center justify-center lg:w-full lg:max-w-[400px]">
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[86%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `radial-gradient(ellipse at 50% 46%, ${
                  isCoral ? "rgba(236,91,69,0.34)" : "rgba(233,173,190,0.26)"
                }, transparent 66%)`,
              }}
            />
            <Image
              src={product.image}
              alt={product.imageAlt}
              width={600}
              height={600}
              // LCP element on this route — never lazy-load it.
              priority
              sizes="(min-width: 1024px) 400px, 70vw"
              className="relative h-auto w-full drop-shadow-[0_14px_18px_rgba(15,3,7,0.45)]"
            />
          </div>

          <div className="mt-5 text-center lg:mt-0 lg:text-start">
            <p
              className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {isCoral ? t.modal.badgeHigh : t.modal.badgeClassic}
            </p>
            <h1 className="mt-2 font-heading text-[2rem] font-semibold leading-tight text-cream lg:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.72)]">
              {product.tagline}
            </p>

            {/* price block */}
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-1.5 lg:justify-start">
                <span className="font-heading text-[2.1rem] font-bold leading-none text-cream">
                  {product.pricePerBar}
                </span>
                <span className="text-[0.8rem] font-medium text-[rgba(227,210,194,0.6)]">
                  {t.card.perBar}
                </span>
              </div>
              <p className="mt-1.5 text-[0.76rem] text-[rgba(227,210,194,0.55)]">
                {fill(t.card.perBoxOf10, { price: product.pricePerBox })}
              </p>
              <div className="mx-auto mt-5 max-w-[22rem] lg:mx-0">
                <WhatsAppButton intent={product.id} label={t.modal.orderCta} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Overview ───────────────────────────────────────── */}
        <Section id="overview" title={t.modal.tabs.overview}>
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
            <p className="text-[0.92rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
              {product.description}
            </p>
            <div className="glass-card mt-4 rounded-2xl px-4 py-1.5 lg:mt-0">
              <Row label={t.modal.servingSize} value={product.servingSize} />
              <Row
                label={t.modal.price}
                value={fill(t.modal.perBarSlash, { price: product.pricePerBar })}
              />
              <Row
                label={t.modal.perBox}
                value={fill(t.modal.boxLine, { price: product.pricePerBox })}
              />
              <Row label={t.modal.minimumOrder} value={product.moq} />
              <Row label={t.modal.shelfLife} value={product.shelfLife} />
              <Row label={t.modal.made} value={t.modal.madeVal} />
            </div>
          </div>
        </Section>

        {/* ── Ingredients ────────────────────────────────────── */}
        <Section id="ingredients" title={t.modal.tabs.ingredients}>
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
            <p className="text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
              {product.ingredients}
            </p>
            <div className="mt-4 lg:mt-0">
              <p className="eyebrow mb-2 text-[rgba(233,173,190,0.7)]">
                {t.modal.heroIngredients}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.ingredientChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[rgba(159,149,54,0.4)] bg-[rgba(159,149,54,0.1)] px-3 py-1.5 text-[0.74rem] font-medium text-[#d7d59a]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Nutrition ──────────────────────────────────────── */}
        <Section id="nutrition" title={t.modal.tabs.nutrition}>
          <p className="mb-3 text-[0.76rem] text-[rgba(227,210,194,0.6)]">
            {fill(t.modal.per, { serving: product.servingSize })}
          </p>
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              {highlights.map((n) => (
                <div
                  key={n.label}
                  className="glass-card flex flex-col items-center rounded-2xl py-4 lg:py-7"
                >
                  <CountUp
                    value={n.value}
                    duration={1100}
                    className="font-heading text-xl font-bold text-coral lg:text-3xl"
                  />
                  <span className="mt-1 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[rgba(227,210,194,0.6)]">
                    {n.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="glass-card mt-3 rounded-2xl px-4 py-1.5 lg:mt-0">
              {rest.map((n) => (
                <Row key={n.label} label={n.label} value={n.value} />
              ))}
            </div>
          </div>
        </Section>

        {/* ── Storage ────────────────────────────────────────── */}
        <Section id="storage" title={t.modal.tabs.storage}>
          <div className="glass-card rounded-2xl px-4 py-1.5">
            <Row label={t.modal.shelfLife} value={storage.shelfLife} />
            <div className="border-b border-[var(--hairline)] py-3 last:border-b-0">
              <p className="text-[0.85rem] leading-relaxed text-[rgba(227,210,194,0.82)]">
                {storage.keep}
              </p>
            </div>
            <div className="py-3">
              <p className="text-[0.85rem] text-cream">{storage.made}</p>
            </div>
          </div>
        </Section>

        {/* ── Allergens ──────────────────────────────────────── */}
        <Section id="allergens" title={t.modal.tabs.allergens}>
          <div className="glass-card rounded-2xl p-4">
            <p className="text-[0.9rem] leading-relaxed text-[rgba(227,210,194,0.85)]">
              {product.allergens}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allergenChips.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-[rgba(236,91,69,0.4)] bg-[rgba(236,91,69,0.1)] px-3 py-1.5 text-[0.74rem] font-semibold text-coral"
                >
                  {fill(t.modal.contains, { a })}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Closing CTA ────────────────────────────────────── */}
        <div className="mx-auto mt-8 max-w-[22rem] lg:mt-12">
          <WhatsAppButton intent={product.id} label={t.modal.orderCta} />
        </div>
      </div>
      <Footer />
    </ScreenShell>
  );
}
