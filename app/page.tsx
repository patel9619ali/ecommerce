'use client';

import BannerSection from "@/components/BannerSection/BannerSection";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";

export default function Home() {
  return (
    <>
      <BannerSection/>
      <InformativeSlider/>
      <MainImageAddToCart/>
    </>
  );
}