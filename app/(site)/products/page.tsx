import MainProductPage from "@/components/MainProductPage/MainProductPage";
import { getProductBySlug, getProductLiveData,getProducts } from "@/lib/api";
type Props = {
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ variant?: string }>; 
};
const ProductPage = async (props: Props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { slug } = params;
  const variantFromUrl = searchParams.variant;

  // ✅ Fetch on server with ISR caching
  const productBySlug = await getProductBySlug(slug);
  const product = await getProducts();

  return (
    <MainProductPage product={product} />
  );
};

export default ProductPage;
