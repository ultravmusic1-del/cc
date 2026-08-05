import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENT } from "@/lib/content";
import { PRODUCT_SLUGS, productIdFromSlug } from "@/lib/routes";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
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
  const title = `${p.name} | Candy Couture`;
  const description = `${p.description} ${p.pricePerBar} per bar, ${p.pricePerBox} per pack of 10. Handmade in Bahrain.`;
  return {
    title,
    description,
    alternates: { canonical: `/bars/${slug}` },
    // Without this the page inherits the root layout's openGraph, so pasting a
    // product URL into WhatsApp renders the generic homepage card — and og:url
    // would point at the homepage, which WhatsApp/Facebook treat as canonical
    // identity, consolidating every product share onto one object. Ordering
    // happens over WhatsApp here, so that is the path that matters most.
    openGraph: { title, description, url: `/bars/${slug}` },
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

  // `<` is escaped so a literal "</script>" in any content value cannot close
  // this tag early — same guard as components/seo/JsonLd.tsx.
  const breadcrumb = JSON.stringify(buildBreadcrumbJsonLd(id)).replace(
    /</g,
    "\\u003c",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumb }}
      />
      <ProductScreen productId={id} />
    </>
  );
}
