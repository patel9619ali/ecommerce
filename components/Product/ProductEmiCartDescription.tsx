"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Variant } from "@/data/types";
import { useEffect, useState } from "react";
import ImageHoverZoom from "./ImageHoverZoom";
import Link from "next/link";
import { ProductBenefitsCarousel } from "./ProductBenefitsCarousel";
import { ProductColorSelector } from "./ProductColorSelector";

type Props = {
  product: Product;
  variant: Variant;
  setVariantKey: React.Dispatch<React.SetStateAction<string>>
  setPreviewVariantKey: React.Dispatch<React.SetStateAction<string | null>>
  previewVariantKey: string | null
};

export default function ProductEmiCartDescription({ product, variant,setVariantKey,setPreviewVariantKey,previewVariantKey }: Props) {
    return(
        <>
        <div>
            <div className="px-2 border-b border-[#f4f4f4] pb-3">
                <h2 className="text-[#000] lg:text-[24px] text-[18px] font-[600]">{`Noise Newly Launched Airwave Max XR Wireless Over-Ear Headphones with 120H Playtime, ANC, HFA Tech, Spatial Audio, Dual Pairing,BT V6.0 (Carbon ${variant.name})`}</h2>
                <Link href="/" className="lg:text-[18px] text-[14px] hover:text-[#2162a1] text-[#000] hover:no-underline mb-2 block">Visit our instagram store</Link>
                <p className="text-[#000] lg:text-[14px] text-[12px] font-[600]">500+ bought in past month</p>
            </div>
            <div className="pt-3">
                <span className="text-[#cc0c39] font-[300] lg:text-[24px] text-[20px] mr-2">-30%</span>
                <span className="text-[#000] font-[500] lg:text-[28px] text-[24px]">₹3,499</span>
            </div>
            <div>
                <span className="text-[#000] font-[500] text-[16px] mr-2">M.R.P.: </span>
                <span className="line-through text-[16px] text-[#000] font-[500] ">₹4,999</span>
            </div>
            <p className="text-[#000] font-[500] lg:text-[28px] text-[18px]">Inclusive of all taxes</p>
            <ProductBenefitsCarousel benefits={variant.benefits} />
            <ProductColorSelector product={product} activeKey={variant.key} onHover={setPreviewVariantKey} onLeave={() => setPreviewVariantKey(null)} onSelect={setVariantKey} previewVariantKey={previewVariantKey}/>
            <div className="mt-6">
                <h3 className="text-black text-lg font-semibold mb-2">
                    About this item
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-black/90 text-sm">
                    <li>120-hour battery life with fast charging</li>
                    <li>Hybrid Active Noise Cancellation</li>
                    <li>40mm dynamic drivers</li>
                    <li>Dual pairing & spatial audio</li>
                </ul>
            </div>

        </div>
        </>
    )
}