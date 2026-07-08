# Candy Couture

A premium, mobile-first microsite for **Candy Couture** — a Bahrain-based handcrafted oat-bar brand. Burgundy-led, click-driven (full-screen panels, bottom sheets, drawers and a bottom nav rather than one long scroll), with WhatsApp ordering.

> Launching July 2026 · Handcrafted in Bahrain

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **lucide-react** for icons
- Fonts via `next/font`: Bodoni Moda (couture wordmark), Hanken Grotesk (headings), Open Sans (body)

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the WhatsApp number
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

> **Note:** never run `npm run build` while `npm run dev` is running — both write to `.next` and it corrupts the dev cache. If a page renders unstyled, stop the dev server, delete `.next`, and run `npm run dev` again.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number that receives WhatsApp orders — international format, digits only (e.g. `973XXXXXXXX`). Falls back to a placeholder until set. |

All product facts (prices, nutrition, ingredients, ordering rules) live in [`lib/content.ts`](lib/content.ts) as a single source of truth.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository. Vercel auto-detects Next.js — no config needed (build: `next build`, output handled automatically).
3. Add the environment variable **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (Production + Preview) under **Settings → Environment Variables**.
4. Deploy.

## Project structure

```
app/                 # App Router entry, layout, global styles, metadata
components/           # Header, StickyNav, MobileMenu, ProductCard, modals…
  screens/           # Home, Bars, Nutrition, About, Ordering, Wholesale
  ui/                # Small primitives (WhatsApp button, segmented, icons)
lib/                 # content.ts (source of truth), store.tsx (nav), whatsapp.ts
public/images/       # Product photography
```

## To do before launch

- Set the real `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Replace `public/images/oat-bar-hero.png` with final product photography (both bars currently share one image, differentiated by card accent).
