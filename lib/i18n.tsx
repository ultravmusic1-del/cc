"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CONTENT, type ContentBundle, type Lang } from "./content";

// ── UI strings (component-level copy) ─────────────────────────
export interface UIStrings {
  nav: { bars: string; nutrition: string; order: string; menu: string };
  header: { openMenu: string; home: string; ordering: string };
  menu: {
    aria: string;
    back: string;
    close: string;
    language: string;
    langEnglish: string;
    langArabic: string;
    items: {
      home: string;
      bars: string;
      nutrition: string;
      about: string;
      ordering: string;
      wholesale: string;
      contact: string;
    };
    aboutHeader: string;
    contactHeader: string;
    about: {
      aboutUs: string;
      philosophy: string;
      gifting: string;
      testimonials: string;
    };
    comingSoon: string;
    contact: { email: string; instagram: string; whatsapp: string };
    tooGood: string;
  };
  home: {
    eyebrow: string;
    line1: string;
    line2: string;
    line3: string;
    chooseBar: string;
    ourStory: string;
  };
  bars: {
    eyebrow: string;
    title: string;
    tagline: string;
    onePack: string;
    onePackVal: string;
    wholesale: string;
    wholesaleVal: string;
    delivery: string;
    deliveryVal: string;
    boxNote: string; // uses {n}
  };
  nutrition: {
    eyebrow: string;
    title: string;
    subtitle: string;
    per: string; // "Per {serving}"
    segCookie: string;
    segProtein: string;
    orderThe: string; // "Order the {name}"
  };
  ordering: {
    eyebrow: string;
    title: string;
    subtitle: string;
    minimum: string;
    deliveryArea: string;
    deliveryFee: string;
    freeOver: string;
    payment: string;
    cutoff: string;
    wholesaleNote: string;
    orderCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    aboutUsT: string;
    aboutUsN: string;
    philosophyT: string;
    philosophyN: string;
    giftingT: string;
    giftingN: string;
    testimonialsT: string;
    comingSoon: string;
  };
  wholesale: {
    eyebrow: string;
    title: string;
    subtitle: string;
    p: { t: string; n: string }[];
    closing: string;
    enquire: string;
  };
  card: {
    highProtein: string;
    classic: string;
    perBar: string;
    perBoxOf10: string; // "{price} per box of 10"
    boxMin: string;
    whatsapp: string;
    viewDetails: string;
  };
  modal: {
    badgeHigh: string;
    badgeClassic: string;
    tabs: {
      overview: string;
      ingredients: string;
      nutrition: string;
      storage: string;
      allergens: string;
    };
    servingSize: string;
    price: string;
    perBox: string;
    minimumOrder: string;
    shelfLife: string;
    made: string;
    madeVal: string;
    perBarSlash: string; // "{price} / bar"
    boxLine: string; // "{price} · 10 bars"
    heroIngredients: string;
    per: string; // "Per {serving}"
    contains: string; // "Contains {a}"
    gluten: string;
    dairy: string;
    nuts: string;
    ctaSub: string; // "/ bar · {box} per box"
    orderCta: string;
    close: string;
  };
  drawer: {
    aboutUs: string;
    philosophy: string;
    gifting: string;
    quote: string;
    handcraftedIn: string; // "Handcrafted in {location}."
    boxQty: string;
    boxQtyVal: string;
    giftBoxes: string;
    comingSoon: string;
    delivery: string;
    deliveryVal: string;
    giftingText: string;
    enquire: string;
  };
  whatsapp: { defaultLabel: string; ariaPrefix: string };
  footer: { copyright: string }; // "© {year} Candy Couture · Bahrain"
}

const EN_UI: UIStrings = {
  nav: { bars: "Bars", nutrition: "Nutrition", order: "Order", menu: "Menu" },
  header: {
    openMenu: "Open menu",
    home: "Candy Couture — home",
    ordering: "Ordering information",
  },
  menu: {
    aria: "Menu",
    back: "Back",
    close: "Close menu",
    language: "Language",
    langEnglish: "English",
    langArabic: "العربية",
    items: {
      home: "Home",
      bars: "Bars",
      nutrition: "Nutrition",
      about: "About",
      ordering: "Ordering",
      wholesale: "Wholesale",
      contact: "Contact",
    },
    aboutHeader: "About",
    contactHeader: "Contact Us",
    about: {
      aboutUs: "About Us",
      philosophy: "Product Philosophy",
      gifting: "Gifting",
      testimonials: "Brand Testimonials",
    },
    comingSoon: "Coming soon",
    contact: { email: "Email", instagram: "Instagram", whatsapp: "WhatsApp" },
    tooGood: "Too good to share",
  },
  home: {
    eyebrow: "Handcrafted in Bahrain",
    line1: "Real ingredients.",
    line2: "Freshly baked.",
    line3: "Too good to share",
    chooseBar: "Choose Your Bar",
    ourStory: "Our Story",
  },
  bars: {
    eyebrow: "The Collection",
    title: "Choose your bar",
    tagline: "Wholesome ingredients. Indulgent taste.",
    onePack: "One pack",
    onePackVal: "10 bars",
    wholesale: "Wholesale",
    wholesaleVal: "Options available",
    delivery: "Delivery",
    deliveryVal: "Across Bahrain",
    boxNote: "One box equals {n}. Minimum order 10.",
  },
  nutrition: {
    eyebrow: "Know your bar",
    title: "Nutrition",
    subtitle: "Honest numbers for every bar.",
    per: "Per {serving}",
    segCookie: "Oat Cookie",
    segProtein: "Oat Protein",
    orderThe: "Order the {name}",
  },
  ordering: {
    eyebrow: "How it works",
    title: "Ordering",
    subtitle: "Order before 2 PM for next-day delivery.",
    minimum: "Minimum order",
    deliveryArea: "Delivery area",
    deliveryFee: "Delivery fee",
    freeOver: "Free delivery over",
    payment: "Payment",
    cutoff: "Order cutoff",
    wholesaleNote:
      "Wholesale orders are handled personally — just say hello on WhatsApp.",
    orderCta: "Order on WhatsApp",
  },
  about: {
    eyebrow: "Our Story",
    title: "Indulgent, honestly made.",
    aboutUsT: "About Us",
    aboutUsN: "Why we started Candy Couture",
    philosophyT: "Product Philosophy",
    philosophyN: "Real ingredients, no shortcuts",
    giftingT: "Gifting & Wholesale",
    giftingN: "Boxes, bulk & business orders",
    testimonialsT: "Brand Testimonials",
    comingSoon: "Coming soon",
  },
  wholesale: {
    eyebrow: "For business & gifting",
    title: "Wholesale & Gifting",
    subtitle: "Boutique bars, at scale.",
    p: [
      { t: "Wholesale orders", n: "Available through WhatsApp" },
      { t: "Box quantity", n: "10 bars per box" },
      { t: "Premium gift boxes", n: "Coming soon" },
      { t: "Delivery", n: "Bahrain only" },
    ],
    closing: "Tell us what you need and we'll take care of the rest.",
    enquire: "Enquire on WhatsApp",
  },
  card: {
    highProtein: "High Protein",
    classic: "Classic",
    perBar: "/bar",
    perBoxOf10: "{price} per box of 10",
    boxMin: "Box of 10 · Min. 10",
    whatsapp: "WhatsApp",
    viewDetails: "View Details",
  },
  modal: {
    badgeHigh: "High Protein",
    badgeClassic: "Classic",
    tabs: {
      overview: "Overview",
      ingredients: "Ingredients",
      nutrition: "Nutrition",
      storage: "Storage",
      allergens: "Allergens",
    },
    servingSize: "Serving size",
    price: "Price",
    perBox: "Per box",
    minimumOrder: "Minimum order",
    shelfLife: "Shelf life",
    made: "Made",
    madeVal: "Handmade in Bahrain",
    perBarSlash: "{price} / bar",
    boxLine: "{price} · 10 bars",
    heroIngredients: "Hero ingredients",
    per: "Per {serving}",
    contains: "Contains {a}",
    gluten: "Gluten",
    dairy: "Dairy",
    nuts: "Nuts",
    ctaSub: "/ bar · {box} per box",
    orderCta: "Order on WhatsApp",
    close: "Close",
  },
  drawer: {
    aboutUs: "About Us",
    philosophy: "Product Philosophy",
    gifting: "Gifting & Wholesale",
    quote: "Too good to share.",
    handcraftedIn: "Handcrafted in {location}.",
    boxQty: "Box quantity",
    boxQtyVal: "10 bars",
    giftBoxes: "Premium gift boxes",
    comingSoon: "Coming soon",
    delivery: "Delivery",
    deliveryVal: "Bahrain only",
    giftingText:
      "Planning a corporate order, event or bulk gifting? Wholesale orders are handled personally over WhatsApp.",
    enquire: "Enquire on WhatsApp",
  },
  whatsapp: { defaultLabel: "WhatsApp", ariaPrefix: "Order on WhatsApp" },
  footer: { copyright: "© {year} Candy Couture · Bahrain" },
};

const AR_UI: UIStrings = {
  nav: {
    bars: "الألواح",
    nutrition: "القيم الغذائية",
    order: "اطلب",
    menu: "القائمة",
  },
  header: {
    openMenu: "فتح القائمة",
    home: "كاندي كوتور — الرئيسية",
    ordering: "معلومات الطلب",
  },
  menu: {
    aria: "القائمة",
    back: "رجوع",
    close: "إغلاق القائمة",
    language: "اللغة",
    langEnglish: "English",
    langArabic: "العربية",
    items: {
      home: "الرئيسية",
      bars: "الألواح",
      nutrition: "القيم الغذائية",
      about: "من نحن",
      ordering: "الطلب",
      wholesale: "الجملة",
      contact: "تواصل معنا",
    },
    aboutHeader: "من نحن",
    contactHeader: "تواصل معنا",
    about: {
      aboutUs: "من نحن",
      philosophy: "فلسفة المنتج",
      gifting: "الإهداء",
      testimonials: "آراء العملاء",
    },
    comingSoon: "قريبًا",
    contact: { email: "البريد الإلكتروني", instagram: "إنستغرام", whatsapp: "واتساب" },
    tooGood: "ألذّ من أن يُشارَك",
  },
  home: {
    eyebrow: "صُنع يدويًا في البحرين",
    line1: "مكوّنات حقيقية.",
    line2: "مخبوز طازجًا.",
    line3: "ألذّ من أن يُشارَك",
    chooseBar: "اختر لوحك",
    ourStory: "قصتنا",
  },
  bars: {
    eyebrow: "المجموعة",
    title: "اختر لوحك",
    tagline: "مكوّنات صحية. مذاق فاخر.",
    onePack: "العبوة",
    onePackVal: "10 ألواح",
    wholesale: "الجملة",
    wholesaleVal: "خيارات متاحة",
    delivery: "التوصيل",
    deliveryVal: "في أنحاء البحرين",
    boxNote: "الصندوق الواحد يساوي {n}. الحد الأدنى للطلب 10.",
  },
  nutrition: {
    eyebrow: "اعرف لوحك",
    title: "القيم الغذائية",
    subtitle: "أرقام صادقة لكل لوح.",
    per: "لكل {serving}",
    segCookie: "شوفان الكوكيز",
    segProtein: "شوفان البروتين",
    orderThe: "اطلب {name}",
  },
  ordering: {
    eyebrow: "كيف يعمل",
    title: "الطلب",
    subtitle: "اطلب قبل الساعة 2 ظهرًا للتوصيل في اليوم التالي.",
    minimum: "الحد الأدنى للطلب",
    deliveryArea: "منطقة التوصيل",
    deliveryFee: "رسوم التوصيل",
    freeOver: "توصيل مجاني عند تجاوز",
    payment: "الدفع",
    cutoff: "آخر موعد للطلب",
    wholesaleNote: "طلبات الجملة تُدار شخصيًا — راسلنا على واتساب.",
    orderCta: "اطلب عبر واتساب",
  },
  about: {
    eyebrow: "قصتنا",
    title: "متعة، مصنوعة بصدق.",
    aboutUsT: "من نحن",
    aboutUsN: "لماذا أنشأنا كاندي كوتور",
    philosophyT: "فلسفة المنتج",
    philosophyN: "مكوّنات حقيقية بلا اختصارات",
    giftingT: "الإهداء والجملة",
    giftingN: "صناديق وطلبات بالجملة وللشركات",
    testimonialsT: "آراء العملاء",
    comingSoon: "قريبًا",
  },
  wholesale: {
    eyebrow: "للأعمال والإهداء",
    title: "الجملة والإهداء",
    subtitle: "ألواح فاخرة، بكميات كبيرة.",
    p: [
      { t: "طلبات الجملة", n: "متاحة عبر واتساب" },
      { t: "كمية الصندوق", n: "10 ألواح في الصندوق" },
      { t: "صناديق هدايا فاخرة", n: "قريبًا" },
      { t: "التوصيل", n: "البحرين فقط" },
    ],
    closing: "أخبرنا بما تحتاجه وسنتكفّل بالباقي.",
    enquire: "استفسر عبر واتساب",
  },
  card: {
    highProtein: "عالي البروتين",
    classic: "كلاسيكي",
    perBar: "/لوح",
    perBoxOf10: "{price} لصندوق من 10",
    boxMin: "صندوق من 10 · الحد الأدنى 10",
    whatsapp: "واتساب",
    viewDetails: "عرض التفاصيل",
  },
  modal: {
    badgeHigh: "عالي البروتين",
    badgeClassic: "كلاسيكي",
    tabs: {
      overview: "نظرة عامة",
      ingredients: "المكوّنات",
      nutrition: "القيم الغذائية",
      storage: "التخزين",
      allergens: "مسببات الحساسية",
    },
    servingSize: "حجم الحصة",
    price: "السعر",
    perBox: "الصندوق",
    minimumOrder: "الحد الأدنى للطلب",
    shelfLife: "مدة الصلاحية",
    made: "المنشأ",
    madeVal: "صُنع يدويًا في البحرين",
    perBarSlash: "{price} / لوح",
    boxLine: "{price} · 10 ألواح",
    heroIngredients: "مكوّنات مميزة",
    per: "لكل {serving}",
    contains: "يحتوي على {a}",
    gluten: "الغلوتين",
    dairy: "الحليب",
    nuts: "المكسّرات",
    ctaSub: "/ لوح · {box} للصندوق",
    orderCta: "اطلب عبر واتساب",
    close: "إغلاق",
  },
  drawer: {
    aboutUs: "من نحن",
    philosophy: "فلسفة المنتج",
    gifting: "الإهداء والجملة",
    quote: "ألذّ من أن يُشارَك.",
    handcraftedIn: "صُنع يدويًا في {location}.",
    boxQty: "كمية الصندوق",
    boxQtyVal: "10 ألواح",
    giftBoxes: "صناديق هدايا فاخرة",
    comingSoon: "قريبًا",
    delivery: "التوصيل",
    deliveryVal: "البحرين فقط",
    giftingText:
      "تخطط لطلب مؤسسي أو مناسبة أو إهداء بالجملة؟ تُدار طلبات الجملة شخصيًا عبر واتساب.",
    enquire: "استفسر عبر واتساب",
  },
  whatsapp: { defaultLabel: "واتساب", ariaPrefix: "اطلب عبر واتساب" },
  footer: { copyright: "© {year} كاندي كوتور · البحرين" },
};

const UI: Record<Lang, UIStrings> = { en: EN_UI, ar: AR_UI };

// ── Provider + hooks ──────────────────────────────────────────
interface LangCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved preference after mount (SSR always renders English).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cc-lang");
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep <html lang/dir> and storage in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("cc-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((p) => (p === "ar" ? "en" : "ar")),
    [],
  );

  return (
    <LangContext.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** Translated content bundle (products, nutrition, brand copy) for the active language. */
export function useContent(): ContentBundle {
  return CONTENT[useLang().lang];
}

/** Component-level UI strings for the active language. */
export function useT(): UIStrings {
  return UI[useLang().lang];
}

/** Fill `{token}` placeholders in a template string. */
export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
