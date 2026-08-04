# Candy Couture — Project Handoff

A premium, mobile-first **microsite** for Candy Couture, a Bahrain oat-bar brand.
Burgundy-led, boutique-app feel. Bilingual **English / Arabic** with full RTL.
Ordering happens over WhatsApp.

- **Live:** <https://www.candycouture.co> (apex `candycouture.co` 301s to `www`)
- **Repo:** <https://github.com/ultravmusic1-del/cc> — every push to `main`
  auto-deploys to production, typically READY in ~45s
- **Vercel:** team `ultravmusic1-dels-projects`, project `cc`
  (`prj_QhKqYnQJmHozNz4xOjbjmqbvasZp`)

---

## Recent changes (3 Aug 2026)

All shipped to production and verified live.

| Commit | Change |
|---|---|
| `1112ee4` | Next 14.2.35 → **15.5.22** + `postcss`/`sharp` overrides. `npm audit` 2 high → **0** |
| `d64c0a1` | **Fix:** product modal wedged on screen after a tab switch, undismissable until reload |
| `f4aefa7` | **Perf:** modal open animation ~20 fps → **~47 fps** (dropped a `ResizeObserver`) |
| `3ecda78` | Google Search Console HTML verification file |

The two modal commits are one story: `d64c0a1` fixed the wedge but introduced a
frame-rate regression, and `f4aefa7` fixed that. Both are explained under
Gotchas — they're the most transferable lessons in this file.

Next up: the **SEO** section near the bottom. Audit is done and measured;
nothing implemented yet beyond the verification file.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (see gotcha below)
npx tsc --noEmit   # typecheck
```

Mobile-first — review in a phone viewport (DevTools device mode) or narrow window.

> **Gotcha:** never run `npm run build` while `npm run dev` is running — they
> share `.next` and it corrupts the dev cache (pages render unstyled). If that
> happens: stop dev, `rm -rf .next`, `npm run dev`.

---

## Tech stack

**Next.js 15.5.22** (App Router) · React 18 · TypeScript · Tailwind CSS · Framer
Motion · **anime.js v4** · lucide-react · `@vercel/analytics`. Fonts via
`next/font`: Bodoni Moda (couture serif), Hanken Grotesk (headings), Open Sans
(body), Cairo (Arabic).

### Why 15.5.22 specifically, and why the `overrides` block

Next 14 stopped receiving security backports; `14.2.35` is the final 14.x and
carried three high-severity RSC denial-of-service advisories with no patched 14
release. Fixes ship on the `15.5.x` backport line. Both 15.5.x and 16.x still
accept React 18, so this upgrade skipped the expensive React 19 migration.

`package.json` carries an `overrides` block that is **load-bearing** — removing
it reintroduces audit findings:

```json
"overrides": { "postcss": "^8.5.25", "sharp": "^0.35.3" }
```

Next 15.5.22 still pins its own `postcss@8.4.31`, and Next 15 newly pulls in
`sharp` (`<0.35.0` has libvips CVEs). Both are in-range minor bumps. With them,
`npm audit` reports **0 vulnerabilities**; without, 3 high.

> `npm audit fix --force` is actively harmful here — it proposes "install
> next@9.3.3", a downgrade across five majors. Never run it on this repo.

---

## Architecture

The whole site is **one page** (`app/page.tsx` → `components/App.tsx`). There is
**no Next.js routing / `next/link`** — it's a custom in-page "router."

### Navigation (`lib/store.tsx`)
- A `view` state (`home | bars | nutrition | about | ordering | wholesale`) picks
  which screen renders. Overlays (`menu | product | about-drawer`) stack on top.
- `view` is synced to the **URL hash** (`#bars`, …) so the browser back button
  works and views are deep-linkable. `history.scrollRestoration = "manual"`.
- `useNav()` exposes `goTo`, `openMenu`, `openProduct`, `openAboutDrawer`,
  `closeOverlay`.

### Scroll model — app shell (IMPORTANT, this is the iOS fix)
The **document never scrolls**. Instead:
- `body { height: 100%; overflow: hidden }` (globals.css).
- Each screen root is a `.screen-scroll` container (`height:100%; overflow-y:auto`)
  — see `ScreenShell` and `HomeScreen`.
- Navigating unmounts the old screen and mounts a **brand-new** container, which
  the browser starts at `scrollTop: 0`. No programmatic scroll needed.

Why: iOS Safari/WebKit **ignores** `scrollTo` / `scrollTop` / `scrollIntoView`
after a client-side view swap, so every JS "scroll to top" failed on iPhone
(Android was fine). The app-shell approach sidesteps it entirely.
`lib/scroll.ts#scrollToTop` remains only as a harmless belt-and-suspenders reset
of the container. **Keep the site short / low-scroll** — long pages reintroduce
the problem this design avoids.

### Internationalization (`lib/i18n.tsx` + `lib/content.ts`)
- `lib/content.ts` — the **single source of truth** for product facts (names,
  prices, nutrition, ingredients, ordering rules), bilingual (`CONTENT.en/ar`),
  plus `CONTACT` (email / instagram / whatsapp display values). Do **not** invent
  or alter facts.
- `lib/i18n.tsx` — component-level UI strings (`EN_UI`/`AR_UI`), `LangProvider`,
  and hooks: `useLang()`, `useContent()`, `useT()`, `fill(template, vars)`.
- Default English; toggle to Arabic in the slide-out menu; persisted in
  `localStorage["cc-lang"]`; sets `<html dir/lang>`; Cairo font applied on
  `[lang="ar"]`. Arabic is a full RTL mirror.

### Animation — Framer Motion + anime.js (they coexist)
Rule of thumb: to avoid conflicts, don't let both libraries animate the **same
element/property**.
- **Framer Motion:** product/menu sheet drag + slide, tab crossfade, sticky-nav
  active pill (`layoutId`), segmented control, screen/menu entrances.
  - ⚠️ The **product-modal tab pill deliberately does NOT use `layoutId`** — see
    the `layoutId` gotcha below. The sticky-nav pill still does, and is fine,
    because `StickyNav` is never removed by an `AnimatePresence`.
- **anime.js v4:**
  - `components/ui/CountUp.tsx` — nutrition numbers count up (Nutrition screen +
    product modal), re-runs per bar.
  - `components/StickyNav.tsx` — one-time staggered entrance of nav items.
  - `components/screens/HomeScreen.tsx` — **hero headline reveals word-by-word**
    (rise + fade, staggered); words are per-word `.hero-word` spans, re-runs on
    language change.
  - `components/ProductDetailModal.tsx` — **content cascades up** on open and on
    each tab switch; items are marked `data-cascade` (only `translateY`, so it
    never fights Framer's opacity crossfade).
- `lib/useIsoLayoutEffect.ts` — shared `useLayoutEffect`(client)/`useEffect`(SSR)
  hook used by the scroll reset and the anime.js entrances (run before paint so
  animations don't flash their final state).
- All anime.js entrances honor `prefers-reduced-motion`.

> A prior "scroll-triggered reveal" idea (anime.js `onScroll`) was intentionally
> **removed** — the site is deliberately low-scroll, so scroll reveals left
> content invisible. Don't reintroduce them.

---

## Key files

```
app/
  layout.tsx            fonts, metadata/SEO, <html>
  page.tsx              renders <App/>
  globals.css           theme vars, app-shell scroll CSS, .screen-scroll, Arabic font
  error.tsx / global-error.tsx
components/
  App.tsx               shell: providers, fixed bg/header/nav, screen switch, scroll-lock + reset
  Header.tsx            fixed top bar (menu / centered logo / order)
  StickyNav.tsx         fixed bottom nav (Bars/Nutrition/Order/Menu)
  MobileMenu.tsx        full-screen menu overlay (+ language toggle, Contact)
  ProductDetailModal.tsx  bottom sheet w/ tabs (Overview/Ingredients/Nutrition/Storage/Allergens)
  AboutDrawer.tsx       About Us / Philosophy / Gifting drawers
  ScreenShell.tsx       shared .screen-scroll chrome for content screens
  ProductCard.tsx  Footer.tsx  Logo.tsx
  screens/              HomeScreen, BarsScreen, NutritionScreen, AboutScreen, OrderingScreen, WholesaleScreen
  ui/                   CountUp, MaskIcon, Segmented, Icon, WhatsAppButton
lib/
  store.tsx             nav state + hash routing + scroll-restoration
  content.ts            bilingual product/brand/contact source of truth
  i18n.tsx              UI strings + LangProvider + hooks
  whatsapp.ts           WhatsAppLink + WHATSAPP_NUMBER
  scroll.ts             scrollToTop() (container reset)
  useIsoLayoutEffect.ts shared iso layout-effect hook
public/images/          oat-bar-hero-2.png, oat-cookie-bar-v2.png, oat-protein-bar-v2.png, icons/*-v2.png, candy-couture-logo.png
public/
  google84764bf90bc17c8e.html   Search Console ownership proof — DO NOT DELETE
app/
  icon.png              favicon (currently 298 KB @ 1276x1277 — see SEO section)
  opengraph-image.png   1200x630 link-preview card
```

---

## Content & config (source of truth)

- **Prices:** Oat Cookie 1.5 BD/bar (15 BD/pack of 10); Oat Protein 1.8 BD/bar
  (18 BD/pack). Packaging unit is **"pack"** everywhere (not "box").
- **Ordering:** min 10 bars · Bahrain only · 2 BD delivery (free over 50 BD) ·
  BenefitPay · 2 PM cutoff for next-day.
- **WhatsApp:** display `+973 38366111`; link number lives in `lib/whatsapp.ts`
  as `NEXT_PUBLIC_WHATSAPP_NUMBER` (fallback `97338366111`). Contact email
  `candycouturecompany@gmail.com` (in `lib/content.ts`).
- **Images:** hero + product + benefit-icon PNGs are real assets supplied by the
  client, background-removed and normalized. Swap in updated photography by
  replacing the files (bump the `-v2` suffix to bust the next/image cache).

---

## Deployment (Vercel)

Already set up and healthy — this is reference, not a to-do list.

- Project `cc` on team `ultravmusic1-dels-projects`, framework auto-detected.
- Env var **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (Production + Preview).
- **Every push to `main` auto-deploys.** Vercel fires ~2s after the push and
  reaches READY in ~45s. Verified across 20+ deployments.
- Domain: GoDaddy holds the DNS, pointing `candycouture.co` at Vercel. DNS only
  resolves the name — it plays **no part** in which commit gets built. If the
  live site looks stale, the cause is almost always unpushed local commits, not
  DNS.

> Diagnosing "live is out of sync": compare `git log origin/main -1` against the
> deployment's `meta.githubCommitSha` in the Vercel API. If they match, the
> pipeline is fine and the delta is local-only.

---

## Gotchas / hard-won lessons

- **iOS scroll** — see the app-shell scroll model above. Don't replace it with
  JS `scrollTo`; it will regress on iPhone. Keep pages short.
- **Don't `npm run build` during `npm run dev`** (corrupts `.next`).
- **anime.js vs Framer** — never animate the same element/property with both.
- **Arabic** — `الجملة` (wholesale) also means "sentence" and `الطلب` (ordering)
  also means "demand"; several menu/title strings were disambiguated
  (`البيع بالجملة`, `الطلب والتوصيل`, `ألواح الشوفان`). Keep that in mind when
  adding Arabic copy.
- **Facts** live in `lib/content.ts` — don't hardcode prices/nutrition in
  components.

### ⚠️ `layoutId` inside an `AnimatePresence`-removed subtree (Aug 2026 bug)

**Symptom:** open a product sheet, switch any tab, close it → the sheet froze
mid-exit and stayed on screen, undismissable, until a page reload.

**Cause:** the tab pill used `layoutId="pd-tab"`. Switching tabs unmounts the
pill from one button and mounts it in another, registering a *shared-layout
projection*. When the parent `AnimatePresence` in `App.tsx` then removed the
sheet, that projection never settled, so the exit animation never completed and
`AnimatePresence` never unmounted the dialog. It came to rest at its exit
transform with `pointer-events: none` — hence undismissable.

**Fix:** one pill that never unmounts, measured off the active tab and animated
directly (`ProductDetailModal.tsx`). Same slide, no projection.

**Rule:** never put `layoutId` on an element inside a subtree that an ancestor
`AnimatePresence` removes. Gating the prop on `useIsPresent()` does **not** help
— the projection is registered at switch time and can't be released later.

**Desktop-only visibility:** `exit={{ y: "100%" }}` shifts the panel by its own
height, which clears the viewport only while bottom-anchored (`items-end`). At
`sm:` and up the panel is centred, so it settles `(viewportH − panelH) / 2` px
inside the viewport. Mobile had the identical wedge, just off-screen and unseen.

### ⚠️ `ResizeObserver` during an entrance animation

The first version of the above fix used a `ResizeObserver` on all five tab boxes
to keep the pill aligned. It fired *while the sheet was opening*, and each
callback forced a synchronous layout read (`offsetLeft`/`offsetTop`/
`offsetWidth`/`offsetHeight`) plus a React re-render, mid-spring. Measured, same
machine and production build:

| Build | open animation | worst frame |
|---|---|---|
| before the wedge fix | ~40 fps | 54–67 ms |
| wedge fix **with** observer | ~20 fps | 125–130 ms |
| wedge fix **without** | **~47 fps** | **39–53 ms** |

It's now re-measured on `[tab, tabLabelKey]` instead — `tabLabelKey` is the
joined tab labels, so it re-measures on a language switch (the only thing that
resizes the boxes) at zero cost during the open. **Don't reintroduce an observer
here.**

### ⚠️ Verifying animations in a headless/background browser

When the Claude Browser pane is hidden (or a Chrome window is backgrounded),
`document.visibilityState` is `"hidden"` and `requestAnimationFrame` fires
**zero frames**. Framer Motion and anime.js are rAF-driven, so nothing animates
and `AnimatePresence` can never complete an exit or unmount its child.

This *fabricates* the exact symptoms of an animation bug — elements frozen at
their `initial`/`exit` transform and never removed from the DOM. It produced
three false readings during the Aug 2026 debugging session, including a "fix
didn't work" that had never actually run.

**Always assert rAF is alive before trusting any animation result:** count
frames for ~250ms and require >5. Bake it into the probe so a stalled run
returns `INVALID` rather than a pass/fail. Static geometry reads
(`getBoundingClientRect`, `offsetLeft`) stay valid while hidden — only
time- and animation-dependent results are poisoned.

---

## SEO — audit findings & plan (Aug 2026)

Full audit run against the live site. **Nothing here is implemented yet** apart
from the Search Console verification file. Findings are measured, not estimated,
so the next session shouldn't need to re-audit.

### The dominant finding

**The whole site exposes 227 characters of indexable text.** That is everything
a crawler receives:

> Handcrafted in Bahrain · Bars · Nutrition · Order · Menu · Real ingredients.
> Freshly baked. Too good to share · Choose Your Bar · Our Story · Wholegrain
> Oats · Dark Chocolate Chunks · Smart Snacking

Not in the HTML: product names, prices, ingredients, nutrition, allergens, shelf
life, delivery terms, wholesale, or About copy. One `<h1>`, zero `<h2>`–`<h6>`.

**Cause is the architecture, not the metadata.** All six screens are client-state
swaps in `App.tsx` (`view === "bars" && <BarsScreen/>`), so only the active
screen exists in the DOM and on first load that's always Home. The hash router
means there is exactly **one indexable URL**. Consequence: the site can only
realistically rank for its own brand name.

### Measured state

| Check | Result |
|---|---|
| Indexable text | 227 chars · 1 `h1` · 0 subheadings |
| Indexable URLs | 1 |
| `robots.txt` | **404** |
| `sitemap.xml` | **404** |
| `rel=canonical` | absent (apex→www 301 is clean, so low risk until UTMs) |
| `hreflang` | absent |
| JSON-LD structured data | absent |
| `og:url` | absent |
| Core Web Vitals | LCP 1.09s · CLS 0 · TTFB 58ms — **healthy** |
| `app/icon.png` (favicon) | **298 KB at 1276×1277** |
| Hero benefit icons | **~480 KB** of PNGs (140+156+184), loaded as CSS masks |

Already good, don't regress: title/description are well-written and locally
qualified · OG + Twitter cards complete with a real 1200×630 image ·
`robots: index, follow` · security headers · hero has descriptive alt + LCP
priority hint · statically prerendered on Vercel's CDN.

### Arabic is invisible to search

A complete, carefully-reviewed Arabic translation exists (`AR_UI` in `i18n.tsx`
plus the AR bundle in `content.ts`), but language is `useState<Lang>("en")`
restored from `localStorage` after mount, so **SSR always emits English**,
`<html lang>` is corrected client-side only, there is no `/ar` URL and no
`hreflang`. In an Arabic-majority market this forfeits the whole Arabic search
opportunity — and the expensive part (translation) is already paid for.

### Plan, in priority order

> **Tier 1 has a written implementation plan:**
> `docs/superpowers/plans/2026-08-03-seo-tier-1.md` — task-by-task with complete
> code, a `npm run seo:check` assertion harness, and the Search Console steps.
> Start there rather than re-deriving it.

**Tier 1 — quick wins (~half a day, no architecture change)**
1. `app/robots.ts` + `app/sitemap.ts` (Next 15 generates both natively)
2. JSON-LD: `LocalBusiness` (Bahrain address, geo, hours, WhatsApp) + a `Product`
   each with `offers` at 1.5 / 1.8 BD
3. `alternates.canonical` + `openGraph.url` in `app/layout.tsx`
4. Resize `app/icon.png` to 48×48 → 298 KB becomes ~2 KB
5. Convert the three mask PNGs to SVG (they render as flat single-colour masks
   via `MaskIcon`) → ~480 KB becomes ~5 KB

**Tier 2 — the actual fix (2–4 days, real refactor)**
Turn the six screens into real routes plus two product pages
(`/bars/oat-cookie-bar`, `/bars/oat-protein-bar`). Server-render from
`content.ts`; keep the app-shell feel by layering client transitions on top.
Takes the site from **1 indexable page to ~9**.

> ⚠️ This conflicts with the app-shell scroll model above. Real routes must not
> reintroduce document scrolling, or the iOS bug returns. Budget time for it.

**Tier 3 — Arabic (1–2 days, on top of Tier 2)**
`/ar/*` routes with the existing bundle server-rendered, plus `hreflang` pairs
and `x-default`. Roughly doubles indexed surface into the market's main language.

**Honest framing:** Tier 1 alone is close to cosmetic for rankings — it mainly
ensures the pages Tier 2 creates get crawled properly. Tier 2 is the actual
prerequisite for ranking on anything but the brand name.

**Off-site, likely highest ROI of all:** for a local Bahrain food business a
**Google Business Profile** will probably drive more discovery than all three
tiers combined. Free, and outside this codebase.

### Search Console

`public/google84764bf90bc17c8e.html` is the ownership-verification file, served
at the site root. **Do not delete it** — Search Console re-checks periodically
and silently un-verifies if it stops resolving.

A more robust alternative once verified: `verification: { google: "…" }` in the
`metadata` export in `app/layout.tsx`, which emits a `<meta>` tag instead of
relying on a loose file. Google accepts either; don't switch until verification
has succeeded.

**Before committing to Tier 2, check Search Console's Pages report** — it will
confirm or refute the "only the homepage is indexable" read with real data.

---

## Open items

- **Modal exit geometry** — `exit={{ y: "100%" }}` still clears the viewport only
  when bottom-anchored, so on desktop the sheet vanishes ~80 px before it's fully
  off-screen. No longer a stuck-sheet bug (that's fixed), just a brief pop.
  A scale/fade exit at `sm:` and up would suit a centred dialog better.
- **Baseline animation cost** — the modal open runs ~47 fps and screen
  transitions measured ~16 fps in a GPU-less browser pane. Pre-existing and
  unrelated to the tab-pill work; `backdrop-blur` on the overlay and the anime.js
  cascade are the likely candidates if this is ever worth chasing.
- **SEO Tiers 1–3** above.
- Confirm the live `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel.
- Final pass on product photography if the client sends updated shots.
- "Brand Testimonials" is intentionally shown as **Coming soon**; wire it up when
  content exists.
