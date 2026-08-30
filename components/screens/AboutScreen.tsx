"use client";

import Slab from "../Slab";
import PageHero from "../PageHero";
import SplitReveal from "../motion/SplitReveal";
import HandwrittenNote from "../motion/HandwrittenNote";
import Marquee from "../motion/Marquee";
import Button from "../ui/Button";
import WhatsAppButton from "../ui/WhatsAppButton";
import { ROUTES } from "@/lib/routes";
import { useContent, useT } from "@/lib/i18n";

/**
 * The story, told down the page.
 *
 * This used to be three cards that opened drawers. The drawers made sense
 * under the old click-driven shell, but they hid the only real prose on the
 * site behind a tap — which is also why this page measured so thin: the text
 * existed, but not in the served HTML. On a scrolling page the story can simply
 * be the page.
 */
export default function AboutScreen() {
  const c = useContent();
  const t = useT();

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        note={t.drawer.quote}
      />

      <Slab tone="cream" innerClassName="!pt-0">
        <p className="body-copy max-w-[46ch] font-display text-[clamp(1.35rem,3vw,2rem)] font-bold leading-[1.2] tracking-tight">
          {c.brand.storyLede}
        </p>
      </Slab>

      <Slab tone="pink" inset shapes="b" shapeColor="var(--cream)">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.about.aboutUsT}</p>
            <SplitReveal as="h2" className="display-m mt-5 font-display font-black">
              {t.about.aboutUsN}
            </SplitReveal>
          </div>
          <div className="body-copy space-y-6 text-[1.02rem] leading-relaxed">
            <p>{c.brand.storyBody}</p>
            <p>{c.brand.storyClose}</p>
          </div>
        </div>
      </Slab>

      <Slab tone="coral" as="div" innerClassName="!py-0 !px-0 !max-w-none">
        <Marquee
          items={[t.drawer.quote, c.brand.tagline]}
          className="py-6"
          speed={30}
        />
      </Slab>

      <Slab tone="beige">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.about.philosophyT}</p>
            <SplitReveal as="h2" className="display-m mt-5 font-display font-black">
              {t.about.philosophyN}
            </SplitReveal>
          </div>
          <div className="body-copy space-y-6 text-[1.02rem] leading-relaxed">
            <p>{c.philosophy.lede}</p>
            <p>{c.philosophy.body}</p>
          </div>
        </div>
      </Slab>

      <Slab tone="burgundy" inset shapes="a" shapeColor="var(--pink)" shapeOpacity={0.4}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.about.giftingT}</p>
            <SplitReveal as="h2" className="display-m mt-5 font-display font-black">
              {t.about.giftingN}
            </SplitReveal>
          </div>
          <div>
            <p className="body-copy text-[1.02rem] leading-relaxed text-[var(--slab-ink-soft)]">
              {t.drawer.giftingText}
            </p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { label: t.drawer.boxQty, value: t.drawer.boxQtyVal },
                { label: t.drawer.giftBoxes, value: t.drawer.comingSoon },
                { label: t.drawer.delivery, value: t.drawer.deliveryVal },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-2 font-display text-[1.1rem] font-black leading-tight">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <WhatsAppButton intent="wholesale" label={t.drawer.enquire} />
              <Button href={ROUTES.wholesale} variant="ghost">
                {t.wholesale.title}
              </Button>
            </div>
          </div>
        </div>
      </Slab>

      <Slab tone="olive" shapes="c" shapeColor="var(--cream)" shapeOpacity={0.5}>
        <div className="flex flex-col items-center gap-7 text-center">
          <HandwrittenNote tilt="right" size="large">
            {c.brand.tagline}
          </HandwrittenNote>
          <SplitReveal as="h2" className="display-l font-display font-black">
            {t.home.chooseBar}
          </SplitReveal>
          <Button href={ROUTES.bars} arrow>
            {t.bars.title}
          </Button>
        </div>
      </Slab>
    </>
  );
}
