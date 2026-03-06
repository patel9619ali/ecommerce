import HomePageProduct from "@/components/HomePageProduct";
import ProductPageClient from "@/components/ProductPageClient";
import { getProductByRoute, getProducts } from "@/lib/api";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ brand: string; category: string; slug: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const product = await getProductByRoute(
    params.brand,
    params.category,
    params.slug
  );

  if (!product) {
    notFound();
  }

  const variantFromUrl = searchParams.variant;
  let initialVariant = product.variants[0]?.sku ?? null;

  if (variantFromUrl) {
    const variantExists = product.variants.some(
      (v: { sku: string }) => v.sku === variantFromUrl
    );
    if (variantExists) {
      initialVariant = variantFromUrl;
    }
  }

  const products = await getProducts();

  return (
    <>
      <ProductPageClient product={product} initialVariant={initialVariant} />
      <HomePageProduct
        productData={products?.data}
        preferredCategorySlug={product.category?.slug || product.category?.name}
        currentProductSlug={product.slug}
        currentVariantSku={initialVariant}
      />
    </>
  );
}
