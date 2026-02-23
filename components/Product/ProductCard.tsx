import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Heart, Star } from "lucide-react";
import { Product } from "@/data/dummyProduct";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    isMobile ? [autoplayPlugin.current] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  // Desktop hover: scroll to next image
  useEffect(() => {
    if (!emblaApi || isMobile) return;
    if (isHovered && product.images.length > 1) {
      emblaApi.scrollTo(1);
    } else {
      emblaApi.scrollTo(0);
    }
  }, [isHovered, emblaApi, isMobile, product.images.length]);

  return (
    <div
      className="group relative bg-[hsl(0,0%,100%)] rounded-lg overflow-hidden border border-[hsl(260,15%,90%)] hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[3/4] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              <img
                src={img}
                alt={`${product.name} - view ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === selectedIndex
                    ? "bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] w-4"
                    : "bg-[hsl(0,0%,10%)]/30"
                }`}
                onClick={() => emblaApi?.scrollTo(idx)}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[hsl(0,0%,10%)] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-8 left-2 flex items-center gap-1 bg-[hsl(0,0%,100%)]/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold">
          <span>{product.rating}</span>
          <Star className="w-3 h-3 fill-[hsl(45,100%,50%)] text-[hsl(45,100%,50%)]" />
          <span className="text-[hsl(260,10%,45%)]">| {product.reviewCount >= 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount}</span>
        </div>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-[hsl(0,0%,100%)]/80 backdrop-blur-sm border border-[hsl(260,15%,90%)] hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            wishlisted
              ? "fill-[hsl(340,80%,55%)] text-[hsl(340,80%,55%)]"
              : "text-[hsl(260,10%,45%)]"
          }`}
        />
      </button>

      {/* Product Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm text-[hsl(0,0%,10%)] truncate">
          {product.name}
        </h3>
        <p className="text-xs text-[hsl(260,10%,45%)] truncate">
          {product.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="font-bold text-sm text-[hsl(0,0%,10%)]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-[hsl(260,10%,45%)] line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-semibold text-[hsl(16,90%,55%)]">
            ({product.discount}% OFF)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
