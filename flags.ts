import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

/**
 * Feature flags, managed in the Vercel dashboard (cc → Flags).
 *
 * On Vercel the adapter authenticates with the deployment's OIDC token, so no
 * key is needed. Anywhere it can't reach Vercel Flags (local dev without
 * `vercel env pull`, an outage) the flag resolves to `defaultValue` — so each
 * default must be the behaviour the site should have when flags are down.
 *
 * Server-only. The client reads flags through app/api/flags/route.ts so the
 * pages themselves stay statically rendered.
 */

export const giftingPromoFlag = flag<boolean>({
  key: "gifting-promo",
  description: "Show the gifting-collection launch pop-up",
  adapter: vercelAdapter(),
  defaultValue: true,
});
