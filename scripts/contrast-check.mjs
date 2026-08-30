#!/usr/bin/env node
/**
 * Contrast audit for the candy-slab palette.
 *
 * The design system restricts every section to one of six slab colours, and
 * children take their ink from the slab. That only stays safe if each
 * (slab background, ink) pair is actually legible — so this asserts it.
 *
 * Two slabs (coral, olive) have no brand-palette ink that clears 4.5:1. They
 * are declared display-only in globals.css and are checked against the AA
 * Large threshold (3:1) instead. If that ever stops holding, this fails.
 *
 *   npm run contrast:check
 */

const PALETTE = {
  burgundy: "#611224",
  "burgundy-deep": "#4a0d1b",
  coral: "#ec5b45",
  olive: "#9f9536",
  pink: "#e9adbe",
  beige: "#e3d2c2",
  cream: "#f4e8dc",
};

const AA_BODY = 4.5;
const AA_LARGE = 3.0;

/** Slab background -> the inks the system actually paints on it. */
const SLABS = {
  cream: { inks: ["burgundy"], role: "body" },
  beige: { inks: ["burgundy"], role: "body" },
  pink: { inks: ["burgundy"], role: "body" },
  burgundy: { inks: ["cream", "pink"], role: "body" },
  // Display-only: bold, >=24px, short lines. See globals.css.
  coral: { inks: ["burgundy"], role: "display" },
  olive: { inks: ["burgundy"], role: "display" },
};

/**
 * Coral as TEXT works only on burgundy. It measures 2.83:1 on cream, which
 * fails even AA Large — so on light slabs coral is a background and a shape
 * colour, never type. The CTA pair below is what buttons actually use.
 */
const DISPLAY_ACCENTS = [["burgundy", "coral"]];

/** --slab-cta-bg / --slab-cta-ink for each slab. Buttons carry small text. */
const CTA_PAIRS = [
  ["burgundy", "cream"],
  ["cream", "burgundy"],
];

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const hex = (name) => {
  const value = PALETTE[name];
  if (!value) throw new Error(`Unknown palette colour: ${name}`);
  return value;
};

let failed = 0;
const report = (ink, bg, threshold, label) => {
  const r = ratio(hex(bg), hex(ink));
  const ok = r >= threshold;
  if (!ok) failed++;
  console.log(
    `${ok ? "pass" : "FAIL"}  ${ink.padEnd(13)} on ${bg.padEnd(13)} ` +
      `${r.toFixed(2).padStart(6)}:1  (needs ${threshold.toFixed(1)} — ${label})`,
  );
};

console.log("Slab ink pairings\n");
for (const [bg, { inks, role }] of Object.entries(SLABS)) {
  const threshold = role === "body" ? AA_BODY : AA_LARGE;
  const label = role === "body" ? "body text" : "display only";
  for (const ink of inks) report(ink, bg, threshold, label);
}

console.log("\nDisplay accents\n");
for (const [bg, ink] of DISPLAY_ACCENTS) {
  report(ink, bg, AA_LARGE, "display only");
}

console.log("\nButton CTA pairs\n");
for (const [bg, ink] of CTA_PAIRS) {
  report(ink, bg, AA_BODY, "button label");
}

console.log(
  `\n${failed === 0 ? "All pairings pass." : `${failed} pairing(s) failed.`}`,
);
process.exit(failed === 0 ? 0 : 1);
