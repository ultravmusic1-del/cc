// ─────────────────────────────────────────────────────────────
// Candy Couture — bilingual single source of truth (English + Arabic).
// Every user-facing string lives here, keyed by language, so the whole
// site can switch between "en" and "ar" (with RTL) from one toggle.
// Prices, nutrition and rules come straight from the brand brief.
// ─────────────────────────────────────────────────────────────

export type Lang = "en" | "ar";

export type ProductId = "cookie" | "protein";

export interface NutritionRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accent: "burgundy" | "coral";
  pricePerBar: string;
  pricePerBox: string;
  moq: string;
  boxQty: string;
  servingSize: string;
  shelfLife: string;
  ingredients: string;
  ingredientChips: string[];
  nutrition: NutritionRow[];
  allergens: string;
  image: string;
  imageAlt: string;
}

export interface ContentBundle {
  brand: {
    name: string;
    location: string;
    tagline: string;
    storyLede: string;
    storyBody: string;
    storyClose: string;
  };
  hero: { subtext: string };
  heroBenefits: { icon: string; title: string }[];
  products: Record<ProductId, Product>;
  ordering: {
    minimum: string;
    deliveryArea: string;
    deliveryFee: string;
    freeDeliveryOver: string;
    payment: string;
    cutoff: string;
  };
  storage: { shelfLife: string; keep: string; made: string };
  philosophy: { lede: string; body: string };
}

// Contact details are values (not translated), shared across languages.
export const CONTACT = {
  email: "candycouturecompany@gmail.com",
  instagram: "@candycoutureco",
  instagramUrl: "https://instagram.com/candycoutureco",
  whatsapp: "+973 38366111",
};

// ── English ───────────────────────────────────────────────────
const EN: ContentBundle = {
  brand: {
    name: "Candy Couture",
    location: "Bahrain",
    tagline: "Wholesome ingredients. Indulgent taste.",
    storyLede:
      "Candy Couture began with one simple belief: a better dessert should still feel indulgent.",
    storyBody:
      "What started in Dubai has found a new home in Bahrain, where every oat bar is baked fresh in small batches using whole grain oats, dark chocolate, and ingredients you'll actually recognize.",
    storyClose:
      "No shortcuts. No preservatives. Just honest baking that proves wholesome can be seriously delicious.",
  },
  hero: {
    subtext:
      "Handcrafted in Bahrain with whole grain oats, dark chocolate, and real ingredients.",
  },
  heroBenefits: [
    { icon: "/images/icons/wholegrain-oats-v2.png", title: "Wholegrain Oats" },
    {
      icon: "/images/icons/dark-chocolate-chunks-v2.png",
      title: "Dark Chocolate Chunks",
    },
    { icon: "/images/icons/smart-snacking-v2.png", title: "Smart Snacking" },
  ],
  products: {
    cookie: {
      id: "cookie",
      name: "Oat Cookie Bar",
      shortName: "Cookie",
      tagline: "Whole grain. Real chocolate. Pure indulgence.",
      description: "Chewy oat cookie bar with dark chocolate chips.",
      accent: "burgundy",
      pricePerBar: "1.5 BD",
      pricePerBox: "15 BD",
      moq: "10 pieces",
      boxQty: "10 bars",
      servingSize: "One bar · approx. 75–80g",
      shelfLife: "15 days from production date",
      ingredients:
        "Whole grain oats, wholemeal flour, unsalted butter, dark chocolate, cultured skimmed milk, coconut sugar, vanilla beans, raising agents, sea salt.",
      ingredientChips: [
        "Whole grain rolled oats",
        "80% dark chocolate",
        "Coconut sugar",
        "Grass-fed butter",
      ],
      nutrition: [
        { label: "Energy", value: "205 kcal", highlight: true },
        { label: "Protein", value: "4.4 g", highlight: true },
        { label: "Carbohydrates", value: "27 g" },
        { label: "Sugars", value: "11–12 g" },
        { label: "Fat", value: "7.5 g" },
        { label: "Fibre", value: "3.2 g" },
      ],
      allergens: "Contains gluten, dairy and nuts.",
      image: "/images/oat-cookie-bar-v2.png",
      imageAlt: "Candy Couture Oat Cookie Bar in its packaging",
    },
    protein: {
      id: "protein",
      name: "Oat Protein Bar",
      shortName: "Protein",
      tagline: "Protein-packed. Dessert-approved.",
      description: "High-protein oat bar to fuel your day.",
      accent: "coral",
      pricePerBar: "1.8 BD",
      pricePerBox: "18 BD",
      moq: "10 pieces",
      boxQty: "10 bars",
      servingSize: "One bar · approx. 75–80g",
      shelfLife: "15 days from production date",
      ingredients:
        "Whole grain oats, whey protein isolate, wholemeal flour, unsalted butter, cultured skimmed milk, dark chocolate, coconut sugar, vanilla beans, raising agents, sea salt.",
      ingredientChips: [
        "Whole grain rolled oats",
        "Whey protein isolate",
        "80% dark chocolate",
        "Coconut sugar",
        "Grass-fed butter",
      ],
      nutrition: [
        { label: "Energy", value: "200 kcal", highlight: true },
        { label: "Protein", value: "10 g", highlight: true },
        { label: "Carbohydrates", value: "19 g" },
        { label: "Sugars", value: "9 g" },
        { label: "Fat", value: "9 g" },
        { label: "Fibre", value: "3 g" },
      ],
      allergens: "Contains gluten, dairy and nuts.",
      image: "/images/oat-protein-bar-v2.png",
      imageAlt: "Candy Couture Oat Protein Bar in its packaging",
    },
  },
  ordering: {
    minimum: "10 bars",
    deliveryArea: "Bahrain only",
    deliveryFee: "2 BD",
    freeDeliveryOver: "50 BD",
    payment: "BenefitPay",
    cutoff: "2:00 PM · next-day",
  },
  storage: {
    shelfLife: "15 days from production date",
    keep: "Store in a cool, dry, air-conditioned environment away from sunlight.",
    made: "Handcrafted in Bahrain.",
  },
  philosophy: {
    lede: "We believe indulgence should never come at the expense of quality.",
    body: "Every Candy Couture oat bar is thoughtfully crafted with premium ingredients, freshly baked in small batches, and free from preservatives and unnecessary additives.",
  },
};

// ── Arabic (العربية) ──────────────────────────────────────────
const AR: ContentBundle = {
  brand: {
    name: "كاندي كوتور",
    location: "البحرين",
    tagline: "مكوّنات صحية. مذاق فاخر.",
    storyLede:
      "بدأت كاندي كوتور بقناعة واحدة بسيطة: الحلوى الأفضل يجب أن تبقى مُفعمة بالمتعة.",
    storyBody:
      "ما بدأ في دبي وجد موطنًا جديدًا في البحرين، حيث يُخبز كل لوح شوفان طازجًا على دفعات صغيرة باستخدام الشوفان الكامل والشوكولاتة الداكنة ومكوّنات تعرفها حقًا.",
    storyClose:
      "بلا اختصارات. بلا مواد حافظة. مجرد خَبز صادق يُثبت أن الصحي يمكن أن يكون لذيذًا حقًا.",
  },
  hero: {
    subtext:
      "مصنوع يدويًا في البحرين من الشوفان الكامل والشوكولاتة الداكنة ومكوّنات حقيقية.",
  },
  heroBenefits: [
    { icon: "/images/icons/wholegrain-oats-v2.png", title: "شوفان كامل الحبة" },
    {
      icon: "/images/icons/dark-chocolate-chunks-v2.png",
      title: "قطع شوكولاتة داكنة",
    },
    { icon: "/images/icons/smart-snacking-v2.png", title: "وجبة خفيفة ذكية" },
  ],
  products: {
    cookie: {
      id: "cookie",
      name: "لوح شوفان الكوكيز",
      shortName: "كوكيز",
      tagline: "حبوب كاملة. شوكولاتة حقيقية. متعة خالصة.",
      description: "لوح شوفان طري بنكهة الكوكيز مع رقائق الشوكولاتة الداكنة.",
      accent: "burgundy",
      pricePerBar: "1.5 د.ب",
      pricePerBox: "15 د.ب",
      moq: "10 قطع",
      boxQty: "10 ألواح",
      servingSize: "لوح واحد · حوالي 75–80 جم",
      shelfLife: "15 يومًا من تاريخ الإنتاج",
      ingredients:
        "شوفان كامل الحبة، دقيق قمح كامل، زبدة غير مملّحة، شوكولاتة داكنة، حليب منزوع الدسم مُخمَّر، سكر جوز الهند، حبوب الفانيليا، عوامل رفع، ملح البحر.",
      ingredientChips: [
        "شوفان كامل الحبة",
        "شوكولاتة داكنة 80%",
        "سكر جوز الهند",
        "زبدة أبقار المراعي",
      ],
      nutrition: [
        { label: "الطاقة", value: "205 سعرة حرارية", highlight: true },
        { label: "البروتين", value: "4.4 جم", highlight: true },
        { label: "الكربوهيدرات", value: "27 جم" },
        { label: "السكريات", value: "11–12 جم" },
        { label: "الدهون", value: "7.5 جم" },
        { label: "الألياف", value: "3.2 جم" },
      ],
      allergens: "يحتوي على الغلوتين ومشتقات الحليب والمكسّرات.",
      image: "/images/oat-cookie-bar-v2.png",
      imageAlt: "لوح شوفان الكوكيز من كاندي كوتور داخل عبوته",
    },
    protein: {
      id: "protein",
      name: "لوح شوفان البروتين",
      shortName: "بروتين",
      tagline: "غنيّ بالبروتين. بطعم الحلوى.",
      description: "لوح شوفان غني بالبروتين ليمنحك طاقة يومك.",
      accent: "coral",
      pricePerBar: "1.8 د.ب",
      pricePerBox: "18 د.ب",
      moq: "10 قطع",
      boxQty: "10 ألواح",
      servingSize: "لوح واحد · حوالي 75–80 جم",
      shelfLife: "15 يومًا من تاريخ الإنتاج",
      ingredients:
        "شوفان كامل الحبة، بروتين مصل اللبن المعزول، دقيق قمح كامل، زبدة غير مملّحة، حليب منزوع الدسم مُخمَّر، شوكولاتة داكنة، سكر جوز الهند، حبوب الفانيليا، عوامل رفع، ملح البحر.",
      ingredientChips: [
        "شوفان كامل الحبة",
        "بروتين مصل اللبن المعزول",
        "شوكولاتة داكنة 80%",
        "سكر جوز الهند",
        "زبدة أبقار المراعي",
      ],
      nutrition: [
        { label: "الطاقة", value: "200 سعرة حرارية", highlight: true },
        { label: "البروتين", value: "10 جم", highlight: true },
        { label: "الكربوهيدرات", value: "19 جم" },
        { label: "السكريات", value: "9 جم" },
        { label: "الدهون", value: "9 جم" },
        { label: "الألياف", value: "3 جم" },
      ],
      allergens: "يحتوي على الغلوتين ومشتقات الحليب والمكسّرات.",
      image: "/images/oat-protein-bar-v2.png",
      imageAlt: "لوح شوفان البروتين من كاندي كوتور داخل عبوته",
    },
  },
  ordering: {
    minimum: "10 ألواح",
    deliveryArea: "البحرين فقط",
    deliveryFee: "2 د.ب",
    freeDeliveryOver: "50 د.ب",
    payment: "بنفت باي",
    cutoff: "2:00 ظهرًا · اليوم التالي",
  },
  storage: {
    shelfLife: "15 يومًا من تاريخ الإنتاج",
    keep: "يُحفظ في مكان بارد وجاف ومكيّف بعيدًا عن أشعة الشمس.",
    made: "صُنع يدويًا في البحرين.",
  },
  philosophy: {
    lede: "نؤمن بأن المتعة يجب ألّا تأتي على حساب الجودة أبدًا.",
    body: "كل لوح شوفان من كاندي كوتور مصنوع بعناية من مكوّنات فاخرة، ويُخبز طازجًا على دفعات صغيرة، وخالٍ من المواد الحافظة والإضافات غير الضرورية.",
  },
};

export const CONTENT: Record<Lang, ContentBundle> = { en: EN, ar: AR };
