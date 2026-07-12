import { Heart, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "../../types";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const { navigate } = useRouter();
  const wished = isWishlisted(product.id);

  return (
    <div className="group relative transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-transparent hover:border-ink-800/40 bg-ink-900/10 hover:bg-ink-900 p-2">
      {/* Image */}
      <div
        className="zoom-container relative aspect-[2/3] cursor-pointer overflow-hidden bg-ink-800"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_limited_edition && (
            <span className="bg-gold-400 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-900">
              Limited
            </span>
          )}
          {product.is_new_arrival && (
            <span className="bg-ink-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-900">
              New
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="bg-red-900 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-red-100">
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
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
            wished
              ? "bg-gold-400 text-ink-900"
              : "glass-light text-ink-100 hover:text-gold-400"
          }`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full transition-transform duration-500 group-hover:translate-y-0">
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
      <div className="mt-3 px-1">
        <button
          onClick={() => navigate(`/product/${product.slug}`)}
          className="block text-left"
        >
          <h3 className="text-sm font-medium text-ink-100 transition-colors group-hover:text-gold-400">
            {product.name}
          </h3>
        </button>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm text-gold-400">{formatNaira(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-ink-500 line-through">
              {formatNaira(product.compare_at_price)}
            </span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="mt-1 text-xs text-red-400">Only {product.stock} left</p>
        )}
        {product.stock === 0 && <p className="mt-1 text-xs text-ink-500">Sold out</p>}
      </div>
    </div>
  );
}
