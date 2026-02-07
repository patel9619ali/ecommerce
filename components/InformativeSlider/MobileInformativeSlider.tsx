"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EmblaDots } from "./EmblaDots";
import { Product } from '@/data/types'

const options: EmblaOptionsType = {
  loop: true,
};
type Props = {
  className?: string;
  productData?: Product[];
};




const MobileInformativeSlider = ({ className,productData }: Props) => {
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

  const product = productData?.[0];
  const variants = product?.variant || [];

  return (
    <section className={`relative w-full bg-[]#fff] ${className}`}>
      {/* ================= IMAGE SLIDER ================= */}
      <div ref={emblaRef} className="relative overflow-hidden h-[300px]">
        <div className="flex">
          {variants.map((variant, index) => {
            const img = variant.images?.[0];
            return (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              <img
                  src={`${process.env.NEXT_PUBLIC_CMS_URL}${img?.url}`}
                  alt={img?.name || variant.colorName}
                className="w-full aspect-[3/4] object-cover h-[300px]"
              />
            </div>
            );
          })}
        </div>

        {/* DOTS ON IMAGE */}
        <EmblaDots
          count={variants.length}
          activeIndex={selectedIndex}
          onSelect={scrollTo}
        />
      </div>

      {/* ================= TEXT CONTENT (STATIC) ================= */}
      <div className="px-5 py-8 dark:bg-[#fffffff0]">
        <AnimatePresence mode="wait">
          {variants[selectedIndex] && (
            <motion.div
              key={variants[selectedIndex].sku}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
            <p className="text-[#000] text-[15px] font-bold tracking-widest mb-2 uppercase">
              {product?.title}
            </p>

            <h2 className="text-[#000] text-[28px] font-bold leading-[36px] mb-3">
              {`Portable Juicer - ${variants[selectedIndex].colorName}`}
            </h2>

              {product?.description && (
                <p
                  className="text-black/80 text-sm leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/products/${product?.slug}?variant=${variants[selectedIndex].sku}`} className="backdrop-blur-md bg-white/90 py-2 mx-auto text-center text-black inline-block w-[150px] px-3 my-3 hover:bg-gray-200 transition-colors duration-300 border-[#000] hover:font-[700] border-[1px] rounded-[4px]" >
              Shop Now
            </Link>
          </motion.div>
          )};
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MobileInformativeSlider;
