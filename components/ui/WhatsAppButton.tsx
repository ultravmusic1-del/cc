"use client";

import { motion } from "framer-motion";
import { whatsappLink, type WhatsAppIntent } from "@/lib/whatsapp";
import { useLang, useT } from "@/lib/i18n";

/** Simple inline WhatsApp glyph so we don't pull in a brand-icon pack. */
function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.06 8.06 0 0 1 2.37 5.73c0 4.47-3.64 8.1-8.11 8.1-1.5 0-2.98-.4-4.26-1.17l-.31-.18-3.15.82.84-3.07-.2-.32a8.05 8.05 0 0 1-1.24-4.3c0-4.47 3.64-8.1 8.1-8.1Zm-2.9 4.4c-.14 0-.36.05-.55.26-.19.2-.72.7-.72 1.72s.74 2 .84 2.14c.1.13 1.44 2.2 3.5 3.08.49.21.87.34 1.17.44.49.16.94.13 1.29.08.39-.06 1.2-.49 1.37-.96.17-.47.17-.88.12-.96-.05-.08-.19-.13-.4-.24-.2-.1-1.2-.6-1.39-.66-.19-.07-.32-.1-.46.1-.13.2-.52.65-.64.79-.12.13-.24.15-.44.05-.2-.1-.85-.31-1.62-1-.6-.53-1-1.19-1.12-1.39-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.11-.62-1.52-.16-.4-.33-.34-.45-.35l-.38-.01Z" />
    </svg>
  );
}

interface Props {
  intent?: WhatsAppIntent;
  label?: string;
  variant?: "outline" | "solid";
  className?: string;
  onClick?: () => void;
}

export default function WhatsAppButton({
  intent = "general",
  label,
  variant = "outline",
  className = "",
  onClick,
}: Props) {
  const { lang } = useLang();
  const t = useT();
  const text = label ?? t.whatsapp.defaultLabel;
  const base =
    "inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors";
  const styles =
    variant === "solid"
      ? "bg-[#1f7a4d] text-cream hover:bg-[#228855]"
      : "border border-[rgba(159,149,54,0.55)] bg-[rgba(58,10,21,0.5)] text-[#cfe0b5] hover:border-olive hover:text-cream";

  return (
    <motion.a
      href={whatsappLink(intent, lang)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles} ${className}`}
      aria-label={`${t.whatsapp.ariaPrefix} — ${text}`}
    >
      <WhatsAppGlyph className="h-[18px] w-[18px]" />
      {text}
    </motion.a>
  );
}
