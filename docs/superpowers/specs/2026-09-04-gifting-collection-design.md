# Gifting Collection — design

Date: 2026-09-04. Requested by Vivaan. Built autonomously from a detailed brief;
the assumptions below are the decisions the brief left open.

## Goal

Launch the gifting collection on the site: a real `/gifting` route, a header
entry, removal of the old "gift packs coming soon" copy, and a one-time launch
pop-up that links to the new page. Bilingual, RTL-correct, on-brand.

## Facts (source of truth: `lib/content.ts` → `gifting`)

| Box | Contents | Price |
| --- | --- | --- |
| Gift Box of 6 | 3 Oat Cookie Bars + 3 Oat Protein Bars | 12 BD |
| Gift Box of 12 | 6 Oat Cookie Bars + 6 Oat Protein Bars | 20 BD |

Numeric prices are duplicated in `lib/seo.ts` for JSON-LD, guarded by the same
import-time drift check the bars use.

## Route and navigation

- `ROUTES.gifting = "/gifting"`. Sitemap, canonical and og:url derive from it.
- Desktop header nav: Bars · Nutrition · Order · **Gifting** · Menu.
- Mobile menu main list gains a **Gifting** row after Bars. The About sub-level
  drops its "Gifting" entry (it is a main destination now).
- The bottom sticky nav stays at four items: a fifth crowds 375px, and the
  header brief did not ask for it. Mobile discovery comes from the menu, the
  pop-up and the About page.
- About page: the "Gifting & Wholesale" drawer card becomes two link cards,
  **Gifting** → `/gifting` and **Wholesale** → `/wholesale`. The gifting
  drawer and its store id are deleted. This also gives `/wholesale` its first
  server-rendered inbound link.

## Gifting page (`components/screens/GiftingScreen.tsx`)

`ScreenShell` page, same chrome as the other screens. Mobile: hero image in a
rounded frame, then two box cards, then a details card, closing line and
WhatsApp CTA. Desktop: image left, copy and cards right, capped at 880px like
`/bars`.

Image: `public/images/gift-box-v1.jpg` (1200×1803, 110 KB) produced from the
supplied `gifting image 1.JPG`. Its burgundy backdrop matches the stage, so it
is blended with a soft edge gradient instead of a hard frame.

Each box card is a `glass-card` with name, contents, price, and a WhatsApp
button carrying a per-box intent (`giftSix` / `giftTwelve`) so the pre-filled
message names the box.

Details shown: delivery Bahrain only, 2 BD (free over 50 BD), order before
2 PM for next-day, shelf life 15 days. **Assumption:** the 10-bar minimum does
not apply to gift boxes (a 6-bar box at 12 BD implies it), so no minimum is
stated on this page.

## Pop-up (`components/GiftingPopup.tsx`)

Modeled on the reference: a centred card, close icon top-end, bold title, two
supporting lines, solid primary CTA and outlined secondary. Ours: a `panel-bg`
card with a cropped strip of the gift image on top, eyebrow "New", title, one
line of copy, **Explore Gifting** (coral, links to `/gifting`) and
**Continue browsing** (ghost).

Behaviour: opens 1.4 s after first mount, once per browser session
(`sessionStorage["cc-gifting-promo"]`), never on `/gifting`, never while
another overlay is open. Registered as a store overlay (`promo`) so the shared
scroll lock and Escape handling apply. No `layoutId` anywhere (HANDOFF rule).

## Removals

- Wholesale screen: eyebrow "For business", title "Wholesale", the
  "Premium gift packs — Coming soon" row becomes "Events & bulk orders —
  Handled personally". Page title and description drop "gifting".
- About drawer: gifting branch and its strings removed.

## SEO harness

`scripts/seo-check.mjs`: `/gifting` added to `ROUTES` (title must contain
"Gifting"), two content assertions for "12 BD" and "20 BD", JSON-LD product
count raised from 2 to 4. `EXPECTED_CHECKS` 101 → 111.

## Verification

`npx tsc --noEmit`, `npm run build`, `npm run seo:check` against a local
production build on port 3200, then a browser pass at 375×812 and 1440×900 in
English and Arabic: page layout, header entry, menu rows, pop-up open/close,
pop-up suppressed on `/gifting`, no horizontal overflow.
