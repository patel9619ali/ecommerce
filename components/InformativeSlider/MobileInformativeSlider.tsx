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
      <div className="px-5 py-8 bg-[linear-gradient(180deg,#f9f8fc_0%,#f1eef6_100%)]">
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

            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/products/${product?.slug}?variant=${variants[selectedIndex].sku}`} className="w-full h-13 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)] font-bold text-sm md:text-base rounded-xl shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] hover:shadow-[0_10px_40px_-8px_hsl(252_80%_60%/0.18),0_4px_16px_-4px_hsl(240_15%_10%/0.06)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2 py-3 cursor-pointer" >
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
