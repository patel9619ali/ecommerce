"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Variant } from "@/data/types";
import { useEffect, useState } from "react";
import ImageHoverZoom from "./ImageHoverZoom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

type Props = {
  product: Product;
  variant: Variant;
};

const MOBILE_THUMB_LIMIT = 4;

export default function ProductImage({ product, variant }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbDialogOpen, setThumbDialogOpen] = useState(false);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 1024;

  useEffect(() => {
    setActiveIndex(0);
  }, [variant.key]);

  const mobileThumbs = variant.images.slice(0, MOBILE_THUMB_LIMIT);
  const extraCount = variant.images.length - MOBILE_THUMB_LIMIT;

  return (
    <div className="grid lg:grid-cols-[90px_1fr] gap-4">
      {/* ================= THUMBNAILS ================= */}
      <div className="flex lg:flex-col flex-row gap-3 lg:order-1 order-2 lg:overflow-x-hidden overflow-x-auto">
        {/* ---------- MOBILE (LIMITED +X) ---------- */}
        {isMobile ? (
          <>
            {mobileThumbs.map((img, index) => (
              <button
                key={`${variant.key}-thumb-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`border rounded-lg overflow-hidden transition-all duration-200
                  ${
                    activeIndex === index
                      ? "border-white scale-105"
                      : "border-white/30 opacity-70"
                  }`}
              >
                <Image
                  src={img.src}
                  alt={`${variant.name} thumbnail`}
                  width={80}
                  height={80}
                  className="w-[80px] h-[80px] object-cover"
                />
              </button>
            ))}

            {extraCount > 0 && (
              <button
                onClick={() => setThumbDialogOpen(true)}
                className="w-[80px] h-[80px] rounded-lg border border-dashed border-white/40 bg-black/70 text-white text-sm font-semibold flex items-center justify-center"
              >
                +{extraCount}
              </button>
            )}
          </>
        ) : (
          /* ---------- DESKTOP (UNCHANGED) ---------- */
          variant.images.map((img, index) => (
            <button
              key={`${variant.key}-thumb-${index}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`border-2 cursor-pointer rounded-lg overflow-hidden transition-all duration-200
                ${
                  activeIndex === index
                    ? "border-white scale-105"
                    : "border-white/30 opacity-70 hover:opacity-100"
                }`}
            >
              <Image
                src={img.src}
                alt={`${variant.name} thumbnail`}
                width={60}
                height={60}
                className="w-full object-cover h-[60px]"
              />
            </button>
          ))
        )}
      </div>

      {/* ================= MAIN IMAGE ================= */}
      {isMobile ? (
        <div className="order-1">
          <ImageHoverZoom
            src={variant.images[activeIndex].src}
            alt={`${product.title} - ${variant.name}`}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${variant.key}-${activeIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:order-2 order-1"
          >
            <ImageHoverZoom
              src={variant.images[activeIndex].src}
              alt={`${product.title} - ${variant.name}`}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* ================= MOBILE THUMB DIALOG ================= */}
      <Dialog open={thumbDialogOpen} onOpenChange={setThumbDialogOpen}>
        <DialogContent className=" bottom-0 top-auto rounded-t-2xl p-0 max-h-[75vh] w-full dark:bg-[#fffffff0]">
          <DialogHeader className="p-4 flex flex-row justify-between items-center border-b">
              <DialogTitle className="text-[#000] text-start xs:text-[23px] text-md font-semibold break-all">All Images</DialogTitle>
              <DialogClose className="group lg:bg-[#fff] bg:transparent text-white hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0 cursor-pointer z-3">
                      <X size={30} fill="#fff" stroke="#000" className="troke-black transition-colors duration-200 group-hover:stroke-white"/>
                  </DialogClose>
          </DialogHeader>

<div className="grid grid-cols-4 gap-3 px-4 py-4 overflow-y-auto">
{variant.images.map((img, index) => (
<button
key={`dialog-thumb-${index}`}
onClick={() => {
  setActiveIndex(index);
  setThumbDialogOpen(false);
}}
className={`relative aspect-square rounded-md overflow-hidden border
  ${
    activeIndex === index
      ? "border-white"
      : "border-white/30"
  }`}
>
<Image
  src={img.src}
  alt={`${variant.name} thumbnail`}
  fill
  sizes="25vw"
  className="object-cover"
/>
</button>
))}
</div>
</DialogContent>
      </Dialog>

    </div>
  );
}
