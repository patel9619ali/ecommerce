'use client';

import { useState, useMemo } from "react";
import ProductCard from "@/components/Product/ProductCard";
import { Filter, ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MainProductPage = ({ product }: any) => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Flatten variants
  const allVariants = useMemo(() => {
    if (!product?.data) return [];

    return product.data.flatMap((item: any) =>
      item.variant.map((variant: any) => ({
        id: variant.id,
        slug: item.slug,                 // ✅ IMPORTANT
        productId: item.id?.toString(),  // ✅ IMPORTANT
        variantId: variant.sku,          // ✅ IMPORTANT (this is your SKU)
        name: item.title,
        description: item.subTitle,
        price: Number(variant.sellingPrice),
        originalPrice: Number(variant.mrp),
        discount:
          variant.mrp && variant.sellingPrice
            ? Math.round(
                ((variant.mrp - variant.sellingPrice) / variant.mrp) * 100
              )
            : 0,
        rating: item.rating,
        reviewCount: item.ratingCount,
        images: variant.images.map((img: any) => img.url),
        category: item.title,
        color: variant.colorName,
        colorHex: variant.colorHex,      // ✅ IMPORTANT
      }))
    );
  }, [product]);

  // ✅ Dynamic filter options
    const categories = useMemo<string[]>(() => {
    const unique = [
        ...new Set<string>(allVariants.map((p: any) => p.category))
    ];
    return ["All", ...unique];
    }, [allVariants]);

    const colors = useMemo<string[]>(() => {
    const unique = [
        ...new Set<string>(allVariants.map((p: any) => p.color))
    ];
    return ["All", ...unique];
    }, [allVariants]);

  // ✅ Filter logic
  const filteredProducts = allVariants.filter((p: any) => {
    const categoryMatch =
      selectedCategory === "All" || p.category === selectedCategory;
    const colorMatch =
      selectedColor === "All" || p.color === selectedColor;
    return categoryMatch && colorMatch;
  });

  // ✅ Sort logic
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
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

  // 🔹 Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2"
                  : "text-gray-500 hover:text-black hover:bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
          Color
        </h3>
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

      {/* Header */}
      <div>
        <div className="container mx-auto px-4 py-3 sm:flex items-center justify-between">
          <div className="text-sm text-gray-500 w-full sm:w-auto mb-5 sm:mb-0">
            Home / <span className="font-medium text-black">All Products</span>
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

      {/* Mobile Filter Overlay */}
      {isMobile && showFilters && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setShowFilters(false)}
        >
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
            <FilterSidebar />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-56 shrink-0">
              <h2 className="font-bold text-base uppercase mb-4">
                Filters
              </h2>
              <FilterSidebar />
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
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