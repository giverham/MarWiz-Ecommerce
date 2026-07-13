import { useState, useEffect, useMemo } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { formatNaira } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../types";

export function SearchBar() {
  const { searchOpen, setSearchOpen } = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!allProducts.length) {
      supabase
        .from("products")
        .select("*")
        .neq("is_active", false)
        .order("sort_order")
        .then(({ data }) => {
          if (data) setAllProducts(data as Product[]);
        });
    }
  }, [allProducts.length]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allProducts.slice(0, 6);
    const q = query.toLowerCase();
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allProducts]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setSearchOpen(false)}
      />
      <div className="absolute left-0 right-0 top-0 bg-ink-900 animate-fade-down">
        <div className="container-luxury py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <SearchIcon size={20} className="text-gold-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 bg-transparent text-lg font-light text-ink-50 placeholder-ink-500 focus:outline-none"
              />
            </div>
            <button onClick={() => setSearchOpen(false)} className="text-ink-400 hover:text-ink-50">
              <X size={22} />
            </button>
          </div>

          {filtered.length > 0 && (
            <div className="border-t border-ink-700 pt-4">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-500">
                {query.trim() ? "Results" : "Popular Products"}
              </p>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {filtered.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/product/${product.slug}`);
                    }}
                    className="flex items-center gap-4 p-2 text-left transition-colors hover:bg-ink-800"
                  >
                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-ink-800">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-ink-100">{product.name}</p>
                      <p className="text-xs text-gold-400">{formatNaira(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
