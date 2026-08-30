# Candy Couture

A mobile-first microsite for **Candy Couture** — a Bahrain-based handcrafted
oat-bar brand. Bright, scroll-led and colour-blocked, with WhatsApp ordering.

> Launching July 2026 · Handcrafted in Bahrain

## Design system — "candy slabs"

The page is a stack of full-width colour slabs. Burgundy is the **ink**
(headlines, handwriting, the page-transition curtain); cream and beige are the
grounds; pink, coral and olive are accent slabs.

Only the nine existing brand hexes are used. Every tint is those hexes composited
with `color-mix` — no new hues enter the system.

| Slab | Ink | Carries |
| --- | --- | --- |
| cream, beige, pink | burgundy | body copy (6.9:1 or better) |
| burgundy | cream / pink | body copy |
| coral, olive | burgundy | **display type only** |

No brand colour reaches 4.5:1 on coral or olive, so those two slabs take
headlines and short bold lines and nothing smaller. `npm run contrast:check`
asserts this and exits non-zero if it ever stops holding.

Colour is context, not hard-coding: a slab publishes `--slab-ink`,
`--slab-accent`, `--slab-cta-bg` and friends, and children colour themselves from
whichever slab they land in.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **GSAP 3.15** — ScrollTrigger, SplitText, CustomEase, DrawSVG, Inertia
- **Lenis** smooth scroll, stepped from the GSAP ticker
- **lucide-react** icons
- Fonts via `next/font`: Gabarito (display), Hanken Grotesk (body),
  Caveat (handwriting), Bodoni Moda (the "Couture" wordmark), Cairo (Arabic)

### Scroll model

The document scrolls normally and Lenis owns the scroll position.

This replaced an app-shell model where `body` had `overflow: hidden` and each
screen was its own `.screen-scroll` container — a workaround for iOS Safari
ignoring programmatic scroll after a client-side view swap. ScrollTrigger has to
measure against a normally-scrolling document, and Lenis handles the navigation
reset that the old containers existed to guarantee. `npm run seo:check` asserts
the old model is not reinstated.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the WhatsApp number
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build             # production build
npm run start             # serve the production build
npm run lint              # lint
npm run contrast:check    # assert every slab/ink pairing meets WCAG AA
npm run seo:check         # 117 assertions against a running production build
npm run assets:optimize   # re-encode public/images
```

> **Note:** never run `npm run build` while `npm run dev` is running — both write
> to `.next` and it corrupts the dev cache. If a page renders unstyled, stop the
> dev server, delete `.next`, and run `npm run dev` again.

> **Note:** slab tone classes are built as `slab--${tone}`, so the literal strings
> never appear in source. They are listed in `safelist` in `tailwind.config.ts`;
> without that entry Tailwind purges them and every slab silently renders cream.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number that receives WhatsApp orders — international format, digits only (e.g. `973XXXXXXXX`). Falls back to a placeholder until set. |

All product facts (prices, nutrition, ingredients, ordering rules) live in
[`lib/content.ts`](lib/content.ts) as a single source of truth, keyed by language.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository. Vercel
   auto-detects Next.js — no config needed.
3. Add **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (Production + Preview) under
   **Settings → Environment Variables**.
4. Deploy.

## Project structure

```
app/                  # App Router entry, layout, template (page transitions), styles
components/
  motion/             # Curtain, PlopIn, SplitReveal, HandwrittenNote,
                      # BreathingShapes, MomentumHover, Marquee, SmoothScroll
  screens/            # Home, Bars, Product, Nutrition, Ordering, Wholesale, About
  ui/                 # Button, WhatsAppButton, Segmented, CountUp, icons
  Slab.tsx            # the one sectioning primitive
lib/                  # content.ts (source of truth), i18n, routes, seo, gsap
public/images/        # Product photography
scripts/              # seo-check, contrast-check, optimize-assets
```

## Accessibility & motion

Every animation is gated on `prefers-reduced-motion`, and entrance animations set
their own end state rather than being skipped — nothing is left stranded at
`opacity: 0`. Hover and inertia effects are additionally gated on
`(hover: hover) and (pointer: fine)`.

Arabic is fully supported with RTL. Handwriting tilts mirror, and text is never
split per-character in Arabic, which would sever the cursive joining forms.

## To do before launch

- Set the real `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Replace the product photography with final renders — the hero composition is
  built to throw objects around, and benefits from cut-out product shots.
