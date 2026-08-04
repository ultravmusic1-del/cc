import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Generates /robots.txt at build time (static — it cannot fail at runtime).
 *
 * The `Sitemap` line is the point of the file. A missing robots.txt is NOT a
 * crawl blocker — Google treats a 404 here as allow-all — so this does not
 * unblock anything. What it does is give crawlers an explicit allow-all plus a
 * pointer to the sitemap, which is real discovery help on a site whose only
 * internal navigation is client-side view state with no crawlable links.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
