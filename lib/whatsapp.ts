// ─────────────────────────────────────────────────────────────
// WhatsApp ordering config. Set the number via NEXT_PUBLIC_WHATSAPP_NUMBER
// (Vercel env or .env.local); falls back to the Candy Couture line.
// The pre-filled message follows the active site language.
// ─────────────────────────────────────────────────────────────

import type { Lang } from "./content";

// Candy Couture ordering line (+973 38366111), international, digits only.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "97338366111";

export type WhatsAppIntent =
  | "general"
  | "cookie"
  | "protein"
  | "wholesale"
  | "gifting"
  | "giftSix"
  | "giftTwelve";

const messages: Record<Lang, Record<WhatsAppIntent, string>> = {
  en: {
    general: "Hi Candy Couture, I would like to place an order.",
    cookie: "Hi Candy Couture, I would like to order the Oat Cookie Bar.",
    protein: "Hi Candy Couture, I would like to order the Oat Protein Bar.",
    wholesale:
      "Hi Candy Couture, I would like to enquire about wholesale orders.",
    gifting: "Hi Candy Couture, I would like to order a gift box.",
    giftSix:
      "Hi Candy Couture, I would like to order the Gift Box of 6 (3 Oat Cookie + 3 Oat Protein).",
    giftTwelve:
      "Hi Candy Couture, I would like to order the Gift Box of 12 (6 Oat Cookie + 6 Oat Protein).",
  },
  ar: {
    general: "مرحبًا كاندي كوتور، أودّ تقديم طلب.",
    cookie: "مرحبًا كاندي كوتور، أودّ طلب لوح شوفان الكوكيز.",
    protein: "مرحبًا كاندي كوتور، أودّ طلب لوح شوفان البروتين.",
    wholesale: "مرحبًا كاندي كوتور، أودّ الاستفسار عن طلبات الجملة.",
    gifting: "مرحبًا كاندي كوتور، أودّ طلب علبة هدايا.",
    giftSix:
      "مرحبًا كاندي كوتور، أودّ طلب علبة الهدايا من 6 ألواح (3 كوكيز + 3 بروتين).",
    giftTwelve:
      "مرحبًا كاندي كوتور، أودّ طلب علبة الهدايا من 12 لوحًا (6 كوكيز + 6 بروتين).",
  },
};

export function whatsappLink(
  intent: WhatsAppIntent = "general",
  lang: Lang = "en",
): string {
  const text = encodeURIComponent(messages[lang][intent]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
