import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENT } from "@/lib/content";
import { PRODUCT_SLUGS, productIdFromSlug } from "@/lib/routes";
import ProductScreen from "@/components/screens/ProductScreen";

export function generateStaticParams() {
  return Object.values(PRODUCT_SLUGS).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = productIdFromSlug(slug);
  if (!id) return {};
  const p = CONTENT.en.products[id];
  return {
    title: `${p.name} | Candy Couture`,
    description: `${p.description} ${p.pricePerBar} per bar, ${p.pricePerBox} per pack of 10. Handmade in Bahrain.`,
    alternates: { canonical: `/bars/${slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = productIdFromSlug(slug);
  if (!id) notFound();
  return <ProductScreen productId={id} />;
}
