'use client';

import { useState, useMemo } from "react";
import ProductCard from "@/components/Product/ProductCard";
import { Filter, ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { isPortableJuicerCategory, toRouteSegment } from "@/lib/product-url";

type Props = {
  product: any;
  initialCategorySlug?: string;
  lockToCategory?: boolean;
  breadcrumbLabel?: string;
};

const MainProductPage = ({
  product,
  initialCategorySlug,
  lockToCategory = false,
  breadcrumbLabel = "All Products",
}: Props) => {
  const isMobile = useIsMobile();
  const normalizedInitialCategory = toRouteSegment(initialCategorySlug) || "all";

  const [selectedCategorySlug, setSelectedCategorySlug] = useState(normalizedInitialCategory);
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const allVariants = useMemo(() => {
    if (!product?.data) return [];

    return product.data.flatMap((item: any) =>
      item.variant.map((variant: any) => ({
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
        reviewCount: item.ratingCount,
        images: variant.images.map((img: any) => img.url),
        category: item.category?.name || item.title,
        categorySlug: toRouteSegment(item.category?.slug || item.category?.name || "products") || "products",
        brandSlug: item.brand?.slug || item.brand?.name,
        color: variant.colorName,
        colorHex: variant.colorHex,
      }))
    );
  }, [product]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();

    allVariants.forEach((item: any) => {
      if (!map.has(item.categorySlug)) {
        map.set(item.categorySlug, item.category);
      }
    });

    const ordered = Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => {
        const aPortable = isPortableJuicerCategory(a.slug) || isPortableJuicerCategory(a.name);
        const bPortable = isPortableJuicerCategory(b.slug) || isPortableJuicerCategory(b.name);
        if (aPortable && !bPortable) return -1;
        if (!aPortable && bPortable) return 1;
        return a.name.localeCompare(b.name);
      });

    return [{ slug: "all", name: "All" }, ...ordered];
  }, [allVariants]);

  const colors = useMemo(() => {
    const unique = [...new Set<string>(allVariants.map((p: any) => p.color))];
    return ["All", ...unique];
  }, [allVariants]);

  const effectiveCategorySlug = lockToCategory ? normalizedInitialCategory : selectedCategorySlug;

  const filteredProducts = useMemo(() => {
    return allVariants.filter((p: any) => {
      const categoryMatch = effectiveCategorySlug === "all" || p.categorySlug === effectiveCategorySlug;
      const colorMatch = selectedColor === "All" || p.color === selectedColor;
      return categoryMatch && colorMatch;
    });
  }, [allVariants, effectiveCategorySlug, selectedColor]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "discount":
          return b.discount - a.discount;
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const groupedProducts = useMemo(() => {
    const map = new Map<string, { title: string; items: any[] }>();

    for (const item of sortedProducts) {
      const key = item.categorySlug;
      const current: { title: string; items: any[] } =
        map.get(key) ?? { title: item.category, items: [] as any[] };
      current.items.push(item);
      map.set(key, current);
    }

    const rows = Array.from(map.entries()).map(([slug, value]) => ({
      slug,
      title: value.title,
      items: value.items,
      portable: isPortableJuicerCategory(slug) || isPortableJuicerCategory(value.title),
    }));

    rows.sort((a, b) => {
      if (a.slug === normalizedInitialCategory) return -1;
      if (b.slug === normalizedInitialCategory) return 1;
      if (a.portable && !b.portable) return -1;
      if (!a.portable && b.portable) return 1;
      return a.title.localeCompare(b.title);
    });

    return rows;
  }, [sortedProducts, normalizedInitialCategory]);

  const filterSidebar = (
    <div className="space-y-6">
      {!lockToCategory && (
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`cursor-pointer block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                  selectedCategorySlug === cat.slug
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2"
                    : "text-gray-500 hover:text-black hover:bg-transparent"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Color</h3>
        <div className="space-y-2">
          {colors.map((color: string) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`cursor-pointer block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                selectedColor === color
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2"
                  : "text-gray-500 hover:text-black hover:bg-transparent"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div>
        <div className="container mx-auto px-4 py-3 sm:flex items-center justify-between">
          <div className="text-sm text-gray-500 w-full sm:w-auto mb-5 sm:mb-0">
            Home / <span className="font-medium text-black">{breadcrumbLabel}</span>
            <span className="ml-2 text-xs">({sortedProducts.length} items)</span>
          </div>

          <div className="flex items-center justify-end gap-3">
            {isMobile && (
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-1 text-sm border rounded px-3 py-1.5"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border rounded px-3 py-1.5 pr-8 text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {isMobile && showFilters && (
        <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowFilters(false)}>
          <div
            className="absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <h2 className="font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterSidebar}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {!isMobile && (
            <aside className="w-56 shrink-0">
              <h2 className="font-bold text-base uppercase mb-4">Filters</h2>
              {filterSidebar}
            </aside>
          )}

          <div className="flex-1 space-y-12">
            {groupedProducts.map((group) => (
              <section key={group.slug} className="space-y-5">
                <h2 className="text-2xl font-bold text-[#0f172a]">Explore Our {group.title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.items.map((productItem: any) => (
                    <ProductCard key={`${productItem.id}-${productItem.variantId}`} product={productItem} />
                  ))}
                </div>
              </section>
            ))}

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={() => {
                    if (!lockToCategory) setSelectedCategorySlug("all");
                    setSelectedColor("All");
                  }}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProductPage;
