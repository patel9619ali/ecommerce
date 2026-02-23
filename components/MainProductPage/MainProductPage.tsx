'use client';
import { useState } from "react";
import { products, categories, colors } from "@/data/dummyProduct";
import ProductCard from "@/components/Product/ProductCard";
import { Filter, ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MainProductPage = ({ product }: any) => {
    console.log("Product in MainProductPage:", product);
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter((p:any) => {
    const catMatch = selectedCategory === "All" || p.category === selectedCategory;
    const colorMatch = selectedColor === "All" || p.color === selectedColor;
    return catMatch && colorMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "discount": return b.discount - a.discount;
      default: return 0;
    }
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(0,0%,10%)] mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat:any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                selectedCategory === cat
                  ? "bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] text-white font-semibold"
                  : "text-[hsl(260,10%,45%)] hover:text-[hsl(0,0%,10%)] hover:bg-[hsl(260,20%,96%)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider text-[hsl(0,0%,10%)] mb-3">Color</h3>
        <div className="space-y-2">
          {colors.map((color:any) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                selectedColor === color
                  ? "bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] text-white font-semibold"
                  : "text-[hsl(260,10%,45%)] hover:text-[hsl(0,0%,10%)] hover:bg-[hsl(260,20%,96%)]"
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
    <div className="min-h-screen bg-[hsl(0,0%,100%)]">

      {/* Breadcrumb & Sort */}
      <div className="border-b border-[hsl(260,15%,90%)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[hsl(260,10%,45%)]">
            <span>Home</span>
            <span>/</span>
            <span className="text-[hsl(0,0%,10%)] font-medium">All Products</span>
            <span className="text-xs ml-2">({sortedProducts.length} items)</span>
          </div>

          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-sm font-medium text-[hsl(0,0%,10%)] border border-[hsl(260,15%,90%)] rounded-md px-3 py-1.5"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            )}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[hsl(0,0%,100%)] border border-[hsl(260,15%,90%)] rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-[hsl(0,0%,10%)] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(260,10%,45%)] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobile && showFilters && (
        <div className="fixed inset-0 z-50 bg-[hsl(0,0%,100%)]/80 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-[hsl(0,0%,100%)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg uppercase tracking-wider">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-56 shrink-0">
              <h2 className="font-bold text-base uppercase tracking-wider mb-4">Filters</h2>
              <FilterSidebar />
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[hsl(260,10%,45%)] text-lg">No products found</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedColor("All"); }}
                  className="mt-4 bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(280,80%,50%)_50%,hsl(320,85%,55%)_100%)] text-white px-6 py-2 rounded-lg text-sm font-semibold"
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
