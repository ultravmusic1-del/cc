"use client";

import Image from "next/image";
import Slab from "../Slab";
import ProductCard from "../ProductCard";
import Button from "../ui/Button";
import WhatsAppButton from "../ui/WhatsAppButton";
import MaskIcon from "../ui/MaskIcon";
import SplitReveal from "../motion/SplitReveal";
import HandwrittenNote from "../motion/HandwrittenNote";
import PlopIn from "../motion/PlopIn";
import Marquee from "../motion/Marquee";
import MomentumHover from "../motion/MomentumHover";
import HeroBars from "../HeroBars";
import { ROUTES } from "@/lib/routes";
import { useContent, useT } from "@/lib/i18n";

/**
 * Home — the slab sequence.
 *
 * cream (hero) → coral band → pink (the bars) → beige (what's inside)
 * → burgundy (nutrition) → olive (order).
 *
 * The order is a contrast rhythm, not decoration: the two display-only tones
 * (coral, olive) are spaced apart and carry nothing but headlines, and every
 * slab that holds real copy is one of the high-contrast four.
 */
export default function HomeScreen() {
  const c = useContent();
  const t = useT();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Slab
        tone="cream"
        shapes="a"
        shapeColor="var(--pink)"
        shapeOpacity={0.5}
        className="min-h-[100svh]"
        // 1.25/0.75 rather than an even split: the headline needs the room, and
        // the bars read better crowded into a corner than centred in a column.
        innerClassName="flex min-h-[100svh] flex-col justify-center gap-10 pt-[calc(var(--chrome-h)+1.5rem)] lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-8"
      >
        <div className="relative z-10">
          <p className="eyebrow">{t.home.eyebrow}</p>

          <SplitReveal
            as="h1"
            className="display-xl mt-5 font-display font-black"
            delay={0.15}
          >
            {t.home.line1}
            <br />
            {t.home.line2}
            <br />
            <span className="text-brand-burgundy/90">{t.home.line3}</span>
          </SplitReveal>

          <p className="body-copy mt-7 max-w-[34ch] text-[1.02rem] leading-relaxed text-[var(--slab-ink-soft)]">
            {c.hero.subtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={ROUTES.bars} arrow>
              {t.home.chooseBar}
            </Button>
            <Button href={ROUTES.about} variant="ghost">
              {t.home.ourStory}
            </Button>
          </div>
        </div>

        <HeroBars />
      </Slab>

      {/* ── Running band ─────────────────────────────────────────── */}
      <Slab tone="coral" as="div" innerClassName="!py-0 !px-0 !max-w-none">
        <Marquee
          items={[c.brand.tagline, t.home.line3, c.brand.location]}
          className="py-6"
          speed={34}
        />
      </Slab>

      {/* ── The bars ─────────────────────────────────────────────── */}
      <Slab tone="pink" inset shapes="b" shapeColor="var(--cream)" shapeOpacity={0.7}>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SplitReveal as="h2" className="display-l font-display font-black">
            {t.bars.title}
          </SplitReveal>
          <HandwrittenNote tilt="right" className="md:mb-2">
            {t.bars.tagline}
          </HandwrittenNote>
        </div>

        <MomentumHover className="mt-24 grid gap-24 sm:grid-cols-2 sm:gap-8">
          {(["cookie", "protein"] as const).map((id, i) => (
            <ProductCard key={id} product={c.products[id]} index={i} />
          ))}
        </MomentumHover>

        <p className="body-copy mt-12 text-[0.92rem] font-semibold text-[var(--slab-ink-soft)]">
          {t.bars.boxNote.replace("{n}", t.bars.onePackVal)}
        </p>
      </Slab>

      {/* ── What's inside ────────────────────────────────────────── */}
      <Slab tone="beige">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">{t.nutrition.eyebrow}</p>
            <SplitReveal as="h2" className="display-l mt-5 font-display font-black">
              {c.brand.tagline}
            </SplitReveal>
            <p className="body-copy mt-6 max-w-[38ch] leading-relaxed text-[var(--slab-ink-soft)]">
              {c.brand.storyClose}
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {c.heroBenefits.map((b, i) => (
              <PlopIn
                as="li"
                key={b.title}
                delay={i * 0.08}
                settle={i % 2 === 0 ? -2.5 : 3}
              >
                <div className="card flex h-full flex-col items-center gap-4 px-4 py-7 text-center shadow-drop">
                  <MaskIcon
                    src={b.icon}
                    className="h-14 w-14 shrink-0 text-brand-coral"
                  />
                  <span className="text-[0.72rem] font-bold uppercase leading-tight tracking-[0.12em] text-brand-burgundy">
                    {b.title}
                  </span>
                </div>
              </PlopIn>
            ))}
          </ul>
        </div>
      </Slab>

      {/* ── Nutrition teaser ─────────────────────────────────────── */}
      <Slab
        tone="burgundy"
        inset
        shapes="c"
        shapeColor="var(--coral)"
        shapeOpacity={0.5}
      >
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t.nutrition.eyebrow}</p>
            <SplitReveal as="h2" className="display-l mt-5 font-display font-black">
              {t.nutrition.subtitle}
            </SplitReveal>
          </div>
          <Button href={ROUTES.nutrition} variant="solid" arrow>
            {t.nutrition.title}
          </Button>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {c.products.protein.nutrition
            .filter((row) => row.highlight)
            .slice(0, 4)
            .map((row) => (
              <div key={row.label}>
                <dt className="eyebrow">{row.label}</dt>
                <dd className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-black leading-none tracking-tight text-[var(--slab-accent)]">
                  {row.value}
                </dd>
              </div>
            ))}
        </dl>
      </Slab>

      {/* ── Order ────────────────────────────────────────────────── */}
      <Slab tone="olive" shapes="a" shapeColor="var(--cream)" shapeOpacity={0.55}>
        <div className="flex flex-col items-center gap-8 text-center">
          <HandwrittenNote tilt="left" size="large">
            {t.ordering.subtitle}
          </HandwrittenNote>

          <SplitReveal as="h2" className="display-xl font-display font-black">
            {t.ordering.orderCta}
          </SplitReveal>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <WhatsAppButton label={t.ordering.orderCta} />
            <Button href={ROUTES.ordering} variant="ghost">
              {t.ordering.title}
            </Button>
          </div>
        </div>
      </Slab>
    </>
  );
}
