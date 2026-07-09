// ─────────────────────────────────────────────────────────────
// Candy Couture — single source of truth for all factual content.
// All prices, nutrition and rules come straight from the brand brief.
// ─────────────────────────────────────────────────────────────

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

export const BRAND = {
  name: "Candy Couture",
  location: "Bahrain",
  launch: "Launching July 2026",
  tagline: "Wholesome ingredients. Indulgent taste.",
  storyLede:
    "Candy Couture was created for people who want a treat that feels indulgent without losing touch with real ingredients.",
  storyBody:
    "Every oat bar is handcrafted in Bahrain using whole grain oats, dark chocolate and carefully selected ingredients — freshly baked in small batches, never mass produced.",
};

export const HERO = {
  headline: "Healthy treats should still feel indulgent.",
  subtext:
    "Handcrafted in Bahrain with whole grain oats, dark chocolate, and real ingredients.",
};

export const HERO_BENEFITS = [
  { icon: "/images/icons/wholegrain-oats.png", title: "Wholegrain Oats" },
  {
    icon: "/images/icons/dark-chocolate-chunks.png",
    title: "Dark Chocolate Chunks",
  },
  { icon: "/images/icons/smart-snacking.png", title: "Smart Snacking" },
];

export const PRODUCTS: Record<ProductId, Product> = {
  cookie: {
    id: "cookie",
    name: "Oat Cookie Bar",
    shortName: "Cookie",
    tagline: "Chewy, chocolate-studded, comforting.",
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
      { label: "Saturated fat", value: "3.8 g" },
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
    tagline: "High-protein fuel with the same indulgent bite.",
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
};

export const PRODUCT_LIST: Product[] = [PRODUCTS.cookie, PRODUCTS.protein];

export const ORDERING = {
  minimum: "10 bars",
  deliveryArea: "Bahrain only",
  deliveryFee: "1.5 BD",
  freeDeliveryOver: "50 BD",
  payment: "BenefitPay",
  cutoff: "2:00 PM for next-day delivery",
  wholesale: "Wholesale orders — connect via WhatsApp",
};

export const STORAGE = {
  shelfLife: "15 days from production date",
  keep: "Store in a cool, dry, air-conditioned environment away from sunlight.",
  made: "Handcrafted in Bahrain.",
};

export const PHILOSOPHY = [
  { title: "Whole grain oats", note: "Rolled, hearty and genuinely wholesome.", icon: "wheat" },
  { title: "Real dark chocolate", note: "80% dark chocolate, never a coating.", icon: "cocoa" },
  { title: "Coconut sugar", note: "A softer, unrefined kind of sweetness.", icon: "leaf" },
  { title: "Grass-fed butter", note: "Rich, honest fat for a tender crumb.", icon: "butter" },
  { title: "Freshly baked to order", note: "Small batches, never mass produced.", icon: "chef" },
  { title: "No preservatives", note: "Nothing you can't pronounce.", icon: "sparkle" },
];
