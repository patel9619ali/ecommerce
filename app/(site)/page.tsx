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
export default async function Home() {
  const products = await getProducts();
  const {data} = products;
  return (
    <>
      <BannerSection/>
      <InformativeSlider className={`hidden md:block`} productData={data}/>
      <MobileInformativeSlider className={`block md:hidden`} productData={data}/>
      <MainImageAddToCart/>
      <DualSpecsScroll className={`hidden md:block`}/>
      <MobileSpecs className={`block md:hidden`}/>
      <WhyChooseUsHoverImage className={`hidden md:block`}/>
      <WhyChooseUsMobileHoverImage className={`block md:hidden`}/>
      <FAQ className={{ wrapper: "block", alignMent: "start",widthHeading: "3xl",searchFunctionalityVisiblity:"block", modal:false }}/>
    </>
  );
}