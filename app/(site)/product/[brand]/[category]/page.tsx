import MainProductPage from "@/components/MainProductPage/MainProductPage";
import { getProducts } from "@/lib/api";
import { toRouteSegment } from "@/lib/product-url";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ brand: string; category: string }>;
};

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const products = await getProducts();

  const categorySlug = toRouteSegment(params.category);

  const filtered = (products?.data || []).filter((item: any) => {
    const itemCategory = toRouteSegment(item.category?.slug || item.category?.name);
    return itemCategory === categorySlug;
  });

  if (!filtered.length) {
    notFound();
  }

  const categoryName = filtered[0]?.category?.name || "Category";

  return (
    <MainProductPage
      product={{ data: filtered }}
      initialCategorySlug={categorySlug || undefined}
      lockToCategory
      breadcrumbLabel={categoryName}
    />
  );
}
