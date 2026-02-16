import BannerSection from "@/components/BannerSection/BannerSection";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import MobileInformativeSlider from "@/components/InformativeSlider/MobileInformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";
import DualSpecsScroll from "@/components/DualSpecsScroll/DualSpecsScroll";
import MobileSpecs from "@/components/DualSpecsScroll/MobileSpecs";
import WhyChooseUsHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsHoverImage";
import WhyChooseUsMobileHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsMobileHoverImage";
import FAQ from "@/components/FAQ/FAQ";
import { getProducts } from "@/lib/api";
import ProductSpecs from "@/components/ProductSpecs/ProductSpecs";
import Features from "@/components/Features/Features";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Reviews from "@/components/Reviews/Reviews";
import DirectProductPageLinking from "@/components/DirectProductPageLinking";
export default async function Home() {
  const products = await getProducts();
  const {data} = products;
  console.log(data,"datadata");
  return (
    <>
      <BannerSection productData={data}/>
      {/* <InformativeSlider className={`hidden md:block`} productData={data}/> */}
      <MobileInformativeSlider className={`block md:hidden`} productData={data}/>
      <MainImageAddToCart productData={data}/>
      {/* <DualSpecsScroll className={`hidden md:block`}/>
      <MobileSpecs className={`block md:hidden`}/> */}
      <Features/>
      <HowItWorks/>
      <ProductSpecs/>
      <DirectProductPageLinking/>
      <WhyChooseUsHoverImage className={`hidden md:block`}/>
      <WhyChooseUsMobileHoverImage className={`block md:hidden`}/>
      <Reviews/>
      <FAQ className={{ wrapper: "block", alignMent: "start",widthHeading: "3xl",searchFunctionalityVisiblity:"block", modal:false }}/>
    </>
  );
}