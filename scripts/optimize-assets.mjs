#!/usr/bin/env node
// One-shot image downsizing. Re-runnable; only needs running when the source
// artwork changes.
//
//   npm run assets:optimize
//
// icon.png is overwritten in place because Next content-hashes the favicon URL
// (/icon.png?<hash>), so caches bust automatically. The mask icons are served
// straight from public/ with a stable URL, so they get a -v3 suffix instead —
// the same cache-busting convention the repo already uses for -v2.
//
// 144px is 3x the 48px display size. MaskIcon renders these as flat
// single-colour silhouettes via CSS mask-image, so detail beyond that is
// invisible. Sources were 642-886px squares (and the favicon 1276px), i.e.
// 4-13x more resolution than anything could show.

import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const JOBS = [
  { from: "app/icon.png", to: "app/icon.png", size: 96 },
  {
    from: "public/images/icons/wholegrain-oats-v2.png",
    to: "public/images/icons/wholegrain-oats-v3.png",
    size: 144,
  },
  {
    from: "public/images/icons/dark-chocolate-chunks-v2.png",
    to: "public/images/icons/dark-chocolate-chunks-v3.png",
    size: 144,
  },
  {
    from: "public/images/icons/smart-snacking-v2.png",
    to: "public/images/icons/smart-snacking-v3.png",
    size: 144,
  },
];

for (const job of JOBS) {
  const before = (await readFile(job.from)).byteLength;
  const out = await sharp(job.from)
    .resize(job.size, job.size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(job.to, out);
  const kb = (n) => Math.round(n / 1024);
  console.log(`${job.from} -> ${job.to}   ${kb(before)}KB -> ${kb(out.byteLength)}KB`);
}
