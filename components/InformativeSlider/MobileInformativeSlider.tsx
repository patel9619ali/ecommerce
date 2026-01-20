"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EmblaDots } from "./EmblaDots";

import img1 from "../../public/assets/Blender/blackblender.jpg";
import img2 from "../../public/assets/Blender/blueblender.jpg";
import img3 from "../../public/assets/Blender/coconatblender.jpg";
import img4 from "../../public/assets/Blender/iceblender.jpg";
import img5 from "../../public/assets/Blender/redblender.jpg";

const options: EmblaOptionsType = {
  loop: true,
};

const sliderContent = [
  {
    img: img1,
    tag: "PORTABLE JUICER",
    title: "Blend Anywhere – Carbon Black",
    description:
      "Rechargeable portable juicer with high-speed blades. Perfect for smoothies, protein shakes, and fresh juice.",
    href: "/products/portable-juicer?variant=black",
  },
  {
    img: img2,
    tag: "ON-THE-GO BLENDING",
    title: "Ocean Blue Edition",
    description:
      "Compact, lightweight, and powerful. Blend fruits and ice anytime, anywhere.",
    href: "/products/portable-juicer?variant=blue",
  },
  {
    img: img3,
    tag: "MINIMAL DESIGN",
    title: "Coconut White Edition",
    description:
      "Stylish portable juicer with easy cleaning and long battery life.",
    href: "/products/portable-juicer?variant=Coconot",
  },
  {
    img: img4,
    tag: "POWERFUL MOTOR",
    title: "Ice Grey Edition",
    description:
      "Stainless steel blades with leak-proof lid for everyday use.",
    href: "/products/portable-juicer?variant=ice",
  },
  {
    img: img5,
    tag: "FRESH JUICE",
    title: "Ruby Red Edition",
    description:
      "Your daily nutrition partner. Blend fresh juice in seconds.",
    href: "/products/portable-juicer?variant=ruby",
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
    <section className={`relative w-full bg-[]#fff] ${className}`}>
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
      <div className="px-5 py-8 dark:bg-[#fffffff0]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-[#000] text-[15px] font-bold tracking-widest mb-2 uppercase">
              BlendRas {activeSlide.tag}
            </p>

            <h2 className="text-[#000] text-[28px] font-bold leading-[36px] mb-3">
              {activeSlide.title}
            </h2>

            <p className="text-black/80 text-sm leading-relaxed mb-6">
              {activeSlide.description}
            </p>

            <Link href={activeSlide.href} className="backdrop-blur-md bg-white/90 py-2 mx-auto text-center text-black inline-block w-[150px] px-3 my-3 hover:bg-gray-200 transition-colors duration-300 border-[#000] hover:font-[700] border-[1px] rounded-[4px]" >
              Shop Now
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MobileInformativeSlider;
