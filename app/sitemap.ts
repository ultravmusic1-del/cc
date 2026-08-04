import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Generates /sitemap.xml at build time.
 *
 * One entry today: the whole site is a single route — every "screen" is
 * client-side view state, and the rendered page contains no `<a>` tags at all.
 * So this declares the structure explicitly rather than doing real discovery
 * work, since the one URL here is the one a crawler already has. It starts
 * earning its keep when Tier 2 adds real routes (/bars, /nutrition, /ordering,
 * /wholesale, /about and the two product pages) — add them here.
 *
 * No `lastModified` on purpose. It would evaluate at build time, so every
 * deploy — including doc-only commits — would stamp a date the content never
 * earned. Google only trusts lastmod where it proves accurate, and teaching it
 * to distrust this property now would forfeit the signal exactly when Tier 2
 * makes it worth having. An absent lastmod is handled fine.
 *
 * `url` is bare `SITE_URL`, not `${SITE_URL}/`, to match the canonical tag:
 * Next collapses a root path to `origin` when resolving metadata URLs, so
 * `alternates.canonical` emits no trailing slash no matter how it is written.
 * (The two forms are equivalent under RFC 3986, so this is tidiness, not a fix.)
 *
 * `priority` and `changeFrequency` are ignored by Google and Bing. Kept because
 * they are schema-valid and harmless — but don't tune them, and don't copy
 * `priority: 1` onto every Tier 2 route, where it stays meaningless (priority
 * is relative to other URLs on the same site).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
