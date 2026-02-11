'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Check } from "lucide-react";
import { Product } from "@/data/types";

type BannerSectionProps = {
  productData?: Product[];
};

const BannerSection = ({ productData }: BannerSectionProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addItem } = useCartStore();

  const product = productData?.[0];
  const activeVariant = product?.variant?.[activeIdx];

  // ⛔ Prevent render until data is ready
  if (!product || !activeVariant) return null;

  const imageUrl = activeVariant.images?.[0]?.url;

  const handleAddToCart = () => {
    if (!imageUrl) return;

    addItem({
      id: crypto.randomUUID(), // UI only
      productId: String(product.id), // ✅ string
      slug: product.slug,
      title: product.title,
      variantKey: String(activeVariant.id), // ✅ string
      price: Number(activeVariant.sellingPrice), // ✅ number
      mrp: Number(activeVariant.mrp), // ✅ number
      image: imageUrl, // ✅ string URL
      quantity: 1,
    },true);
  };
const discountPercent = (activeVariant.mrp && activeVariant.sellingPrice && activeVariant.mrp > 0) 
      ? Math.round(((activeVariant.mrp - activeVariant.sellingPrice) / activeVariant.mrp) * 100) 
      : 0;
  return (
    <section id="hero" className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)]" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              {discountPercent}% OFF — Limited Time Only
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#000] xl:text-6xl font-bold leading-[1.1] mb-6">
            Blend Fresh,
            <br />
            <span className="bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)]  bg-clip-text  text-transparent">Live Healthy.</span>
          </h1>

          <div
            className="text-[#6f6f7b] text-[16px] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
            {["USB-C Charging", "6-Blade Power", "Self-Cleaning"].map((feature) => (
              <div key={feature} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-foreground/70">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Button 
              size="lg" 
              className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold bg-gradient-primary shadow-glow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer text-[#fff]"
              onClick={handleAddToCart}
            >
              Shop Now — ₹{activeVariant.sellingPrice}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-[#6f6f7b]">
              <span className="text-lg line-through">₹{activeVariant?.mrp}</span>
              <span className="text-sm bg-[#ef43431a] text-[#ef4343] px-2 py-0.5 rounded-full font-medium">
                Save {discountPercent}%
              </span>
            </div>
          </div>

          {/* VARIANT SELECTOR */}
          <div className="mt-10 space-y-3">
            <p className="text-sm text-[#6f6f7b]">
              Choose your color:{" "}
              <span className="text-foreground font-medium">
                {activeVariant.colorName}
              </span>
            </p>

            <div className="flex gap-3 justify-center lg:justify-start">
              {product.variant.map((v, index) => (
                <button
                  key={v.id}
                  onClick={() => setActiveIdx(index)}
                  className={`cursor-pointer w-10 h-10 rounded-full ring-2 ring-offset-2 ${
                    index === activeIdx ? "ring-primary scale-110" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
          </div>
                    {/* Trust Badge */}
          <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary ring-2 ring-background flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{String.fromCharCode(64 + i)}</span>
                </div>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1 font-semibold">4.9</span>
              </div>
              <p className="text-[#6f6f7b]">2,000+ happy customers</p>
            </div>
          </div>
        </motion.div>

        {/* IMAGE */}
        <motion.div className="relative flex justify-center order-1 lg:order-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-80 h-80 rounded-full blur-3xl opacity-40 transition-colors duration-500"
              style={{ backgroundColor: activeVariant.colorHex }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeVariant.id}
              src={`${process.env.NEXT_PUBLIC_CMS_URL}${imageUrl}`}
              className="relative drop-shadow-2xl float-animation w-full lg:h-[550px] h-full object-cover select-none cursor-pointer drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            />
          </AnimatePresence>
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 top-1/3 glass rounded-2xl px-4 py-3 shadow-lg"
          >
            <p className="text-xs text-muted-foreground">Battery Life</p>
            <p className="text-lg font-bold text-foreground text-sm">15+ Blends</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -left-4 bottom-1/3 glass rounded-2xl px-4 py-3 shadow-lg"
          >
            <p className="text-xs text-muted-foreground">Blend Time</p>
            <p className="text-lg text-sm font-bold text-foreground">30 Seconds</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BannerSection;