# SEO Tier 2 — Real Routes: Design

**Date:** 4 Aug 2026
**Status:** approved (product-detail UX decided by Vivaan: replace modal with pages)

## Goal

Take the site from **1 indexable URL to 8**, so it can rank for something other
than its own brand name — and so Vercel Analytics reports per-page data, which
today collapses everything to `/` for the same root cause.

## Why this is the real fix

Tier 1 made the site crawlable. It did not make it worth crawling: the whole
site still exposes **227 characters** of indexable text, because every "screen"
is client-side view state in `components/App.tsx` (`view === "bars" && <BarsScreen/>`)
rather than a route. Only the active screen exists in the DOM, and on first load
that is always Home.

The same defect breaks analytics. Navigation sets `window.location.hash`
(`lib/store.tsx`), which changes the hash, not the pathname. Vercel Analytics
detects pageviews from Next's router, which reports pathname changes — so only
the initial `/` pageview is ever recorded. This was known and documented when
Analytics was added (commit `01a6a3a`).

**One fix solves both.**

## Route map

| URL | Content | Source |
|---|---|---|
| `/` | Home / hero | `HomeScreen` |
| `/bars` | Product listing | `BarsScreen` |
| `/bars/oat-cookie-bar` | Full product detail | new, from `content.ts` |
| `/bars/oat-protein-bar` | Full product detail | new, from `content.ts` |
| `/nutrition` | Nutrition tables | `NutritionScreen` |
| `/ordering` | Ordering & delivery | `OrderingScreen` |
| `/wholesale` | Wholesale & gifting | `WholesaleScreen` |
| `/about` | Brand story | `AboutScreen` |

All statically prerendered. No dynamic rendering, no server data fetching —
`lib/content.ts` is a static module.

## Architecture

### The app shell moves into the layout

Today `app/page.tsx` renders `<App/>`, which owns *both* the chrome and the
screen switch. Split those:

```
app/
  layout.tsx          html/body/fonts/JsonLd  →  renders <AppShell>{children}</AppShell>
  page.tsx            Home
  bars/page.tsx       Bars listing
  bars/[slug]/page.tsx  Product detail (generateStaticParams → 2 pages)
  nutrition/page.tsx
  ordering/page.tsx
  wholesale/page.tsx
  about/page.tsx

components/
  AppShell.tsx        "use client" — providers, fixed backgrounds, Header,
                      StickyNav, bottom scrim, menu/drawer overlays, {children}
```

`AppShell` is the current `Shell` from `App.tsx` with the six-way screen switch
replaced by `{children}`. `components/App.tsx` is deleted.

### ⚠️ The scroll model is preserved exactly — this is the highest-risk part

`HANDOFF.md` documents the app-shell scroll model as the fix for iOS Safari
ignoring `scrollTo`/`scrollTop`/`scrollIntoView` after a client-side view swap:

- `body { height: 100%; overflow: hidden }` — the document never scrolls
- each screen root is a `.screen-scroll` container (`height:100%; overflow-y:auto`)
- navigating unmounts the old container and mounts a **brand-new** one, which the
  browser starts at `scrollTop: 0`

**Real routes preserve this mechanism rather than threatening it.** `ScreenShell`
(the `.screen-scroll` element) lives inside each *page*, not the layout. A route
change unmounts the page subtree and mounts a fresh one — the same remount that
the current view switch performs. The layout, and therefore the chrome, persists.

Two things must stay true, and are explicit test criteria:

1. `body { overflow: hidden }` stays. Nothing may reintroduce document scrolling.
2. `<Link>` keeps its default `scroll={true}`. It scrolls the *window*, which is
   a no-op here — harmless, and overriding it would be cargo-culting.

**If a future change moves `ScreenShell` into the layout, the iOS bug returns.**

### Navigation

`lib/store.tsx` currently owns `view` + hash sync + overlays. After this change
it owns **overlays only** (`menu`, `about-drawer`). Removed: `view`, `goTo`,
`viewFromHash`, the `hashchange` listener, and `openProduct`.

- `Header` and `StickyNav` use `next/link` and `usePathname()` for active state.
- `history.scrollRestoration = "manual"` stays — it belongs to the scroll model,
  not the router.

### Product pages replace the modal

`components/ProductDetailModal.tsx` is **deleted**, along with the `product`
overlay branch. The modal's five tabs become five stacked sections on the page.

This is deliberate and better on both axes:
- **Mobile UX:** stacked sections scroll naturally; no tab strip on a small screen.
- **SEO:** tabs would hide four-fifths of the content behind clicks, which Google
  discounts. Stacked sections put all of it in the initial HTML.

Slugs are language-independent (URLs stay English even in Arabic), so they live
in a non-localized constant beside `CONTACT`:

```ts
export const PRODUCT_SLUGS: Record<ProductId, string> = {
  cookie: "oat-cookie-bar",
  protein: "oat-protein-bar",
};
```

`ProductCard`'s image button and "View Details" both become links to the page.

### Old hash links keep working

`/#bars` may exist in WhatsApp messages or bookmarks. `AppShell` performs a
one-time client redirect on mount: if `location.hash` names a known former view,
`router.replace()` to the equivalent path. Costs ~8 lines and prevents every
previously-shared link from silently landing on Home.

### Metadata, sitemap, structured data

- Every page exports its own `metadata` — unique `title`, `description`, and
  `alternates.canonical`. Titles follow `<Page> | Candy Couture`, except Home
  which keeps the existing brand-led title.
- `app/sitemap.ts` grows from 1 entry to 8, built from the same route constants
  the pages use, so it cannot drift.
- `buildJsonLd()` changes `offers.url` from the homepage to each product's own
  page — currently both offers point at `/`, which will be wrong once the
  products have real URLs.
- Each product page adds a `BreadcrumbList` (`Home → Bars → <product>`).

### Not in scope

- **Arabic routes and hreflang** — that is Tier 3, and depends on this landing.
  Language stays client-side `localStorage` at the same URL.
- **Any visual redesign.** Screens keep their current appearance. The only
  intentional visual change is the product detail becoming a page.
- **Removing the `-v2` product image filenames.** Unrelated.

## Testing — the explicit requirement

Vivaan's condition: *"thorough testing before any merging, I don't want the live
site impacted without it being perfect. Just remember this is a mobile first site
which should also look great on PC."*

So verification is a first-class deliverable, not a final step:

1. **Extend `scripts/seo-check.mjs`** to assert all 8 routes return 200, each has
   a unique title and self-referencing canonical, the sitemap lists all 8, and the
   product pages carry their content in the HTML. Red-first, as in Tier 1.
2. **Scroll-model regression test.** Assert `body` computed `overflow` is
   `hidden` and that a `.screen-scroll` container exists per route. This is the
   documented iOS hazard and must be mechanically guarded, not eyeballed.
3. **Two viewports, every route.** 390×844 (phone) and 1440×900 (desktop):
   no horizontal overflow, header/nav present and correct, no console errors.
4. **Interaction sweep.** Every nav link, both product links, the mobile menu,
   the about drawers, the language toggle, and every WhatsApp CTA.
5. **rAF guard on anything animated** — a hidden browser pane stalls
   `requestAnimationFrame` to zero and fabricates animation bugs. See HANDOFF.

## Risks

| Risk | Mitigation |
|---|---|
| iOS scroll regression — the documented hazard | `ScreenShell` stays inside pages; mechanical assertion on `body { overflow: hidden }` |
| Losing the modal's polish | Accepted trade, chosen deliberately; page shows *more* content than the modal did |
| `layoutId` inside an `AnimatePresence`-removed subtree | Banned. It caused a wedged, undismissable sheet earlier today; route transitions add more places to trip |
| Previously shared `/#bars` links breaking | One-time client redirect |
| Regression on a live storefront | Nothing merges until the harness is fully green on both viewports and Vivaan approves |
