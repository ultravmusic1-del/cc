import { buildJsonLd } from "@/lib/seo";

/**
 * Emits the schema.org graph as JSON-LD.
 *
 * A server component on purpose: this has to land in the initial HTML. The rest
 * of the site's content is client-rendered behind view state and is effectively
 * invisible to crawlers, so until Tier 2 introduces real routes this block is
 * the only machine-readable description of the products that exists.
 *
 * `<` is escaped because a literal "</script>" appearing anywhere in the
 * serialised content would otherwise close this tag early.
 */
export default function JsonLd() {
  const json = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
