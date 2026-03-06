import { getProductBySlug } from "@/lib/api";
import { buildProductPathWithVariant } from "@/lib/product-url";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export default async function LegacyProductPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  redirect(
    buildProductPathWithVariant(
      {
        slug: product.slug,
        brandSlug: product.brand?.slug || product.brand?.name,
        categorySlug: product.category?.slug || product.category?.name,
      },
      searchParams.variant
    )
  );
}
