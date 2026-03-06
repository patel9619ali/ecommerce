import MainProductPage from "@/components/MainProductPage/MainProductPage";
import { getProducts } from "@/lib/api";

const ProductPage = async () => {
  const product = await getProducts();
  return (
    <MainProductPage product={product} breadcrumbLabel="All Products" />
  );
};

export default ProductPage;
