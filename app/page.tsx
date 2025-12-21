'use client';

import BannerSection from "@/components/BannerSection/BannerSection";
import DummyButton from "@/components/DummyButton";
import InformativeSlider from "@/components/InformativeSlider/InformativeSlider";
import { MainImageAddToCart } from "@/components/MainImageAddToCart/MainImageAddToCart";

export default function Home() {
  return (
    <>
      <BannerSection/>
      <InformativeSlider/>
      <DummyButton/>
      <MainImageAddToCart/>
    </>
  );
}