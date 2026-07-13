import { useState, useEffect } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { useRouter } from "../lib/router";
import { supabase } from "../lib/supabase";
import type { Collection } from "../types";

export function CollectionsPage() {
  const { navigate } = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("collections")
      .select("*")
      .neq("is_active", false)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCollections(data as Collection[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-luxury">
        <div className="mb-12 text-center">
          <Layers size={28} className="mx-auto mb-4 text-gold-400" />
          <h1 className="font-display text-4xl text-ink-50 md:text-5xl">Collections</h1>
          <p className="mt-4 text-sm font-light text-ink-300">
            Curated selections of our finest pieces.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[21/9] shimmer-bg animate-shimmer" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20 border border-ink-800 bg-ink-900/20">
            <p className="text-ink-400">No collections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {collections.map(collection => (
              <div 
                key={collection.id} 
                className="group relative overflow-hidden aspect-[21/9] border border-ink-800 bg-ink-900 cursor-pointer"
                onClick={() => navigate(`/collections/${collection.slug}`)}
              >
                {collection.banner_image_url || collection.image_url ? (
                  <img 
                    src={collection.banner_image_url || collection.image_url!} 
                    alt={collection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-ink-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h2 className="text-2xl md:text-3xl font-serif text-ink-50 mb-2">{collection.name}</h2>
                  {collection.subtitle && (
                    <p className="text-gold-400 text-sm font-medium tracking-wider uppercase mb-3">
                      {collection.subtitle}
                    </p>
                  )}
                  {collection.description && (
                    <p className="text-ink-200 text-sm font-light line-clamp-2 max-w-md mb-4">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-50 group-hover:text-gold-400 transition-colors">
                    {collection.button_text || "Explore Collection"} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
