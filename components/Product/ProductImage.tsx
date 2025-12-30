"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Variant } from "@/data/types";
import { useEffect, useState } from "react";
import ImageHoverZoom from "./ImageHoverZoom";

type Props = {
  product: Product;
  variant: Variant;
};

export default function ProductImage({ product, variant }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [variant.key]);

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 py-5">
      {/* THUMBNAILS */}
      <div className="flex flex-col gap-3">
        {variant.images.map((img, index) => (
          <button
            key={`${variant.key}-thumb-${index}`}
            onMouseEnter={() => setActiveIndex(index)}
            className={`border rounded-lg overflow-hidden transition-all cursor-pointer duration-200
              ${
                activeIndex === index
                  ? "border-white scale-105"
                  : "border-white/30 opacity-70 hover:opacity-100"
              }`}
          >
            <Image
              src={img}
              alt={`${variant.name} thumbnail`}
              width={80}
              height={80}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE + ZOOM */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${variant.key}-${activeIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ImageHoverZoom
            src={variant.images[activeIndex]}
            alt={`${product.title} - ${variant.name}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
