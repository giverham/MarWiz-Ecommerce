import { useState, useEffect } from "react";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Check, Minus, Plus, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/StoreContext";
import { useRouter } from "../lib/router";
import { formatNaira } from "../lib/utils";
import type { Product } from "../types";
import { ProductCard } from "../components/product/ProductCard";

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { addToCart, toggleWishlist, isWishlisted, settings } = useStore();
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .neq("is_active", false)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const p = data as Product;
          setProduct(p);
          setActiveImage(0);
          setSelectedColor(p.variants?.colors?.[0]);
          setSelectedSize(p.variants?.sizes?.[0]);
          setQuantity(1);
          
          // Fetch related products (using same categories, fallback to generic fetch if no categories)
          const fetchRelated = async () => {
             let query = supabase.from("products").select("*").neq("is_active", false).neq("id", p.id).limit(4);
             
             if (p.category_id) {
               query = query.eq("category_id", p.category_id);
             }

             const { data: rel } = await query;
             if (rel) setRelated(rel as Product[]);
          };
          fetchRelated();
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-square shimmer-bg animate-shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 shimmer-bg animate-shimmer" />
              <div className="h-6 w-1/3 shimmer-bg animate-shimmer" />
              <div className="h-24 w-full shimmer-bg animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-lg text-ink-300">Product not found.</p>
          <button onClick={() => navigate("/shop")} className="btn-outline mt-4">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const wished = isWishlisted(product.id);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 w-full">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-ink-500">
          <button onClick={() => navigate("/")} className="hover:text-gold-400">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/shop")} className="hover:text-gold-400">Shop</button>
          <span>/</span>
          <span className="text-ink-300">{product.name}</span>
        </div>

        <div className="!grid !grid-cols-1 md:!grid-cols-2 gap-x-10 !items-start">
          {/* Gallery */}
          <div className="w-full max-w-[450px] mx-auto lg:mx-0">
            <div
              className="relative aspect-square cursor-crosshair overflow-hidden bg-ink-800"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300"
                style={
                  zoom
                    ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center glass text-ink-50 hover:text-gold-400"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center glass text-ink-50 hover:text-gold-400"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-gold-400" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-y-3.5 lg:pt-0">
            <h1 className="font-display text-2xl md:text-3xl text-ink-50 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl text-gold-400 font-semibold">{formatNaira(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-ink-500 line-through">
                  {formatNaira(product.compare_at_price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className="text-gold-400" fill="currentColor" />
                ))}
              </div>
              <span className="text-[11px] uppercase tracking-wider text-ink-500">Premium Quality</span>
            </div>

            <p className="text-sm font-light leading-relaxed text-ink-300">
              {product.description}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2">
              {product.availability === 'in_stock' && (
                <>
                  <Check size={14} className="text-green-500" />
                  <span className="text-xs text-green-500 font-medium">In Stock</span>
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-xs text-red-400">— Only {product.stock} left</span>
                  )}
                </>
              )}
              {product.availability === 'sold_out' && (
                <span className="text-xs text-ink-500 font-medium">Sold Out</span>
              )}
              {product.availability === 'coming_soon' && (
                <span className="text-xs text-gold-400 font-medium">Coming Soon</span>
              )}
            </div>

            {/* Variants */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">Color: <span className="text-ink-200">{selectedColor}</span></p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`border text-[11px] uppercase tracking-wider transition-all h-8 px-3 flex items-center justify-center ${
                        selectedColor === color
                          ? "border-gold-400 bg-gold-400 text-ink-900 font-medium"
                          : "border-ink-600 text-ink-300 hover:border-gold-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">Size: <span className="text-ink-200">{selectedSize}</span></p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border text-[11px] uppercase tracking-wider transition-all h-8 min-w-[32px] px-2 flex items-center justify-center ${
                        selectedSize === size
                          ? "border-gold-400 bg-gold-400 text-ink-900 font-medium"
                          : "border-ink-600 text-ink-300 hover:border-gold-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-ink-400 font-medium">Quantity</p>
              <div className="mt-1.5 flex items-center border border-ink-600 w-fit h-8">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center text-ink-300 hover:text-gold-400"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-xs text-ink-100">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center text-ink-300 hover:text-gold-400"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => addToCart(product, quantity, { color: selectedColor, size: selectedSize })}
                disabled={product.availability === 'sold_out'}
                className="btn-primary h-10 text-xs py-0 flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={14} />
                {product.availability === 'sold_out' ? 'Sold Out' : 'Add to Bag'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex h-10 w-10 items-center justify-center border transition-all ${
                  wished
                    ? "border-gold-400 bg-gold-400 text-ink-900"
                    : "border-ink-600 text-ink-300 hover:border-gold-400"
                }`}
              >
                <Heart size={16} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>

            {/* WhatsApp direct order */}
            <button
              onClick={() => {
                const waNumber = settings?.whatsapp_number || "";
                const msg = `Hello MarWiz, I would like to order:\n\n${product.name}\nPrice: ${formatNaira(product.price)}\n${selectedColor ? `Color: ${selectedColor}\n` : ""}${selectedSize ? `Size: ${selectedSize}\n` : ""}Quantity: ${quantity}\n\nPlease confirm availability and delivery.`;
                window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
              }}
              className="w-full text-center text-[11px] uppercase tracking-[0.15em] text-gold-400 hover:text-gold-300"
            >
              Or Order Directly via WhatsApp
            </button>

          </div>
        </div>

        {/* Specifications */}
        {Object.keys(product.specs).length > 0 && (
          <div className="mt-12 border-t border-ink-800 pt-8 w-full">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-6">
              Specifications
            </h3>
            <div className="grid gap-x-16 gap-y-4 md:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-ink-800 pb-2.5">
                  <dt className="text-sm text-ink-400">{key}</dt>
                  <dd className="text-sm text-ink-200 font-light">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
