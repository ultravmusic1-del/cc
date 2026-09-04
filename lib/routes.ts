import type { ProductId } from "./content";

/**
 * Single source of truth for paths. The nav, the sitemap and per-page metadata
 * all read from here, so a route cannot exist in one place and be missing from
 * another — which is exactly how a page ends up unlinked and unindexed.
 */
export const ROUTES = {
  home: "/",
  bars: "/bars",
  nutrition: "/nutrition",
  ordering: "/ordering",
  wholesale: "/wholesale",
  about: "/about",
  gifting: "/gifting",
} as const;

export type RouteKey = keyof typeof ROUTES;

/** URLs stay English even when the UI is Arabic — slugs are not localized. */
export const PRODUCT_SLUGS: Record<ProductId, string> = {
  cookie: "oat-cookie-bar",
  protein: "oat-protein-bar",
};

export const productPath = (id: ProductId) => `${ROUTES.bars}/${PRODUCT_SLUGS[id]}`;

/** Reverse lookup for the [slug] route added in Task 4. */
export const productIdFromSlug = (slug: string): ProductId | null => {
  const hit = (Object.keys(PRODUCT_SLUGS) as ProductId[]).find(
    (id) => PRODUCT_SLUGS[id] === slug,
  );
  return hit ?? null;
};

/** Former hash views, for redirecting links shared before Tier 2. */
export const LEGACY_HASH_ROUTES: Record<string, string> = {
  bars: ROUTES.bars,
  nutrition: ROUTES.nutrition,
  ordering: ROUTES.ordering,
  wholesale: ROUTES.wholesale,
  about: ROUTES.about,
};
