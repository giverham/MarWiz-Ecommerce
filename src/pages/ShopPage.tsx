import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts, useCategories } from "../hooks/useData";
import { ProductCard } from "../components/product/ProductCard";
import { QuickView } from "../components/product/QuickView";
import type { Product, Category } from "../types";
import { formatNaira } from "../lib/utils";


interface ShopPageProps {
  categorySlug?: string;
  collectionSlug?: string;
  title?: string;
}

export function ShopPage({ categorySlug, collectionSlug, title }: ShopPageProps) {
  const { products, loading } = useProducts();
  const categories = useCategories();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(collectionSlug || null);
  const [showFilters, setShowFilters] = useState(false);
  const [showOnly, setShowOnly] = useState<string>("all");

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
      setActiveSubcategory(null);
    }
  }, [categorySlug]);



  useEffect(() => {
    if (collectionSlug) setSelectedCollection(collectionSlug);
  }, [collectionSlug]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      const parentCat = categories.find((c) => c.slug === selectedCategory);
      if (parentCat) {
        if (activeSubcategory) {
          // Filter strictly by the selected subcategory
          result = result.filter((p) => p.category?.slug === activeSubcategory);
        } else {
          // Filter by parent or any of its subcategories
          const validIds = new Set([parentCat.id, ...(parentCat.subcategories?.map(s => s.id) || [])]);
          result = result.filter((p) => validIds.has(p.category_id as string));
        }
      }
    } else if (activeSubcategory) {
       result = result.filter((p) => p.category?.slug === activeSubcategory);
    }

    if (selectedCollection) {
      result = result.filter((p) => p.collections?.some((s: any) => s.slug?.toLowerCase() === selectedCollection.toLowerCase()));
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);


    if (showOnly === "available") result = result.filter((p) => p.stock > 0);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [products, selectedCategory, activeSubcategory, selectedCollection, categories, priceRange, showOnly, sortBy]);

  const currentCategory = selectedCategory ? categories.find((c) => c.slug === selectedCategory) : null;
  
  // Clean up title logic. If we are on a parent category, the title is just the parent category name.
  const pageTitle = title || (currentCategory ? currentCategory.name : "Shop All");
  const subcategories = currentCategory?.subcategories || [];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0b0a0a] relative overflow-hidden">
      {/* Tactile Fine-Grain Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.035]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Luxury Geometric Grid Line Pattern (Highly Visible & Premium) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.12]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(212,175,55,0.15)' stroke-width='0.75'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Clear, visible ambient luxury glow */}
      <div className="absolute top-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-amber-500/15 blur-[150px] pointer-events-none z-0 animate-ambient-glow-1" />
      <div className="absolute top-[60%] right-[5%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[180px] pointer-events-none z-0 animate-ambient-glow-2" />
      <div className="absolute top-[80%] left-[8%] w-[480px] h-[480px] rounded-full bg-amber-700/12 blur-[150px] pointer-events-none z-0 animate-ambient-glow-1" />

      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="container-luxury">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="section-label mb-3">MarWiz Collection</p>
          <h1 className="font-display text-section text-ink-50">{pageTitle}</h1>
          <p className="mt-3 text-sm font-light text-ink-400">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Subcategories Filter Chips */}
        {subcategories.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`px-6 py-2.5 text-xs uppercase tracking-[0.15em] transition-all border ${
                activeSubcategory === null
                  ? "bg-gold-400 border-gold-400 text-ink-900 font-semibold"
                  : "bg-ink-900 border-ink-800 text-ink-300 hover:border-gold-400/50 hover:text-gold-400"
              }`}
            >
              All {currentCategory?.name}
            </button>
            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.slug)}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.15em] transition-all border ${
                  activeSubcategory === sub.slug
                    ? "bg-gold-400 border-gold-400 text-ink-900 font-semibold"
                    : "bg-ink-900 border-ink-800 text-ink-300 hover:border-gold-400/50 hover:text-gold-400"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between border-b border-ink-800 pb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300 hover:text-gold-400"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-ink-200 focus:outline-none"
            >
              <option value="featured" className="bg-ink-900">Featured</option>
              <option value="newest" className="bg-ink-900">Newest</option>
              <option value="price-asc" className="bg-ink-900">Price: Low to High</option>
              <option value="price-desc" className="bg-ink-900">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          {showFilters && (
            <aside className="w-64 shrink-0 hidden lg:block">
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                showOnly={showOnly}
                setShowOnly={setShowOnly}
              />
            </aside>
          )}

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] shimmer-bg animate-shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-ink-400">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-ink-900 p-6 animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm uppercase tracking-[0.15em] text-ink-50">Filters</span>
              <button onClick={() => setShowFilters(false)} className="text-ink-400">
                <X size={20} />
              </button>
            </div>
            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showOnly={showOnly}
              setShowOnly={setShowOnly}
            />
          </div>
        </div>
      )}

      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function FilterPanel({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  showOnly,
  setShowOnly,
}: {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (v: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  showOnly: string;
  setShowOnly: (v: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="label-luxury mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block text-sm transition-colors ${
              !selectedCategory ? "text-gold-400" : "text-ink-300 hover:text-ink-100"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block text-sm transition-colors ${
                selectedCategory === cat.slug ? "text-gold-400" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="label-luxury mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>{formatNaira(priceRange[0])}</span>
            <span>{formatNaira(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000000}
            step={10000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-gold-400"
          />
        </div>
      </div>

      <div>
        <h3 className="label-luxury mb-3">Show Only</h3>
        <div className="space-y-2">
          {[
            { value: "all", label: "All Products" },
            { value: "available", label: "In Stock" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setShowOnly(opt.value)}
              className={`block text-sm transition-colors ${
                showOnly === opt.value ? "text-gold-400" : "text-ink-300 hover:text-ink-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
