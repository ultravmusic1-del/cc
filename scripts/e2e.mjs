#!/usr/bin/env node
// Build into .next-e2e (so a running `npm run dev` is untouched), then run
// Playwright against it. Extra args pass through to `playwright test`.
//
//   npm run test:e2e                     # build + full suite
//   npm run test:e2e -- --no-build       # reuse the last .next-e2e build
//   npm run test:e2e -- -g "pop-up"      # filter by test name

import { spawnSync } from "node:child_process";

const env = { ...process.env, NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next-e2e" };
const args = process.argv.slice(2);

// `shell` is needed so `npx` resolves on Windows; passing one quoted command
// string (rather than an args array) is how Node wants that done.
const quote = (a) => (/[\s"&|<>^]/.test(a) ? JSON.stringify(a) : a);

function run(command) {
  const r = spawnSync(command, { stdio: "inherit", env, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!args.includes("--no-build")) run("npx next build");
run(["npx playwright test", ...args.filter((a) => a !== "--no-build").map(quote)].join(" "));
