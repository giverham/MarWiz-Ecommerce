import { Heart, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  imageAspect?: "square" | "portrait";
}

export function ProductCard({ product, onQuickView, imageAspect = "portrait" }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const wished = isWishlisted(product.id);
  
  const aspectClass = imageAspect === "square" ? "aspect-square" : "aspect-[4/5]";

  return (
    <div className="group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-ink-800 bg-ink-900 rounded-none overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div
        className={`zoom-container relative ${aspectClass} cursor-pointer overflow-hidden bg-ink-800 shrink-0 w-full`}
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-20">
          {product.is_limited_edition && (
            <span className="bg-gold-400 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-900 rounded-sm">
              Limited
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-ink-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-900 rounded-sm">
              New
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="bg-red-900 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-100 rounded-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all z-20 ${
            wished
              ? "bg-gold-400 text-ink-900 shadow-md"
              : "bg-ink-950/40 text-ink-100 hover:bg-gold-400 hover:text-ink-900"
          }`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full transition-transform duration-500 group-hover:translate-y-0 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 bg-ink-950/90 text-xs font-medium uppercase tracking-[0.15em] text-ink-50 transition-colors hover:bg-gold-400 hover:text-ink-900"
          >
            <ShoppingBag size={14} />
            Add to Bag
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex h-12 w-12 items-center justify-center bg-ink-900/90 text-ink-50 transition-colors hover:bg-gold-400 hover:text-ink-900"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 bg-ink-900">
        <button
          onClick={() => navigate(`/product/${product.slug}`)}
          className="block text-left"
        >
          <h3 className="text-sm font-medium text-ink-50 transition-colors group-hover:text-gold-400 m-0">
            {product.name}
          </h3>
        </button>
        <div className="mt-auto pt-3 flex items-center gap-2">
          <span className="text-sm text-gold-400 font-medium">{formatNaira(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-ink-500 line-through">
              {formatNaira(product.compare_at_price)}
            </span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="mt-2 text-[11px] text-red-400 m-0 uppercase tracking-widest font-medium">Only {product.stock} left</p>
        )}
        {product.stock === 0 && <p className="mt-2 text-[11px] text-ink-500 m-0 uppercase tracking-widest font-medium">Sold out</p>}
      </div>
    </div>
  );
}
