import { track } from "@vercel/analytics";

/**
 * Custom events for Vercel Web Analytics. Every event goes through here so the
 * names stay stable — renaming one splits its history in the dashboard.
 *
 * Kept to at most two properties per event, which fits every plan's limit.
 * Page views are already recorded by <Analytics /> in app/layout.tsx; these
 * cover what page views can't see: clicks that leave the site, and the popup.
 */

/** The site's conversion: every order and enquiry happens on WhatsApp. */
export function trackWhatsApp(intent: string, page: string) {
  track("WhatsApp Click", { intent, page });
}

export function trackContact(channel: "email" | "instagram", page: string) {
  track("Contact Click", { channel, page });
}

export function trackGiftingPromo(action: "shown" | "explore" | "dismiss") {
  track("Gifting Promo", { action });
}

export function trackLanguage(lang: string) {
  track("Language Change", { lang });
}
