'use client';

import BannerSection from "@/components/BannerSection/BannerSection";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import MobileInformativeSlider from "@/components/InformativeSlider/MobileInformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";
import DualSpecsScroll from "@/components/DualSpecsScroll/DualSpecsScroll";
import MobileSpecs from "@/components/DualSpecsScroll/MobileSpecs";
import WhyChooseUsHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsHoverImage";
import WhyChooseUsMobileHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsMobileHoverImage";
import FAQ from "@/components/FAQ/FAQ";

export default function Home() {
  return (
    <>
      <BannerSection/>
      <InformativeSlider className={`hidden md:block`}/>
      <MobileInformativeSlider className={`block md:hidden`}/>
      <MainImageAddToCart/>
      <DualSpecsScroll className={`hidden md:block`}/>
      <MobileSpecs className={`block md:hidden`}/>
      <WhyChooseUsHoverImage className={`hidden md:block`}/>
      <WhyChooseUsMobileHoverImage className={`block md:hidden`}/>
      <FAQ className={{ wrapper: "block", alignMent: "start",widthHeading: "3xl",searchFunctionalityVisiblity:"block", modal:false }}/>
    </>
  );
}