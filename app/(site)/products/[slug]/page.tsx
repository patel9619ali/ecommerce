import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

type Props = {
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ variant?: string }>; 
};

export default async function ProductPage(props: Props) {
  // ✅ Await params and searchParams
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { slug } = params;
  const variantFromUrl = searchParams.variant;

  // ✅ Fetch on server with ISR caching
  const res = await getProductBySlug(slug);
  const cmsProduct = res?.data?.[0];

  if (!cmsProduct) {
    notFound();
  }

  // Normalize product data
  const product = {
    id: cmsProduct.id,
    title: cmsProduct.title,
    subTitle: cmsProduct.subTitle,
    description: cmsProduct.description,
    rating: cmsProduct.rating,
    ratingCount: cmsProduct.ratingCount,
    slug: cmsProduct.slug,
    variants: (cmsProduct.variant || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,           // ✅ Changed from "key"
      color: v.colorName,   // ✅ Normalize to "color"
      colorHex: v.colorHex,
      sellingPrice: v.sellingPrice,
      mrp: v.mrp,
      stock: v.stock,       // ✅ Added stock
      images: v.images?.map((img: any) => ({
        url: img.url,
      })) || [],
      benefits: v.ReturnsAndWarranty || [],
    })),
  };

  // Initial variant
  let initialVariant = product?.variants[0]?.sku;  // ✅ Changed from .key

  if (variantFromUrl) {
    const variantExists = product.variants.some((v: any) => v.sku === variantFromUrl);
    if (variantExists) {
      initialVariant = variantFromUrl;
    }
    // If variant in URL doesn't exist, just use first variant (don't throw 404)
  }

  return (
    <ProductPageClient 
      product={product}  
      initialVariant={initialVariant} 
    />
  );
}

// ✅ Generate static params for popular products (optional)
export async function generateStaticParams() {
  return [
    { slug: 'blend-ras-portable-juicer' },
  ];
}