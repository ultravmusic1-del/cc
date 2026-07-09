# Handoff — Bilingual (English / Arabic) i18n feature

**Status: WIP, does NOT compile yet.** This branch adds a full English↔Arabic
language system (default English, toggle to Arabic, RTL). The data layer and
most components are done; three components + a couple of strings remain, and
nothing has been tested. Finish the "Remaining work" list, then run the
verification checklist.

Requirements agreed with the user:
- Load in **English by default**; a toggle switches to **Arabic**.
- Arabic uses a **full RTL mirror** (`dir="rtl"`).
- The **language toggle lives in the slide-out menu** (`MobileMenu`).
- **Everything** translates: all screens, buttons, nav, product data,
  nutrition facts, modal tabs, WhatsApp pre-filled messages.
- Translations must be accurate (Modern Standard Arabic already drafted).

---

## Architecture (already built)

### `lib/content.ts` — bilingual data (DONE)
- `type Lang = "en" | "ar"`.
- Types kept: `ProductId`, `NutritionRow`, `Product`, plus new `ContentBundle`.
- `CONTENT: Record<Lang, ContentBundle>` with full `EN` and `AR` bundles.
  Bundle fields: `brand`, `hero`, `heroBenefits`, `products` (cookie/protein
  with translated name/tagline/description/ingredients/chips/nutrition/allergens/
  imageAlt; prices show `د.ب` in Arabic), `ordering`, `storage`, `philosophy`.
- `CONTACT` is exported separately (email/instagram/whatsapp are values, not
  translated).
- **The old named exports (`BRAND`, `HERO`, `HERO_BENEFITS`, `PRODUCTS`,
  `PRODUCT_LIST`, `ORDERING`, `STORAGE`, `PHILOSOPHY`) were removed.** Anything
  still importing them will fail to build (see Remaining work).

### `lib/i18n.tsx` — provider + hooks + UI strings (DONE, one string missing)
- `UIStrings` interface + `EN_UI` / `AR_UI` dictionaries (component-level copy:
  nav, header, menu, home, bars, nutrition, ordering, about, wholesale, card,
  modal, drawer, whatsapp, footer).
- `LangProvider` — holds `lang` (default `"en"`), restores `localStorage["cc-lang"]`
  on mount, and syncs `document.documentElement.lang` + `dir` on change.
- Hooks: `useLang()` → `{ lang, dir, setLang, toggle }`; `useContent()` →
  `CONTENT[lang]`; `useT()` → `UI[lang]`.
- `fill(template, vars)` — replaces `{token}` placeholders (e.g.
  `fill(t.nutrition.orderThe, { name: product.name })`).
- **TODO:** add `close` to `UIStrings["modal"]` and both dictionaries
  (`en: "Close"`, `ar: "إغلاق"`) — `ProductDetailModal` already references
  `ui.modal.close`.

### `lib/whatsapp.ts` — bilingual (DONE)
- `whatsappLink(intent, lang)` picks the message from a `Record<Lang, ...>` map.
  `WhatsAppButton` passes the active `lang`.

### `components/App.tsx` — wiring (DONE)
- App is wrapped in `<LangProvider>` (outside `<NavProvider>`).
- `Shell` uses `useContent()` and passes `c.products[overlay.productId]` to the
  modal.

---

## Components DONE (converted to `useContent()` / `useT()` / `fill()`)
Header, StickyNav, Footer, WhatsAppButton, ProductCard, and all screens:
HomeScreen, BarsScreen, NutritionScreen, OrderingScreen, AboutScreen,
WholesaleScreen. RTL arrow flips added via `rtl:-scale-x-100` in Home + About.

---

## Remaining work (in priority order)

### 1. `lib/i18n.tsx` — add the missing string
Add to `UIStrings.modal`, `EN_UI.modal`, `AR_UI.modal`:
```ts
close: "Close",   // AR: "إغلاق"
```

### 2. `components/ProductDetailModal.tsx` — finish (~4 spots)
Already partly converted (`ui = useT()`, `const { storage } = useContent()`,
`tabs`, `allergenChips` defined; badge/close/overview rows/hero ingredients done).
Still hardcoded / broken:
- **Nutrition tab** `Per {product.servingSize.toLowerCase()}` →
  `{fill(ui.modal.per, { serving: product.servingSize })}`.
- **Storage tab** still uses removed `STORAGE.*` → use the destructured
  `storage.shelfLife / storage.keep / storage.made`, and the Row label
  `"Shelf life"` → `ui.modal.shelfLife`.
- **Allergens tab** hardcoded `["Gluten","Dairy","Nuts"].map(a => "Contains "+a)`
  → map over `allergenChips` (already defined) with
  `fill(ui.modal.contains, { a })`.
- **Sticky CTA** `/ bar · {pricePerBox} per box` →
  `{fill(ui.modal.ctaSub, { box: product.pricePerBox })}`; button
  `label="Order on WhatsApp"` → `label={ui.modal.orderCta}`.

### 3. `components/AboutDrawer.tsx` — NOT started (broken import)
Currently imports removed `BRAND, PHILOSOPHY`. Refactor:
- `const c = useContent(); const ui = useT();`
- Drawer `titles` map → `ui.drawer.aboutUs / philosophy / gifting`.
- about-us: paragraphs → `c.brand.storyLede / storyBody / storyClose`; quote
  `"Too good to share."` → `ui.drawer.quote`; `Handcrafted in {BRAND.location}.`
  → `fill(ui.drawer.handcraftedIn, { location: c.brand.location })`.
- philosophy: `PHILOSOPHY.lede/body` → `c.philosophy.lede / c.philosophy.body`.
- gifting: rows (Box quantity/10 bars, Premium gift boxes/Coming soon,
  Delivery/Bahrain only) → `ui.drawer.boxQty/boxQtyVal/giftBoxes/comingSoon/
  delivery/deliveryVal`; body text → `ui.drawer.giftingText`; WhatsApp button
  → `ui.drawer.enquire`.
- Keep the existing `useIsPresent()` pointer-events fix, drag handle, ESC.

### 4. `components/MobileMenu.tsx` — NOT started (biggest) + ADD THE TOGGLE
It still compiles (only imports `CONTACT`) but is fully English and has **no
language toggle** — the toggle is the headline feature and belongs here.
- Add `const t = useT();` and `const { lang, setLang } = useLang();`.
- `mainItems`: resolve labels from `t.menu.items.{home,bars,nutrition,about,
  ordering,wholesale,contact}` (keep the ids/`about-expand`/`contact-expand`).
- `aboutItems`: `t.menu.about.{aboutUs,philosophy,gifting,testimonials}`,
  "Coming soon" → `t.menu.comingSoon`.
- `contactItems`: labels `t.menu.contact.{email,instagram,whatsapp}` (values
  stay from `CONTACT`).
- Section headers "About"/"Contact Us" → `t.menu.aboutHeader/contactHeader`.
- Footer line "Too good to share" → `t.menu.tooGood`.
- aria: "Menu"→`t.menu.aria`, "Back"→`t.menu.back`, "Close menu"→`t.menu.close`.
- **Language toggle** (new): a small segmented control, e.g. placed just above
  the "Too good to share" footer paragraph. `t.menu.language`,
  `t.menu.langEnglish` ("English"), `t.menu.langArabic` ("العربية"). Two
  buttons calling `setLang("en")` / `setLang("ar")`, active state highlighted
  (mirror the coral pill style). Suggested skeleton:
  ```tsx
  <div className="relative z-10 mx-6 mb-4 flex gap-1 rounded-full border border-[var(--hairline)] p-1">
    {(["en","ar"] as const).map((l) => (
      <button key={l} onClick={() => setLang(l)}
        className={`flex-1 rounded-full py-2 text-[0.8rem] font-semibold ${
          lang===l ? "btn-coral text-cream" : "text-[rgba(227,210,194,0.7)]"}`}>
        {l==="en" ? t.menu.langEnglish : t.menu.langArabic}
      </button>
    ))}
  </div>
  ```
- RTL: flip `ArrowRight` / `ArrowLeft` (back) / `ArrowUpRight` with
  `rtl:-scale-x-100`; `text-left` → `text-start`. The level slide-in x-offsets
  read fine but can be sign-flipped by `dir` for polish.

### 5. RTL layout audit (after the above compiles)
- Tailwind v3.4 supports `rtl:` / `ltr:` variants natively — use for arrows and
  any left/right-specific tweaks.
- Grep for physical utilities and convert where they matter:
  `text-left`→`text-start`, `ml-`/`mr-`→`ms-`/`me-`, `pl-`/`pr-`→`ps-`/`pe-`,
  `border-l/r`→`border-s/e` (BarsScreen already uses `border-e`), absolute
  `left-`/`right-`. Most layout uses `gap`/`justify`/`flex` which mirror
  automatically, so the list should be short.
- Header 3-zone flex mirrors correctly (menu icon → right, order → left in RTL).
- Check the `Segmented` sliding pill (`layoutId`) positions correctly in RTL.

### 6. Optional polish
- **Arabic font:** current `next/font` families (Bodoni Moda / Hanken Grotesk /
  Open Sans) have poor/again-fallback Arabic glyphs. Add an Arabic webfont
  (e.g. `next/font/google` "Cairo" or "Noto Kufi Arabic") and apply it when
  `lang==="ar"` (e.g. a `[lang="ar"] body { font-family: ... }` rule in
  `app/globals.css`, or a variable set on `<html>`).
- `app/layout.tsx`: consider `suppressHydrationWarning` on `<html>` since the
  provider mutates `lang`/`dir` on the client (SSR renders English).
- `app/error.tsx` / `app/global-error.tsx`: still English (edge screens; low
  priority).

---

## Verification checklist (before calling it done)
1. `npx tsc --noEmit` passes.
2. `npm run build` passes (stop the dev server first — see README).
3. In the preview (mobile 375px):
   - Toggle EN→AR in the menu; whole UI flips to Arabic + RTL.
   - Walk every screen: Home, Bars, Nutrition (both bars, nutrition facts),
     Ordering, About, Wholesale.
   - Overlays: Menu (all levels + toggle), Product modal (all 5 tabs), About
     drawer (About Us / Philosophy / Gifting).
   - Buttons: WhatsApp links open with the **Arabic** pre-filled message
     (`wa.me/97338366111?text=...`).
   - Reload → language persists (localStorage `cc-lang`).
   - Toggle back to EN; everything returns to English + LTR.

## Notes / gotchas
- `useContent()` returns the whole bundle; destructure what you need
  (`const c = useContent();` then `c.products.cookie`, etc.).
- Don't shadow: in `ProductDetailModal` the tab map var is `tb` and translations
  are `ui` (not `t`) to avoid clashing with local `tab`.
- WhatsApp number is centralized in `lib/whatsapp.ts` (`97338366111`, override
  via `NEXT_PUBLIC_WHATSAPP_NUMBER`).
- This work is committed locally but **not pushed** (per the user's standing
  preference). Also unpushed from earlier sessions: the freeze-fix
  (`useIsPresent` pointer-events), Contact section, taglines, headline, About Us
  / Philosophy copy, menu footer text.
