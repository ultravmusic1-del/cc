import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { ROUTES, PRODUCT_SLUGS } from "@/lib/routes";

/**
 * Generates /sitemap.xml at build time.
 *
 * Derived from `lib/routes.ts` rather than hand-listed, so a route cannot exist
 * in the nav and be missing here — which is exactly how a page ends up crawled
 * late or not at all.
 *
 * ⚠️ The home entry MUST stay bare `SITE_URL` with no trailing slash. Next
 * collapses a root path to `origin` when resolving metadata URLs, so
 * `alternates.canonical` emits no trailing slash however it is written, and
 * `scripts/seo-check.mjs` derives its canonical and sitemap expectations
 * identically. Adding a slash here flips two assertions red at once.
 *
 * No `lastModified` on purpose. It would evaluate at build time, so every
 * deploy — including doc-only commits — would stamp a date the content never
 * earned. Google only trusts lastmod where it proves accurate, and teaching it
 * to distrust this property would forfeit the signal exactly when it starts
 * being worth having. An absent lastmod is handled fine.
 *
 * `priority` and `changeFrequency` are ignored by Google and Bing. Kept because
 * they are schema-valid and harmless — don't spend time tuning them. Home is 1
 * and everything else 0.8 purely to express "this is the entry point"; priority
 * is relative within one site and carries no cross-site meaning.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: string[] = [
    ...Object.values(ROUTES),
    ...Object.values(PRODUCT_SLUGS).map((slug) => `${ROUTES.bars}/${slug}`),
  ];

  return paths.map((path) => ({
    url: path === ROUTES.home ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === ROUTES.home ? 1 : 0.8,
  }));
}
