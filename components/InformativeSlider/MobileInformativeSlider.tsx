"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EmblaDots } from "./EmblaDots";

import img1 from "../../public/assets/images/HeadPhone/slider-img-01.jpg";
import img2 from "../../public/assets/images/HeadPhone/slider-img-02.jpg";
import img3 from "../../public/assets/images/HeadPhone/slider-img-03.jpg";
import img4 from "../../public/assets/images/HeadPhone/slider-img-02.jpg";
import img5 from "../../public/assets/images/HeadPhone/slider-img-01.jpg";

const options: EmblaOptionsType = {
  loop: true,
};

const sliderContent = [
  {
    img: img1,
    tag: "ADAPTIVE ANC",
    title: "Put the world on pause",
    description:
      "Five levels of noise cancellation make Dynasty Headphone our most advanced ANC headphones yet, handling everything from the hum of home life to the commotion of a commute.",
    href: "/products/dynasty-headphone",
  },
  {
    img: img2,
    tag: "IMMERSIVE SOUND",
    title: "Feel every beat",
    description:
      "Precision-tuned acoustics deliver deep bass, crisp mids, and ultra-clear highs for a powerful listening experience.",
    href: "/products/immersive-sound",
  },
  {
    img: img3,
    tag: "PREMIUM DESIGN",
    title: "Built for comfort",
    description:
      "Crafted with premium materials and ergonomic design to ensure comfort during long listening sessions.",
    href: "/products/premium-design",
  },
  {
    img: img4,
    tag: "WIRELESS FREEDOM",
    title: "No wires. No limits.",
    description:
      "Seamless Bluetooth connectivity with ultra-low latency and long-lasting battery performance.",
    href: "/products/wireless-freedom",
  },
  {
    img: img5,
    tag: "STUDIO QUALITY",
    title: "Hear it as it was meant to be",
    description:
      "Studio-grade audio engineered for professionals and audiophiles alike.",
    href: "/products/studio-quality",
  },
];

type Props = {
  className?: string;
};

const MobileInformativeSlider = ({ className }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const activeSlide = sliderContent[selectedIndex];

  return (
    <section className={`relative w-full bg-black ${className}`}>
      {/* ================= IMAGE SLIDER ================= */}
      <div ref={emblaRef} className="relative overflow-hidden h-[300px]">
        <div className="flex">
          {sliderContent.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              <img
                src={slide.img.src}
                alt={slide.title}
                className="w-full aspect-[3/4] object-cover h-[300px]"
              />
            </div>
          ))}
        </div>

        {/* DOTS ON IMAGE */}
        <EmblaDots
          count={sliderContent.length}
          activeIndex={selectedIndex}
          onSelect={scrollTo}
        />
      </div>

      {/* ================= TEXT CONTENT (STATIC) ================= */}
      <div className="px-5 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-[#c9a24d] text-xs tracking-widest mb-2">
              {activeSlide.tag}
            </p>

            <h2 className="text-white text-[28px] font-bold leading-[36px] mb-3">
              {activeSlide.title}
            </h2>

            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {activeSlide.description}
            </p>

            <Link
              href={activeSlide.href}
              className="inline-block text-white border-b border-white pb-1 text-sm"
            >
              Learn more
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MobileInformativeSlider;
