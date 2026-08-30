# Candy Couture — Project Handoff

A mobile-first microsite for Candy Couture, a Bahrain oat-bar brand. Bilingual
**English / Arabic** with full RTL. Ordering happens over WhatsApp.

- **Live:** <https://www.candycouture.co> (apex `candycouture.co` 301s to `www`)
- **Repo:** <https://github.com/ultravmusic1-del/cc>
- **Vercel:** team `ultravmusic1-dels-projects`, project `cc`
  (`prj_QhKqYnQJmHozNz4xOjbjmqbvasZp`)

---

## 🧪 START HERE — you are on an experimental redesign branch

**Branch: `experiment/candy-slab-redesign`. This is NOT what is live.**

`main` is the live site: a dark burgundy, click-driven microsite built on an
app-shell scroll model with Framer Motion and anime.js. It is stable and
deployed. **Nothing on this branch has been merged into it.**

This branch is a **complete visual and interaction redesign**, built as an
experiment to see what the site looks like in the design language of
[aardvarkbookclub.com](https://www.aardvarkbookclub.com) — an award-winning
Webflow/GSAP site — while keeping Candy Couture's own palette, photography and
copy. It was commissioned as an experiment, not as an approved direction.

```bash
git fetch origin
git checkout experiment/candy-slab-redesign
npm ci
npm run dev
```

### What changed, in one paragraph

The site went from a dark burgundy app shell to a **light, scroll-led stack of
colour "slabs"**. Burgundy became the ink rather than the ground. The document
now scrolls normally (the app-shell model is gone), driven by Lenis and GSAP
ScrollTrigger. Framer Motion and anime.js were removed entirely. Navigation is a
pill cluster that travels from the header to a floating bottom bar as you scroll,
and page changes run through a full-screen SVG curtain.

### Deliberately unchanged

`lib/content.ts`, `lib/i18n.tsx`, `lib/routes.ts`, `lib/seo.ts`,
`lib/whatsapp.ts`, `app/robots.ts`, `app/sitemap.ts` and `components/seo/` are
the source of truth for content, routing and SEO. The redesign is a
presentation-layer change; those files were touched only to add two strings
(`hero.imageAlt`, `header.skipToContent`).

---

## The design system — "candy slabs"

The page is a stack of full-width colour bands. A slab publishes its own ink,
accent and rule colours as CSS variables, and children colour themselves from
whichever slab they land in. That is what lets the same `ProductCard` sit on
cream and on burgundy without a single conditional.

**Only the nine existing brand hexes are used.** Every tint is those hexes
composited with `color-mix`. No new hues were introduced — that was a hard
constraint of the brief.

| Slab | Ink | Carries |
| --- | --- | --- |
| cream, beige, pink | burgundy | body copy (6.9:1 or better) |
| burgundy | cream / pink | body copy |
| coral, olive | burgundy | **display type only** |

### Coral and olive are display-only, and this is measured

No brand colour reaches 4.5:1 on coral or olive:

```
cream    on coral   2.83:1   fails outright
burgundy on coral   3.79:1   AA Large only
cream    on olive   2.55:1   fails outright
burgundy on olive   4.21:1   AA Large only
coral    on cream   2.83:1   fails outright — coral is never text on light
```

So those two slabs carry bold display type at 24px+ and nothing smaller, and the
primary CTA is **always burgundy/cream** (10.75:1), never coral. `npm run
contrast:check` asserts all of it and exits non-zero if it stops holding.

### Type

Display **Gabarito** (standing in for the reference's commercial *Champ*), body
**Hanken Grotesk**, handwriting **Caveat**, **Bodoni Moda** kept only for the
"Couture" half of the wordmark, **Cairo** for Arabic. Display line-heights run
0.82–0.9 with tight per-element measures — headlines are chunky blocks, not a
reading column.

---

## Scroll model — CHANGED (read this if you know the old one)

**The document scrolls normally now.** Lenis owns the scroll position.

The old model had `body { overflow: hidden }` with a separate `.screen-scroll`
container per screen, as a workaround for iOS Safari ignoring programmatic
scroll after a client-side view swap. That is **gone**. ScrollTrigger has to
measure against a normally-scrolling document, and Lenis handles the navigation
reset the containers existed to guarantee.

`npm run seo:check` asserts the old model is not reinstated, so this cannot
regress silently.

Back/forward navigation restores the previous scroll position:
`history.scrollRestoration` is left at its `auto` default and
`components/motion/SmoothScroll.tsx` skips its scroll-to-top when the navigation
came from a `popstate`.

---

## Motion vocabulary

All of it is GSAP. Every animation is gated on `prefers-reduced-motion`, and
entrance animations set their own end state rather than being skipped, so
nothing is ever stranded at `opacity: 0`. Hover and inertia effects are
additionally gated on `(hover: hover) and (pointer: fine)`.

| Component | What it does |
| --- | --- |
| `motion/Curtain.tsx` | Page transition. One SVG path, DrawSVG 0→100% while `stroke-width` swells 6→190, flooding the screen. Runs backwards to uncover. |
| `motion/PlopIn.tsx` | Elements arrive from `scale:0, rotate:-18°` and settle **crooked**, `elastic.out(1, 0.72)`. The non-zero rest angle is the point. |
| `motion/SplitReveal.tsx` | Headlines split into lines, each rising from behind a mask. |
| `motion/HandwrittenNote.tsx` | Marginalia writes itself on, character by character. |
| `motion/BreathingShapes.tsx` | Background blobs are *stroked* paths whose width breathes on a sine loop. Paused off-screen. |
| `motion/MomentumHover.tsx` | InertiaPlugin. Pointer velocity × lever-arm torque flicks cards. Desktop only. |
| `motion/Marquee.tsx` | Running display-type bands between slabs. |
| `Header.tsx` | The nav cluster translates from the header to a floating bottom bar. |

GSAP's whole plugin set (SplitText, DrawSVG, Inertia, CustomEase) went free in
2025, which is the only reason this is buildable without a Club licence.

---

## Verification state

| Check | Result |
| --- | --- |
| `npm run seo:check` | **117 passed, 0 failed** against a local production build |
| `npm run contrast:check` | all slab/ink pairings pass |
| `npx tsc --noEmit` | clean |
| `npm audit` | 0 vulnerabilities |
| Indexable text | **4623 → 9479 chars** across the eight routes |
| CLS | 0 |
| Images | AVIF via `next/image` |
| Touch targets | 0 below the 24px WCAG 2.5.8 minimum; nav and CTAs at 44px |
| Text clipping | 0 clipped elements, all routes, both languages |
| Mobile 375×812 | no horizontal overflow, no page offset, EN and AR |

**Not verified:** LCP. It could not be measured — the Claude browser pane does
not composite, so the observer never fires, and a local server would not be
representative anyway. Check it on a real preview deployment.

### Bundle

182 kB First Load JS on `/`, dominated by GSAP core (71 KB) and ScrollTrigger
(43 KB). That is inherent to this design language. InertiaPlugin is only 7.2 KB
minified, so lazy-loading the desktop-only plugin was judged not worth the
complexity.

---

## Gotchas found building this branch

### ⚠️ Tailwind purges dynamically-built class names

Slab tones are built as `slab--${tone}`, so the literal strings appear in no
source file and Tailwind dropped them from `@layer components`. It failed
**silently and convincingly**: every slab rendered cream except burgundy, which
survived only because `Footer`, `MobileMenu` and `not-found` happen to spell it
out. Fixed with a `safelist` in `tailwind.config.ts`. The same applies to
`split-line-mask`, which GSAP SplitText creates at runtime. **Keep the safelist
in sync with `SlabTone`.**

### ⚠️ `overflow-x: hidden` breaks RTL layout

`hidden` makes an element a scroll container. In Arabic, hero art that hangs off
the left edge then counted as scrollable overflow and shifted the **whole
document** 20px, pushing the fixed chrome off-screen. Use `overflow-x: clip` —
it clips without ever becoming scrollable, and unlike `hidden` it does not force
the other axis away from `visible`.

### ⚠️ Line masks clip descenders at tight line-heights

Display type runs at `line-height: 0.84`, so the line box is *shorter than the
glyphs*. SplitText's mask clips to that box and slices the tail off every g, y,
p and q. `.split-line-mask` is padded 0.22em at the bottom (0.38em for Arabic,
whose descenders sit deeper) with a matching negative margin. If you change that
padding, raise `LINE_REVEAL_FROM` in `SplitReveal.tsx` to match.

### ⚠️ SplitText rewrites DOM that React owns

On a language switch React could not reconcile against the spans SplitText had
injected, and the Arabic page kept rendering English text. Split elements are
keyed on `lang` so React rebuilds them instead.

### ⚠️ Nothing that uncovers the page may depend on rAF

The curtain covers the entire site. Its failsafe was originally armed *inside*
`reveal()`, which `template.tsx` called through `requestAnimationFrame` — and
rAF does not fire in a throttled tab, so neither did the reveal nor its own
safety net. The failsafe is now a `setTimeout`, armed on mount as well as in
`reveal()`. For the same reason `TransitionLink` races the cover animation
against a 900ms deadline: a link must always navigate.

### ⚠️ Verifying animations in a headless/background browser (still true)

When the browser pane is hidden or backgrounded, `requestAnimationFrame` fires
**zero frames**, and GSAP is rAF-driven. This *fabricates* the symptoms of an
animation bug — elements frozen mid-transform, screenshots showing one hero bar
instead of three. It produced several false readings while building this branch;
each time, the DOM said `opacity: 1` and in-viewport while the screenshot showed
nothing.

**Assert rAF is alive before trusting any animation result** — count frames for
~250ms and require >5. Static geometry reads (`getBoundingClientRect`) stay
valid while hidden; only time- and paint-dependent results are poisoned.

---

## Run it

```bash
npm install
cp .env.example .env.local   # then edit the WhatsApp number
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run build` / `start` | production build / serve |
| `npm run contrast:check` | assert every slab/ink pairing meets WCAG AA |
| `npm run seo:check` | 117 assertions against a running production build |
| `npm run assets:optimize` | re-encode `public/images` |

> **Never run `npm run build` while `npm run dev` is running** — both write to
> `.next` and it corrupts the dev cache. If a page renders unstyled: stop dev,
> delete `.next`, restart.

> `npm run seo:check` expects a **local** production build on port 3200. Running
> it against the live host always reports total failure — see challenge mode
> below.

### Files that do not travel with the repo

Both are correctly gitignored; recreate them on a new machine:

- `.env.local` — `NEXT_PUBLIC_WHATSAPP_NUMBER`. Falls back to the real ordering
  line, so the site works without it.
- `.claude/launch.json` — dev-server config for the Claude browser preview:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "candy-couture", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }
  ]
}
```

---

## Deployment (Vercel)

Already set up and healthy — reference, not a to-do list.

- Project `cc` on team `ultravmusic1-dels-projects`, framework auto-detected.
- Env var **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (Production + Preview).
- **Every push to `main` auto-deploys to production**, READY in ~45s.
- **A push to any other branch builds a Preview deployment only.** That is how
  this experimental branch can be viewed without touching production.
- Domain: GoDaddy holds DNS pointing `candycouture.co` at Vercel. DNS plays no
  part in which commit gets built — if live looks stale, it is almost always
  unpushed local commits.

### Production 429s to non-browser clients (does NOT block Googlebot)

`https://www.candycouture.co/` returns **429 with an `X-Vercel-Challenge-Token`**
to every non-browser client — Vercel's Attack Challenge Mode. Real browsers get
200 and solve it transparently. Googlebot is allowlisted by reverse DNS and was
confirmed fine via Search Console URL Inspection.

Consequences: run `seo:check` against a local build, and never test crawlability
with a spoofed Googlebot user-agent — the Live Test in Search Console is the
only check that means anything.

### Search Console

`public/google84764bf90bc17c8e.html` is the ownership-verification file served
at the site root. **Do not delete it** — Search Console re-checks periodically
and silently un-verifies if it stops resolving.

---

## What this branch fixed along the way

- **Orphan pages.** `/wholesale` had zero inbound internal links in
  server-rendered HTML and `/about` had one, because the only links lived inside
  a menu that mounts on open. The footer now links all eight routes on every
  page.
- **Thin content.** `/about` put the entire brand story behind drawer taps, so
  it was not in the served HTML. The story is now the page. Indexable text
  roughly doubled.
- **A `nanoid` high-severity advisory** (transitive, pre-existing).

---

## Open items

- **Product photography is the ceiling.** The hero composition is built to throw
  objects around, and it is limited by the assets: both bars share a stack shot,
  and the images are packaging photos rather than cut-outs. This is the single
  biggest gap between this branch and the reference site's impact.
- **Measure LCP on a real preview deployment** — see Verification state.
- **Merge decision.** This branch has never been merged and `main` is untouched.
  If it is ever approved, the SEO harness, contrast audit and a fresh mobile/RTL
  sweep should be re-run against the merge result.
- Confirm the live `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel.
- "Brand Testimonials" is intentionally **Coming soon**; wire it up when content
  exists.
- **Tier 3 SEO** (`/ar` routes + hreflang) remains unstarted. Arabic is currently
  invisible to search because it is a client-side toggle with no distinct URL.
