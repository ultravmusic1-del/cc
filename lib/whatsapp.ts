// ─────────────────────────────────────────────────────────────
// WhatsApp ordering config. Set the number via NEXT_PUBLIC_WHATSAPP_NUMBER
// (Vercel env or .env.local); falls back to the Candy Couture line.
// The pre-filled message follows the active site language.
// ─────────────────────────────────────────────────────────────

import type { Lang } from "./content";

// Candy Couture ordering line (+973 37366111), international, digits only.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "97337366111";

export type WhatsAppIntent = "general" | "cookie" | "protein" | "wholesale";

const messages: Record<Lang, Record<WhatsAppIntent, string>> = {
  en: {
    general: "Hi Candy Couture, I would like to place an order.",
    cookie: "Hi Candy Couture, I would like to order the Oat Cookie Bar.",
    protein: "Hi Candy Couture, I would like to order the Oat Protein Bar.",
    wholesale:
      "Hi Candy Couture, I would like to enquire about wholesale orders.",
  },
  ar: {
    general: "مرحبًا كاندي كوتور، أودّ تقديم طلب.",
    cookie: "مرحبًا كاندي كوتور، أودّ طلب لوح شوفان الكوكيز.",
    protein: "مرحبًا كاندي كوتور، أودّ طلب لوح شوفان البروتين.",
    wholesale: "مرحبًا كاندي كوتور، أودّ الاستفسار عن طلبات الجملة.",
  },
};

export function whatsappLink(
  intent: WhatsAppIntent = "general",
  lang: Lang = "en",
): string {
  const text = encodeURIComponent(messages[lang][intent]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
