import { CONTACT, CONTENT, type ProductId } from "./content";

/**
 * Canonical origin — the only host that should ever appear in a sitemap,
 * canonical tag, or structured-data URL. The apex (candycouture.co) is
 * expected to redirect here; verify against the live site rather than
 * trusting this comment, since it describes DNS/hosting the repo cannot see.
 *
 * MUST stay in sync with `metadataBase` in app/layout.tsx.
 *
 * Note: `scripts/seo-check.mjs` deliberately hardcodes this same origin rather
 * than importing it. A check that imports its expected value from the code it
 * is checking cannot detect a wrong value — keep that duplication.
 */
export const SITE_URL = "https://www.candycouture.co";

/**
 * Per-bar price in BHD, for structured data only.
 *
 * content.ts holds *localized display copy* ("1.5 BD" / "1.5 د.ب"), but
 * schema.org needs a bare number plus an ISO 4217 currency code. Parsing the
 * number back out of a localized string would break the moment the Arabic
 * formatting changes, so the numerics live here instead.
 *
 * This IS a second copy of a fact that already lives in content.ts. That is a
 * deliberate trade — but it means a price change made there and not here would
 * publish a stale price to Google, which is worse than publishing nothing. The
 * assertion below is what keeps the two honest; do not delete it.
 */
export const PRICE_PER_BAR_BHD: Record<ProductId, number> = {
  cookie: 1.5,
  protein: 1.8,
};

/**
 * Minimum order in bars, mirroring `moq` in content.ts ("10 pieces").
 *
 * Emitted as `eligibleQuantity`, which per schema.org correctly means "this
 * price applies to orders of 10 or more". Be aware Google does not surface
 * that field in product rich results, so it will NOT stop a result showing a
 * bare "BHD 1.50" — it is honest metadata for consumers that do read it, not a
 * guard against misreading. That is acceptable because the page itself also
 * says 1.5 BD per bar, so the markup matches the page, which is Google's test.
 */
export const MIN_ORDER_BARS = 10;

// ── Drift guard for the duplicated numerics above ────────────────────────────
// Runs at import time, so a mismatch fails the build rather than shipping a
// stale price. TypeScript already catches a *missing* product via the Record
// type; only value drift needs this.
for (const id of Object.keys(PRICE_PER_BAR_BHD) as ProductId[]) {
  for (const lang of ["en", "ar"] as const) {
    const p = CONTENT[lang].products[id];

    const shownPrice = Number.parseFloat(p.pricePerBar.replace(/[^\d.]/g, ""));
    if (shownPrice !== PRICE_PER_BAR_BHD[id]) {
      throw new Error(
        `Structured-data price drift: lib/seo.ts has ${id} at ${PRICE_PER_BAR_BHD[id]} ` +
          `but content.ts (${lang}) displays "${p.pricePerBar}". Update both.`,
      );
    }

    const shownMoq = Number.parseInt(p.moq.replace(/[^\d]/g, ""), 10);
    if (shownMoq !== MIN_ORDER_BARS) {
      throw new Error(
        `Structured-data MOQ drift: lib/seo.ts has MIN_ORDER_BARS=${MIN_ORDER_BARS} ` +
          `but content.ts (${lang}) displays "${p.moq}" for ${id}. Update both.`,
      );
    }
  }
}

/**
 * The schema.org graph emitted into the document head.
 *
 * Deliberately `Organization`, not `LocalBusiness`. LocalBusiness rich results
 * expect a real postal address, geo coordinates and opening hours; there is no
 * public storefront address to publish, and inventing one would be worse than
 * omitting the type. If a real address exists later, upgrade `@type` to
 * `FoodEstablishment` and add `address`, `geo` and `openingHoursSpecification`.
 *
 * English only: structured data describes the entity, not the page language,
 * and the Arabic bundle carries identical facts. The SSR'd document is
 * lang="en" and the language toggle is client-side at the same URL, so the
 * markup matches the document Google actually indexes.
 *
 * Two things here are assumptions rather than facts derived from the repo, and
 * a reader should know which:
 *  - `availability: InStock` is hardcoded. Nothing tracks stock, and nothing
 *    would notice if it stopped being true. Revisit if a product is ever paused.
 *  - `availableLanguage` says the *website* is bilingual; whether the WhatsApp
 *    sales channel is staffed in both is not something the repo can attest.
 */
export function buildJsonLd() {
  const c = CONTENT.en;

  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: c.brand.name,
    url: SITE_URL,
    // 415x95 — below Google's documented 112x112 minimum for the Organization
    // logo feature, so it likely will not qualify there. Kept because it is the
    // real mark and other consumers do read it; a dedicated square asset would
    // be needed to become eligible.
    logo: `${SITE_URL}/images/candy-couture-logo.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    description: c.hero.subtext,
    email: CONTACT.email,
    areaServed: { "@type": "Country", name: "Bahrain" },
    sameAs: [CONTACT.instagramUrl],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: CONTACT.whatsapp.replace(/\s/g, ""),
      areaServed: { "@type": "Country", name: "Bahrain" },
      availableLanguage: ["en", "ar"],
    },
  };

  const products = (Object.keys(PRICE_PER_BAR_BHD) as ProductId[]).map((id) => {
    const p = c.products[id];
    return {
      "@type": "Product",
      "@id": `${SITE_URL}/#product-${id}`,
      name: p.name,
      description: p.description,
      image: `${SITE_URL}${p.image}`,
      brand: { "@type": "Brand", name: c.brand.name },
      offers: {
        "@type": "Offer",
        price: PRICE_PER_BAR_BHD[id].toFixed(2),
        priceCurrency: "BHD",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
        seller: { "@id": `${SITE_URL}/#organization` },
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          minValue: MIN_ORDER_BARS,
          unitText: "bars",
        },
      },
    };
  });

  return { "@context": "https://schema.org", "@graph": [organization, ...products] };
}
