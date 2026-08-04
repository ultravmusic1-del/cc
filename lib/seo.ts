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
