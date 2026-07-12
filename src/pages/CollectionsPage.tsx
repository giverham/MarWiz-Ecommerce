import { useCollections } from "../hooks/useData";
import { useRouter } from "../lib/router";

export function CollectionsPage() {
  const collections = useCollections();
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-luxury">
        <div className="mb-12 text-center">
          <p className="section-label mb-3">Explore</p>
          <h1 className="font-display text-section text-ink-50">Collections</h1>
          <p className="mt-3 text-sm font-light text-ink-400 max-w-lg mx-auto">
            Each collection tells a unique story. Discover the one that speaks to you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => navigate(`/collection/${collection.slug}`)}
              className="group relative aspect-[3/4] overflow-hidden bg-ink-800 text-left"
            >
              <img
                src={collection.image_url || ""}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl text-ink-50">{collection.name}</h3>
                <p className="mt-2 text-sm font-light text-ink-300 line-clamp-2">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold-400">
                  Explore Collection
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
