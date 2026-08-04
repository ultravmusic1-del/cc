#!/usr/bin/env node
// Dependency-free SEO assertions against a running build.
//
//   npm run build && npm run start -- -p 3200
//   npm run seo:check                                  # defaults to http://localhost:3200
//   npm run seo:check -- https://www.candycouture.co   # or set SEO_BASE
//
// Exits non-zero if any assertion fails, so it can gate a deploy.
//
// Every design choice below exists because a review demonstrated a false pass:
//  - redirect: "manual", so a route that 301s away is not reported as 200.
//  - Status checks are paired with body/content-type checks, so a soft-404
//    returning 200 with a small HTML error body cannot satisfy a budget.
//  - The check count is FIXED (see EXPECTED_CHECKS). Assertions are never
//    skipped, because a moving denominator makes "failures went 23 -> 17"
//    impossible to read across a sequence of tasks.
//  - get() swallows connection errors so a dead endpoint fails one check rather
//    than aborting the run. Body reads at the call sites are still unguarded.

const BASE = (process.argv[2] || process.env.SEO_BASE || "http://localhost:3200").replace(/\/+$/, "");
const CANON = "https://www.candycouture.co";

// Every route Tier 2 introduces, with a substring its title must contain.
// Substring rather than exact match so wording can be tuned without breaking
// the gate — the assertion that matters is that each title is DISTINCT.
const ROUTES = [
  { path: "/", titleContains: "Candy Couture" },
  { path: "/bars", titleContains: "Bars" },
  { path: "/bars/oat-cookie-bar", titleContains: "Oat Cookie Bar" },
  { path: "/bars/oat-protein-bar", titleContains: "Oat Protein Bar" },
  { path: "/nutrition", titleContains: "Nutrition" },
  { path: "/ordering", titleContains: "Ordering" },
  { path: "/wholesale", titleContains: "Wholesale" },
  { path: "/about", titleContains: "About" },
];

// Fixed check count. If you add or remove a check, update this — the summary
// prints a warning when the two disagree, so it cannot silently rot.
const EXPECTED_CHECKS = 85;

let passed = 0;
const failures = [];

function check(name, ok, detail = "") {
  const suffix = detail ? ` — ${detail}` : "";
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}${suffix}`);
  } else {
    failures.push(name + suffix);
    console.log(`  ✗ ${name}${suffix}`);
  }
}

async function get(path) {
  try {
    return await fetch(BASE + path, { cache: "no-store", redirect: "manual" });
  } catch (err) {
    return {
      status: 0,
      networkError: err.cause?.code || err.message,
      headers: new Headers(),
      text: async () => "",
      arrayBuffer: async () => new ArrayBuffer(0),
    };
  }
}

const statusOf = (res) =>
  res.networkError ? `network error: ${res.networkError}` : `got ${res.status}`;

/** Pull an attribute out of a tag without depending on attribute order. */
function attr(html, tagRe, name) {
  const tag = (html.match(tagRe) || [])[0] || "";
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (tag.match(new RegExp(`(?:^|\\s)${safe}="([^"]*)"`)) || [])[1];
}

async function main() {
  console.log(`SEO check against ${BASE}\n`);

  // ── the base URL itself must serve, not redirect ────────────
  const root = await get("/");
  check(
    "base URL serves directly (no redirect)",
    root.status === 200,
    root.status >= 300 && root.status < 400
      ? `${root.status} -> ${root.headers.get("location")} — point the check at the canonical host`
      : statusOf(root),
  );
  const html = root.status === 200 ? await root.text() : "";

  // ── robots.txt ──────────────────────────────────────────────
  const robots = await get("/robots.txt");
  check("robots.txt returns 200", robots.status === 200, statusOf(robots));
  const robotsBody = robots.status === 200 ? await robots.text() : "";
  const starAgent = /^\s*user-agent:\s*\*/im.test(robotsBody);
  const explicitAllow = /^\s*allow:\s*\/\s*$/im.test(robotsBody);
  const blanketBlock = /^\s*disallow:\s*\/\s*$/im.test(robotsBody);
  check(
    "robots.txt allows crawling",
    starAgent && explicitAllow && !blanketBlock,
    blanketBlock ? "found a blanket 'Disallow: /'" : "",
  );
  check("robots.txt points at the sitemap", robotsBody.includes(`${CANON}/sitemap.xml`));

  // ── sitemap.xml ─────────────────────────────────────────────
  const sitemap = await get("/sitemap.xml");
  check("sitemap.xml returns 200", sitemap.status === 200, statusOf(sitemap));
  const sitemapBody = sitemap.status === 200 ? await sitemap.text() : "";
  check("sitemap.xml is a urlset", sitemapBody.includes("<urlset"));
  check(
    "sitemap.xml lists the canonical homepage",
    sitemapBody.includes(`<loc>${CANON}/</loc>`) || sitemapBody.includes(`<loc>${CANON}</loc>`),
  );

  // ── homepage head ───────────────────────────────────────────
  const canonHref = attr(html, /<link[^>]*rel="canonical"[^>]*>/i, "href");
  check(
    "canonical points at the www host",
    canonHref === `${CANON}/` || canonHref === CANON,
    canonHref ? `got ${canonHref}` : "absent",
  );

  const ogUrl = attr(html, /<meta[^>]*property="og:url"[^>]*>/i, "content");
  check(
    "og:url points at the canonical URL",
    ogUrl === `${CANON}/` || ogUrl === CANON,
    ogUrl ? `got ${ogUrl}` : "absent",
  );

  // ── every route: 200, unique title, self-referencing canonical ───
  const seenTitles = new Set();
  for (const route of ROUTES) {
    const res = await get(route.path);
    check(`${route.path} returns 200`, res.status === 200, statusOf(res));
    const routeHtml = res.status === 200 ? await res.text() : "";

    const title = (routeHtml.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    check(`${route.path} title mentions "${route.titleContains}"`,
      title.includes(route.titleContains), title ? `got "${title}"` : "no title");
    check(`${route.path} title is unique`, title !== "" && !seenTitles.has(title), title);
    seenTitles.add(title);

    const href = attr(routeHtml, /<link[^>]*rel="canonical"[^>]*>/i, "href");
    const want = route.path === "/" ? CANON : CANON + route.path;
    check(`${route.path} canonical is self-referencing`, href === want,
      href ? `got ${href}` : "absent");

    // The scroll model: each route must ship its own .screen-scroll container.
    // See HANDOFF.md — this is the iOS Safari fix and must not silently vanish.
    check(`${route.path} has a .screen-scroll container`,
      routeHtml.includes("screen-scroll"));

    check(`${route.path} is listed in the sitemap`, sitemapBody.includes(`<loc>${want}</loc>`));
  }

  // ── product pages must contain the detail, not just a shell ──────
  for (const [path, needles] of [
    ["/bars/oat-cookie-bar", ["1.5 BD", "Ingredients", "Allergens", "Contains gluten"]],
    ["/bars/oat-protein-bar", ["1.8 BD", "Ingredients", "Allergens", "Contains gluten"]],
  ]) {
    const res = await get(path);
    const body = res.status === 200 ? await res.text() : "";
    for (const needle of needles) {
      check(`${path} server-renders "${needle}"`, body.includes(needle));
    }
  }

  // ── the listing page must link to both product pages ────────────
  const barsRes = await get("/bars");
  const barsHtml = barsRes.status === 200 ? await barsRes.text() : "";
  for (const slug of ["oat-cookie-bar", "oat-protein-bar"]) {
    check(`/bars links to /bars/${slug}`, barsHtml.includes(`/bars/${slug}`));
  }

  // Tier 1 left the site with 227 characters of indexable text. If this does
  // not move, Tier 2 achieved nothing regardless of how many routes exist.
  let totalText = 0;
  for (const route of ROUTES) {
    const res = await get(route.path);
    if (res.status !== 200) continue;
    const body = (await res.text())
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    totalText += body.length;
  }
  check("indexable text across all routes exceeds 5000 chars", totalText > 5000, `${totalText} chars`);

  // ── structured data (always 5 checks, never skipped) ─────────
  const ldBlocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
  ].map((m) => m[1]);
  check("JSON-LD block present", ldBlocks.length > 0, `found ${ldBlocks.length}`);

  const nodes = [];
  let parsedAll = ldBlocks.length > 0;
  for (const raw of ldBlocks) {
    try {
      const parsed = JSON.parse(raw);
      const graph = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed["@graph"])
          ? parsed["@graph"]
          : [parsed];
      nodes.push(...graph);
    } catch {
      parsedAll = false;
    }
  }
  check("JSON-LD parses as valid JSON", parsedAll && nodes.length > 0);
  check(
    "JSON-LD includes an Organization",
    nodes.some((n) => n && n["@type"] === "Organization"),
  );
  const products = nodes.filter((n) => n && n["@type"] === "Product");
  check("JSON-LD includes both products", products.length === 2, `found ${products.length}`);
  check(
    "every product carries a BHD offer",
    products.length === 2 &&
      products.every(
        (p) => p.offers && p.offers.priceCurrency === "BHD" && Number(p.offers.price) > 0,
      ),
  );

  // ── regression guard: never lose Search Console ─────────────
  const gsc = await get("/google84764bf90bc17c8e.html");
  check("Search Console verification file still served", gsc.status === 200, statusOf(gsc));
  const gscBody = gsc.status === 200 ? await gsc.text() : "";
  check(
    "Search Console file still carries the right token",
    gscBody.trim() === "google-site-verification: google84764bf90bc17c8e.html",
  );

  // ── the heavy v2 mask icons must be gone, not merely unused ──
  for (const legacy of ["wholegrain-oats", "dark-chocolate-chunks", "smart-snacking"]) {
    const res = await get(`/images/icons/${legacy}-v2.png`);
    check(`legacy ${legacy}-v2.png removed`, res.status === 404, statusOf(res));
  }

  // ── ...and the page must actually reference the v3 replacements ──
  // Deleting the old files and rewiring lib/content.ts are separate edits.
  // Without this, task 6 can delete the v2 icons, add small v3 files, pass
  // every budget, and ship a homepage rendering three invisible icons.
  for (const n of ["wholegrain-oats", "dark-chocolate-chunks", "smart-snacking"]) {
    check(`homepage references ${n}-v3.png`, html.includes(`/images/icons/${n}-v3.png`));
  }

  // ── asset weight budgets ────────────────────────────────────
  const budgets = [
    ["/icon.png", 20],
    ["/images/icons/wholegrain-oats-v3.png", 20],
    ["/images/icons/dark-chocolate-chunks-v3.png", 20],
    ["/images/icons/smart-snacking-v3.png", 20],
  ];
  for (const [path, maxKB] of budgets) {
    const res = await get(path);
    if (res.status !== 200) {
      check(`${path} under ${maxKB}KB`, false, statusOf(res));
      continue;
    }
    const type = res.headers.get("content-type") || "";
    if (!type.startsWith("image/")) {
      check(`${path} under ${maxKB}KB`, false, `not an image (${type || "no content-type"})`);
      continue;
    }
    const bytes = (await res.arrayBuffer()).byteLength;
    const kb = Math.round(bytes / 1024);
    check(`${path} under ${maxKB}KB`, bytes > 0 && kb <= maxKB, bytes === 0 ? "empty file" : `${kb}KB`);
  }

  // ── summary ─────────────────────────────────────────────────
  console.log(`\n${passed} passed, ${failures.length} failed`);
  const total = passed + failures.length;
  if (total !== EXPECTED_CHECKS) {
    console.log(`\n(note: ${total} checks ran but EXPECTED_CHECKS is ${EXPECTED_CHECKS} — update the constant)`);
  }
  if (failures.length) {
    console.log("\nFailed:");
    for (const f of failures) console.log(`  ✗ ${f}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(`\nSEO check aborted against ${BASE}`);
  console.error(`  ${err.message}`);
  console.error(`  Is the server running?  npm run build && npm run start -- -p 3200`);
  process.exitCode = 1;
});
