'use client';

import BannerSection from "@/components/BannerSection/BannerSection";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";
import DualSpecsScroll from "@/components/DualSpecsScroll/DualSpecsScroll";
import WhyChooseUsHoverImage from "@/components/WhyChooseUsHoverImage/WhyChooseUsHoverImage";

export default function Home() {
  return (
    <>
      <BannerSection/>
      <InformativeSlider className={`hidden md:block`}/>
      <MainImageAddToCart/>
      <DualSpecsScroll/>
      <WhyChooseUsHoverImage className={`hidden md:block`}/>
    </>
  );
}