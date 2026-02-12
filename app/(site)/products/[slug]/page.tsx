import { getProductBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

type Props = {
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ variant?: string }>; 
};

export default async function ProductPage(props: Props) {
  console.log(props,"propspropsprops")
  // ✅ Await params and searchParams
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { slug } = params;
  const variantFromUrl = searchParams.variant;

  // ✅ Fetch on server with ISR caching
  const res = await getProductBySlug(slug);
  console.log(res,"resres")
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
      key: v.sku,
      color: v.colorName,
      sellingPrice: v.sellingPrice,
      mrp: v.mrp,
      images: v.images?.map((img: any) => ({
        url: img.url,
      })) || [],
      benefits: v.ReturnsAndWarranty || [],
    })),
  };

  // Determine initial variant
  const initialVariant = variantFromUrl || product.variants[0]?.key;

  return (
    <ProductPageClient product={product}  initialVariant={initialVariant} />
  );
}

// ✅ Generate static params for popular products
export async function generateStaticParams() {
  return [
    { slug: 'blend-ras-portable-juicer' },
  ];
}