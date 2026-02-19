import { getProductBySlug, getProductLiveData } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";

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
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  // Initial variant
  let initialVariant = product?.variants[0]?.sku;  // ✅ Changed from .key


  if (variantFromUrl) {
    const variantExists = product.variants.some((v: any) => v.sku === variantFromUrl);
    if (variantExists) {
      initialVariant = variantFromUrl;
    }
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