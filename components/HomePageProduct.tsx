'use client';

import { Star, Eye } from "lucide-react";
import LoadingLink from "./Loader/LoadingLink";
import { Product } from "@/data/types";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  buildProductPathWithVariant,
  isPortableJuicerCategory,
  toRouteSegment,
} from "@/lib/product-url";

type Props = {
  productData?: Product[];
  preferredCategorySlug?: string;
  currentProductSlug?: string;
  currentVariantSku?: string | null;
  prioritizePortableJuicer?: boolean;
};

type VariantCardItem = {
  id: number;
  slug: string;
  productId: string;
  variantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  images: string[];
  color: string;
  colorHex: string;
  brandSlug?: string;
  categorySlug?: string;
  categoryName: string;
};

const ProductCard = ({ variant }: { variant: VariantCardItem }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <LoadingLink
      key={`${variant.variantId}-${variant.productId}`}
      href={buildProductPathWithVariant(
        {
          slug: variant.slug,
          brandSlug: variant.brandSlug,
          categorySlug: variant.categorySlug,
        },
        variant.variantId
      )}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#fff] border border-[#ffffff06] hover:border-[#ffffff15] transition-all duration-500"
    >
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {variant.images.map((img: string, index: number) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{ backgroundColor: variant.colorHex }}
              />
              <img
                src={img}
                alt={`${variant.name} - ${variant.color} view ${index + 1}`}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              />
            </div>
          ))}
        </div>

        <span className="absolute top-3 right-3 z-10 text-[12px] font-bold text-[#62dab2] bg-[hsl(160,60%,65%,0.12)] backdrop-blur-lg px-2 py-1 rounded-full">
          {variant.discount}%
        </span>

        {variant.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {variant.images.map((_, i: number) => (
              <span key={i} className="w-1 h-1 rounded-full bg-white/50" />
            ))}
          </div>
        )}

        <div className="absolute inset-0 z-[2] bg-[#0a0014]/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0 ring-1 ring-[#ffffff15]"
            style={{ backgroundColor: variant.colorHex }}
          />
          <span className="text-[11px] text-[#7a5faa] font-medium truncate">{variant.color}</span>
        </div>

        <h3 className="font-bold text-[16px] leading-tight text-gradient">{variant.name}</h3>

        <p className="text-[11px] text-[#6b5590] line-clamp-1 hidden sm:block">{variant.description}</p>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-2.5 h-2.5 ${
                i < Math.floor(variant.rating)
                  ? "fill-[hsl(45,100%,60%)] text-[hsl(45,100%,60%)]"
                  : "text-[#2a1845]"
              }`}
            />
          ))}
          <span className="text-[10px] text-[#6b5590] ml-0.5">{variant.rating}</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-[#ffffff06]">
          <span className="text-[20px] font-extrabold text-gradient">Rs {variant.price.toLocaleString()}</span>
          <span className="text-[11px] text-[#4a3568] line-through">Rs {variant.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </LoadingLink>
  );
};

const HomePageProduct = ({
  productData,
  preferredCategorySlug,
  currentProductSlug,
  currentVariantSku,
  prioritizePortableJuicer = true,
}: Props) => {
  const pathname = usePathname();

  const sections = useMemo(() => {
    const grouped = new Map<
      string,
      { label: string; rows: VariantCardItem[]; brandSlug?: string }
    >();

    if (!productData?.length) return [];

    for (const item of productData) {
      const label = item.category?.name || "Products";
      const categorySlug =
        toRouteSegment(item.category?.slug || item.category?.name || "products") ||
        "products";
      const itemBrandSlug = toRouteSegment(item.brand?.slug || item.brand?.name) || undefined;

      const rows = (item.variant || [])
        .filter((variant) => {
          if (!currentProductSlug || item.slug !== currentProductSlug) {
            return true;
          }
          return !currentVariantSku || variant.sku !== currentVariantSku;
        })
        .map((variant) => ({
          id: variant.id,
          slug: item.slug,
          productId: item.id?.toString(),
          variantId: variant.sku,
          name: item.title,
          description: item.subTitle,
          price: Number(variant.sellingPrice),
          originalPrice: Number(variant.mrp),
          discount:
            variant.mrp && variant.sellingPrice
              ? Math.round(((variant.mrp - variant.sellingPrice) / variant.mrp) * 100)
              : 0,
          rating: item.rating,
          images: variant.images.map((img) => img.url),
          color: variant.colorName,
          colorHex: variant.colorHex,
          brandSlug: itemBrandSlug,
          categorySlug,
          categoryName: label,
        }));

      if (!rows.length) continue;

      const current = grouped.get(categorySlug);
      if (current) {
        current.rows.push(...rows);
      } else {
        grouped.set(categorySlug, { label, rows, brandSlug: itemBrandSlug });
      }
    }

    const preferred = toRouteSegment(preferredCategorySlug);
    const sectionRows = Array.from(grouped.entries()).map(([slug, item]) => ({
      key: slug,
      title: `Explore Our ${item.label}`,
      variants: item.rows,
      brandSlug: item.brandSlug,
      portable: isPortableJuicerCategory(slug) || isPortableJuicerCategory(item.label),
      preferred: preferred ? slug === preferred : false,
    }));

    sectionRows.sort((a, b) => {
      if (a.preferred && !b.preferred) return -1;
      if (!a.preferred && b.preferred) return 1;

      if (prioritizePortableJuicer) {
        if (a.portable && !b.portable) return -1;
        if (!a.portable && b.portable) return 1;
      }

      return a.title.localeCompare(b.title);
    });

    return sectionRows;
  }, [
    productData,
    preferredCategorySlug,
    currentProductSlug,
    currentVariantSku,
    prioritizePortableJuicer,
  ]);

  if (!sections.length) return null;

  const normalizedPath = pathname?.replace(/\/$/, "") || "";

  return (
    <section id="products" className="py-24 bg-[linear-gradient(180deg,hsl(262,40%,98%)_0%,hsl(262,30%,95%)_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-[hsl(320,85%,65%)] uppercase tracking-[0.2em] mb-0">Our Collection</p>
        </div>

        {sections.map((section) => {
          const categoryPath = section.brandSlug
            ? `/product/${section.brandSlug}/${section.key}`
            : null;
          const shouldShowViewAll =
            !!categoryPath && normalizedPath !== categoryPath;

          return (
            <div key={section.key} className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[20px] lg:text-5xl font-bold text-gradient mb-0">{section.title}</h2>
                {shouldShowViewAll && (
                  <LoadingLink
                    href={categoryPath}
                    className="text-[18px] lg:text-[26px] font-semibold text-[#4f46e5] hover:text-[#312e81]"
                  >
                    View All
                  </LoadingLink>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {section.variants.map((variant) => (
                  <ProductCard key={`${variant.variantId}-${variant.productId}`} variant={variant} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomePageProduct;
