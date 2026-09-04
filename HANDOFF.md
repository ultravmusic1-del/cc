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

## Gifting collection (4 Sep 2026) — built, NOT yet committed or deployed

Design: `docs/superpowers/specs/2026-09-04-gifting-collection-design.md`.

- **`/gifting`** is the ninth route (`ROUTES.gifting`). Facts live in
  `lib/content.ts → gifting` (two boxes: 6 bars 12 BD, 12 bars 20 BD) with a
  price drift guard in `lib/seo.ts` (`GIFT_BOX_PRICE_BHD`) and two extra
  `Product` nodes in the JSON-LD graph.
- Screen: `components/screens/GiftingScreen.tsx`. Photo:
  `public/images/gift-box-v1.jpg` (1200×1803, 110 KB, from the client's
  `gifting image 1.JPG`). Bump the `-v1` suffix if the photo changes.
- Nav: desktop header gains **Gifting**; the mobile menu main list gains a
  Gifting row; the About page's old "Gifting & Wholesale" drawer is replaced by
  two link cards (Gifting → `/gifting`, Wholesale → `/wholesale`). The gifting
  drawer and its `AboutDrawerId` are deleted. The bottom sticky nav is
  unchanged at four items.
- **Launch pop-up:** `components/GiftingPromo.tsx`, mounted in `AppShell`.
  Opens 1.4 s after first mount, once per browser session
  (`sessionStorage["cc-gifting-promo"]`), never on `/gifting`, never over the
  menu or a drawer (it is the `promo` overlay in `lib/store.tsx`). To retire it,
  delete the component and the `promo` overlay type.
- Wholesale lost every "gifting" mention, including the
  "Premium gift packs — Coming soon" row.
- WhatsApp intents added: `gifting`, `giftSix`, `giftTwelve`.
- `npm run seo:check` → **111 passed** (was 101): +8 route checks, +2 price
  checks for `/gifting`, and the JSON-LD product count is now 4.
- Assumption to confirm with Vivaan: the 10-bar minimum does **not** apply to
  gift boxes, so the page states no minimum.

---

## SEO Tier 2 — MERGED to `main` (5 Aug 2026)

The section below was written while Tier 2 lived on `feat/seo-tier-2`. That
branch has since been merged and deleted; everything it describes is live.
It is kept because the verification notes and gotchas still apply.

```bash
git fetch origin
git checkout main
npm ci
```

### What Tier 2 is doing

Converting six client-state screens into **eight real routes**, and replacing the
product modal with product pages. This fixes two problems with one change: the
site had 1 indexable URL, and Vercel Analytics collapsed every screen to `/` —
both because navigation set `location.hash` instead of changing the pathname.

Plan: `docs/superpowers/plans/2026-08-04-seo-tier-2.md`
Design: `docs/superpowers/specs/2026-08-04-seo-tier-2-real-routes-design.md`

### Progress: all 6 tasks done — awaiting Vivaan's merge approval

| Task | Status | Commit |
|---|---|---|
| T2-1 Extend harness to 85 assertions | ✅ | `1ac372d` |
| T2-2 Extract `AppShell` (pure refactor) | ✅ | `929f44c` |
| T2-3 Convert six screens to routes | ✅ | `76573c5` |
| T2-4 Product pages, delete modal | ✅ | `8debc9a` |
| T2-5 Sitemap → 8 routes, `offers.url`, breadcrumbs | ✅ | `5600d24` |
| T2-6 Two-viewport verification sweep | ✅ | this commit |

**`npm run seo:check` → 85 passed, 0 failed, exit 0.** Baseline was 32/53.
Run it against a **local** production build, never the live host — see the
challenge-mode note below.

### T2-6 sweep results

Mobile **375×812** and desktop **1440×900**, every route:

- `body { overflow: hidden }` held on all 8 routes at both viewports — the iOS
  scroll invariant survived the refactor
- exactly one `.screen-scroll` container per route, remounting per navigation
- no horizontal overflow at 375px anywhere
- mobile: sticky bottom nav shown, desktop header nav hidden. Desktop: the
  reverse, content centred at 1120px. Correct at both.
- zero `[role=dialog]` anywhere — the modal is genuinely gone
- client-side navigation works; breadcrumb returns to `/bars`; back/forward fine
- Arabic toggle persists across route changes **and** across a full page load
- WhatsApp CTAs carry correct per-product intents
- legacy `/#wholesale` → `/wholesale` redirect works
- zero console errors

Four suspected bugs were investigated and all four were measurement artifacts of
the hidden browser pane (`naturalWidth: 0`, an apparently-3840px image, a
seemingly-visible sticky nav on desktop, a missing LCP `priority`). Each was
disproven before being reported. **Do not trust DOM measurements taken while
`document.visibilityState === "hidden"`** — see the rAF gotcha below; the same
trap applies to image decode and layout.

### ⚠️ Known issue, NOT fixed: orphan pages

`/wholesale` has **zero inbound internal links** in server-rendered HTML, and
`/about` has exactly one (the homepage "Our Story" CTA). The mobile menu does
link them, but it lives inside an `AnimatePresence` and only exists in the DOM
once opened — so crawlers never see those links.

Both are in the sitemap, so Google will find them, but orphan pages receive no
internal link equity and read as unimportant. `components/Footer.tsx` renders on
only three screens and contains a copyright line, no links.

**The fix is a footer nav linking all eight routes, rendered on every screen.**
Not done because it is a visible design change and Vivaan approves those. Small
and low-risk when he wants it.

### Also worth knowing

**Indexable text is 4623 chars over 8 pages — about 580 per page, which is thin.**
Tier 2 fixed the structural problem; routes cannot manufacture words. Further
gains are a copywriting job. The harness floor is 4000, deliberately set below
the real figure as a regression guard, with the reasoning written in the comment.

### Next actions

1. **Vivaan reviews and approves the merge.** Nothing has touched `main`.
2. Optionally take the footer-nav fix above first.
3. After merging: submit the updated 8-URL sitemap in Search Console and request
   indexing for the new routes.
4. **Tier 3** (`/ar` routes + hreflang) is the remaining SEO tier and now
   unblocked — it depends on this routing work.

---

## Recent changes (3–4 Aug 2026)

Everything in this table is **live on production** via `main`.

| Commit | Change |
|---|---|
| `1112ee4` | Next 14.2.35 → **15.5.22** + `postcss`/`sharp` overrides. `npm audit` 2 high → **0** |
| `d64c0a1` | **Fix:** product modal wedged on screen after a tab switch, undismissable until reload |
| `f4aefa7` | **Perf:** modal open animation ~20 fps → **~47 fps** (dropped a `ResizeObserver`) |
| `3ecda78` | Google Search Console HTML verification file |
| `2287686` | **SEO Tier 1**: robots.txt, sitemap.xml, canonical + og:url, JSON-LD, 797 KB → 45 KB images |

The two modal commits are one story: `d64c0a1` fixed the wedge but introduced a
frame-rate regression, and `f4aefa7` fixed that. Both are explained under
Gotchas — they're the most transferable lessons in this file.

> Note: `ProductDetailModal.tsx` still exists on `main` and is deleted on
> `feat/seo-tier-2`. Its gotchas below remain worth reading either way — the
> `layoutId` lesson applies to any Framer subtree an `AnimatePresence` removes.

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

> **This section describes `feat/seo-tier-2`.** On `main` (what is live today)
> the site is still one page with a hash router: `app/page.tsx` → `components/App.tsx`,
> a `view` state synced to `location.hash`, and `useNav()` exposing `goTo` /
> `openProduct`. If you are on `main`, read that instead — everything below the
> Scroll model heading applies to both.

Eight real routes, all statically prerendered:

```
/                        HomeScreen
/bars                    BarsScreen
/bars/oat-cookie-bar     ProductScreen  ┐ app/bars/[slug]/page.tsx
/bars/oat-protein-bar    ProductScreen  ┘ generateStaticParams, dynamicParams=false
/nutrition               NutritionScreen
/ordering                OrderingScreen
/wholesale               WholesaleScreen
/about                   AboutScreen
/gifting                 GiftingScreen   (added 4 Sep 2026)
```

### Navigation

- **`lib/routes.ts` is the single source of truth** for paths and product slugs.
  The nav, the sitemap and per-page metadata all read from it, so a route cannot
  exist in one and be missing from another — which is exactly how a page ends up
  unlinked and unindexed. Slugs are deliberately **not** localized; URLs stay
  English even in Arabic.
- `components/AppShell.tsx` holds the chrome (providers, fixed backgrounds,
  `Header`, `StickyNav`, scrim, overlays) and is rendered by the root layout
  around `{children}`. Each route's page supplies only its screen.
- Header / StickyNav / MobileMenu use `next/link`, with active state from
  `usePathname()`. Several use `motion.create(Link)` so `whileTap` and entrance
  variants survive the swap from `<button>`.
- `lib/store.tsx` is now **overlay state only** — `menu` and `about-drawer`.
  `view`, `goTo`, `viewFromHash` and the `hashchange` listener are gone.
  `history.scrollRestoration = "manual"` stays; it belongs to the scroll model,
  not the router.
- **Legacy `#bars` links still work.** `AppShell` redirects known former hash
  views to their real route once on mount (`LEGACY_HASH_ROUTES`), so anything
  shared on WhatsApp before Tier 2 doesn't silently land on Home.

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

> **⚠️ Real routes preserve this — but only because `ScreenShell` lives inside
> each page.** A route change unmounts the page subtree and mounts a fresh
> `.screen-scroll` container, which is the same remount the old view switch
> performed. **If anyone ever hoists `ScreenShell` into a layout, it stops
> remounting and the iOS bug returns** — silently, because it only reproduces on
> real iOS hardware. `scripts/seo-check.mjs` asserts every route ships a
> `.screen-scroll` container; that guard exists for this reason.
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
  page.tsx              Home route  → HomeScreen
  bars/page.tsx         Bars listing
  bars/[slug]/page.tsx  Product pages (generateStaticParams → 2 SSG pages)
  nutrition|ordering|wholesale|about/page.tsx   one screen each
  robots.ts  sitemap.ts   generated /robots.txt and /sitemap.xml
  globals.css           theme vars, app-shell scroll CSS, .screen-scroll, Arabic font
  error.tsx / global-error.tsx
components/
  AppShell.tsx          chrome: providers, fixed bg/header/nav, scroll-lock + reset, wraps {children}
  Header.tsx            fixed top bar (menu / centered logo / order)
  StickyNav.tsx         fixed bottom nav (Bars/Nutrition/Order/Menu)
  MobileMenu.tsx        full-screen menu overlay (+ language toggle, Contact)
  AboutDrawer.tsx       About Us / Philosophy / Gifting drawers
  ScreenShell.tsx       shared .screen-scroll chrome — MUST stay inside pages, never a layout
  seo/JsonLd.tsx        server-rendered schema.org graph
  ProductCard.tsx  Footer.tsx  Logo.tsx
  screens/              HomeScreen, BarsScreen, NutritionScreen, AboutScreen, OrderingScreen,
                        WholesaleScreen, ProductScreen
  ui/                   CountUp, MaskIcon, Segmented, Icon, WhatsAppButton
lib/
  routes.ts             ROUTES, PRODUCT_SLUGS, productPath(), LEGACY_HASH_ROUTES
  seo.ts                SITE_URL, price facts + drift guard, buildJsonLd()
  store.tsx             overlay state only (menu / about-drawer) + scroll-restoration
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

> Plan and full rationale: `docs/superpowers/plans/2026-08-03-seo-tier-1.md`.

**✅ Tier 1 — DONE (4 Aug 2026).** Shipped: `app/robots.ts`, `app/sitemap.ts`,
`alternates.canonical` + `openGraph.url`, schema.org JSON-LD (Organization + both
Products), and a 797 KB → 45 KB image reduction. `npm run seo:check` reports
**26 passed, 0 failed**.

Three things from it that outlive the task:

- **`npm run seo:check` is a deploy gate.** 26 fixed assertions against a running
  build; exits non-zero on any failure. Run it before shipping anything that
  touches metadata, routing, or images. If you add a check, bump
  `EXPECTED_CHECKS` — the summary warns when the constant and the real count
  disagree. Run it against a **local** production build, not the live host (see
  the challenge-mode note above).
- **`lib/seo.ts` fails the build on price drift.** Its numeric prices duplicate
  the localized display strings in `content.ts` by necessity (schema.org needs a
  bare number + ISO currency). A module-level assertion throws if the two ever
  disagree, in either language. Change a price in `content.ts` and you MUST
  change it there too — the build will tell you.
- **`scripts/seo-check.mjs` hardcodes the canonical origin on purpose.** Do not
  "tidy" it to import `SITE_URL`. A check that imports its expected value from
  the code under test cannot detect a wrong value.

Deliberately not done in Tier 1, and still open: a dedicated ≥112×112 logo asset
(the current 415×95 wordmark is below Google's minimum for the Organization logo
feature, so that enhancement will not fire), and `LocalBusiness`/`FoodEstablishment`
markup, which needs a real postal address the repo does not have.

**🚧 Tier 2 — IN PROGRESS on `feat/seo-tier-2`, 4 of 6 tasks done.**
Six screens are now real routes; product pages replace the modal. Indexable text
275 → **4623 chars**. Remaining: T2-5 (sitemap to 8 routes, `offers.url`,
breadcrumbs) and T2-6 (two-viewport verification sweep). **Not merged, not
deployed — see the START HERE section at the top of this file.**

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

### Production 429s to non-browser clients (does NOT block Googlebot)

`https://www.candycouture.co/` returns **429 with an `X-Vercel-Challenge-Token`**
to every non-browser client — Vercel's Attack Challenge Mode. Real browsers get
200 and solve it transparently, so visitors are unaffected.

**Googlebot is fine.** Confirmed 4 Aug 2026 via Search Console URL Inspection →
Test Live URL: *"URL is available to Google"*, *"Page can be indexed."* Vercel
allowlists verified crawlers by reverse DNS.

Two practical consequences:

- **`npm run seo:check -- https://www.candycouture.co` reports everything failed**
  while challenge mode is active — the harness is a non-browser client. Run it
  against a local production build instead.
- **Don't test crawlability with a spoofed Googlebot user-agent.** From an
  ordinary IP it is challenged by design and will always look broken. The Live
  Test in Search Console is the only check that means anything.

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
