"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Check } from "lucide-react";
import { Product, Variant } from "@/data/types";
import LoadingLink from "../Loader/LoadingLink";
import { startTransition } from "react";
import { isPortableJuicerCategory } from "@/lib/product-url";

type BannerSectionProps = {
  productData?: Product[];
  bannerProductSlug?: string;
  includeAllProductVariants?: boolean;
};

type VariantItem = {
  product: Product;
  variant: Variant;
};

const BannerSection = ({
  productData,
  bannerProductSlug,
  includeAllProductVariants = false,
}: BannerSectionProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addItem } = useCartStore();

  const targetProduct = useMemo(() => {
    if (!productData?.length) return null;

    if (bannerProductSlug) {
      const bySlug = productData.find((p) => p.slug === bannerProductSlug);
      if (bySlug) return bySlug;
    }

    const juicerProduct = productData.find((p) =>
      isPortableJuicerCategory(p.category?.name || p.category?.slug)
    );

    return juicerProduct || productData[0];
  }, [productData, bannerProductSlug]);

  const variantItems = useMemo<VariantItem[]>(() => {
    if (!productData?.length) return [];

    if (includeAllProductVariants) {
      return productData.flatMap((product) =>
        (product.variant || []).map((variant) => ({ product, variant }))
      );
    }

    if (!targetProduct) return [];

    return (targetProduct.variant || []).map((variant) => ({
      product: targetProduct,
      variant,
    }));
  }, [productData, includeAllProductVariants, targetProduct]);

  if (!variantItems.length) return null;

  const safeActiveIdx = Math.min(activeIdx, variantItems.length - 1);
  const activeItem = variantItems[safeActiveIdx];
  const product = activeItem.product;
  const activeVariant = activeItem.variant;
  const imageUrl = activeVariant.images?.[0]?.url;

  const handleAddToCart = () => {
    if (!imageUrl) return;

    startTransition(() => {
      addItem(
        {
          id: `${product.id}-${activeVariant.sku}`,
          productId: String(product.id),
          slug: product.slug,
          brandSlug: product.brand?.slug || product.brand?.name,
          categorySlug: product.category?.slug || product.category?.name,
          title: product.title,
          variantKey: String(activeVariant.sku),
          price: Number(activeVariant.sellingPrice),
          mrp: Number(activeVariant.mrp),
          image: imageUrl,
          quantity: 1,
        },
        true
      );
    });
  };

  const discountPercent =
    activeVariant.mrp && activeVariant.sellingPrice && activeVariant.mrp > 0
      ? Math.round(((activeVariant.mrp - activeVariant.sellingPrice) / activeVariant.mrp) * 100)
      : 0;

  return (
    <>
      <div className="bg-[#000] text-[#fafafa] text-center py-2.5 text-sm">
        <span className="font-semibold">{`${discountPercent}% OFF`}</span> - Limited Time Only |
        <LoadingLink className="underline underline-offset-2 font-medium ml-3" href="/products">
          Shop Now
        </LoadingLink>
      </div>
      <section id="hero" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)]" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">
                {discountPercent}% OFF - Limited Time Only
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#000] xl:text-6xl font-bold leading-[1.1] mb-6">
              Blend Fresh,
              <br />
              <span className="bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] bg-clip-text text-transparent">
                Live Healthy.
              </span>
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

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-lg font-semibold bg-gradient-primary shadow-glow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer text-[#fff]"
                onClick={handleAddToCart}
              >
                Shop Now - Rs {activeVariant.sellingPrice}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 text-[#6f6f7b]">
                <span className="text-lg line-through">Rs {activeVariant?.mrp}</span>
                <span className="text-sm bg-[#ef43431a] text-[#ef4343] px-2 py-0.5 rounded-full font-medium">
                  Save {discountPercent}%
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <p className="text-sm text-[#6f6f7b]">
                Choose your color:
                <span className="text-foreground font-medium ml-1">{activeVariant.colorName}</span>
              </p>

              <div className="flex gap-3 justify-center lg:justify-start">
                {variantItems.map((item, index) => (
                  <button
                    key={`${item.product.id}-${item.variant.id}`}
                    onClick={() => setActiveIdx(index)}
                    className={`cursor-pointer w-10 h-10 rounded-full ring-2 ring-offset-2 ${
                      index === safeActiveIdx ? "ring-primary scale-110" : "ring-transparent"
                    }`}
                    style={{ backgroundColor: item.variant.colorHex }}
                    title={`${item.product.title} - ${item.variant.colorName}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-primary ring-2 ring-background flex items-center justify-center"
                  >
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

          <motion.div className="relative flex justify-center order-1 lg:order-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-80 h-80 rounded-full blur-3xl opacity-40 transition-colors duration-500"
                style={{ backgroundColor: activeVariant.colorHex }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.img
                key={`${product.id}-${activeVariant.id}`}
                src={`${imageUrl}`}
                className="relative float-animation w-full lg:h-[550px] h-full object-cover select-none cursor-pointer drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                alt={`${product.title} ${activeVariant.colorName}`}
              />
            </AnimatePresence>
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
    </>
  );
};

export default BannerSection;
