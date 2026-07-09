# Candy Couture — Project Handoff

A premium, mobile-first **microsite** for Candy Couture, a Bahrain oat-bar brand
(launching July 2026). Burgundy-led, boutique-app feel. Bilingual **English /
Arabic** with full RTL. Ordering happens over WhatsApp.

Repo: <https://github.com/ultravmusic1-del/cc> · deploys on Vercel (push to `main`).

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

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · **anime.js
v4** · lucide-react. Fonts via `next/font`: Bodoni Moda (couture serif), Hanken
Grotesk (headings), Open Sans (body), Cairo (Arabic).

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

1. Import `ultravmusic1-del/cc` (auto-detects Next.js, zero config).
2. Set env var **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (Production + Preview).
3. Every push to `main` auto-deploys.

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

---

## Before launch

- Confirm the live `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel.
- Final pass on product photography if the client sends updated shots.
- "Brand Testimonials" is intentionally shown as **Coming soon**; wire it up when
  content exists.
