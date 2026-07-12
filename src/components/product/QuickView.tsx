import { useState, useEffect } from "react";
import { X, ShoppingBag, Heart } from "lucide-react";
import type { Product } from "../../types";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSelectedColor(product.variants?.colors?.[0]);
      setSelectedSize(product.variants?.sizes?.[0]);
    }
  }, [product]);

  if (!product) return null;

  const wished = isWishlisted(product.id);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 grid w-full max-w-4xl animate-scale-in grid-cols-1 gap-0 bg-ink-900 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center text-ink-300 hover:text-ink-50"
        >
          <X size={20} />
        </button>

        {/* Images */}
        <div className="flex flex-col gap-2 p-4">
          <div className="aspect-square overflow-hidden bg-ink-800">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-gold-400" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink-50">{product.name}</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xl text-gold-400">{formatNaira(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-ink-500 line-through">
                {formatNaira(product.compare_at_price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm font-light leading-relaxed text-ink-300 line-clamp-4">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div className="mt-5">
              <p className="label-luxury">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                      selectedColor === color
                        ? "border-gold-400 bg-gold-400 text-ink-900"
                        : "border-ink-600 text-ink-300 hover:border-gold-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="mt-4">
              <p className="label-luxury">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? "border-gold-400 bg-gold-400 text-ink-900"
                        : "border-ink-600 text-ink-300 hover:border-gold-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-6 flex gap-3">
            <button
              onClick={() => {
                addToCart(product, 1, { color: selectedColor, size: selectedSize });
                onClose();
              }}
              className="btn-primary flex-1"
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex h-12 w-12 items-center justify-center border transition-all ${
                wished
                  ? "border-gold-400 bg-gold-400 text-ink-900"
                  : "border-ink-600 text-ink-300 hover:border-gold-400"
              }`}
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              navigate(`/product/${product.slug}`);
            }}
            className="mt-3 text-center text-xs uppercase tracking-[0.15em] text-ink-400 hover:text-gold-400"
          >
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}
