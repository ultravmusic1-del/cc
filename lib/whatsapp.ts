// ─────────────────────────────────────────────────────────────
// WhatsApp ordering config.
// Set the number via the NEXT_PUBLIC_WHATSAPP_NUMBER environment
// variable (in Vercel → Settings → Environment Variables, or a local
// .env.local). International format, digits only — no "+" or spaces.
// Falls back to the placeholder until it is provided.
// ─────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "XXXXXXXXXXX";

const messages = {
  general: "Hi Candy Couture, I would like to place an order.",
  cookie: "Hi Candy Couture, I would like to order the Oat Cookie Bar.",
  protein: "Hi Candy Couture, I would like to order the Oat Protein Bar.",
  wholesale:
    "Hi Candy Couture, I would like to enquire about wholesale orders.",
} as const;

export type WhatsAppIntent = keyof typeof messages;

export function whatsappLink(intent: WhatsAppIntent = "general"): string {
  const text = encodeURIComponent(messages[intent]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
