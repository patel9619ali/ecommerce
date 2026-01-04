'use client';

import BannerSection from "@/components/BannerSection/BannerSection";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";
import DualSpecsScroll from "@/components/DualSpecsScroll/DualSpecsScroll";
import MobileSpecs from "@/components/DualSpecsScroll/MobileSpecs";
import WhyChooseUsHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsHoverImage";
import WhyChooseUsMobileHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsMobileHoverImage";

export default function Home() {
  return (
    <>
      <BannerSection/>
      <InformativeSlider className={`hidden md:block`}/>
      <MainImageAddToCart/>
      <DualSpecsScroll className={`hidden md:block`}/>
      <MobileSpecs className={`block md:hidden`}/>
      <WhyChooseUsHoverImage className={`hidden md:block`}/>
      <WhyChooseUsMobileHoverImage className={`block md:hidden`}/>
    </>
  );
}