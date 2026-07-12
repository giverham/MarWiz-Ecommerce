import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { useRouter } from "../lib/router";
import { supabase } from "../lib/supabase";
import { ProductCard } from "../components/product/ProductCard";
import { QuickView } from "../components/product/QuickView";
import type { Product } from "../types";

export function WishlistPage() {
  const { wishlist } = useStore();
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }
    supabase
      .from("products")
      .select("*")
      .in("id", wishlist)
      .eq("is_active", true)
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
      });
  }, [wishlist]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-luxury">
        <div className="mb-12 text-center">
          <Heart size={28} className="mx-auto mb-3 text-gold-400" />
          <h1 className="font-display text-section text-ink-50">Your Wishlist</h1>
          <p className="mt-3 text-sm text-ink-400">
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <Heart size={48} className="mx-auto mb-4 text-ink-700" />
            <p className="text-sm text-ink-400">Your wishlist is empty.</p>
            <button onClick={() => navigate("/shop")} className="btn-outline mt-6">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
