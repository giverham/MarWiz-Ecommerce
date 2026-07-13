import { useState } from "react";
import { ArrowRight, Star, Shield, Truck, Award, Sparkles, MessageCircle } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { useRouter } from "../lib/router";
import { useProducts, useCollections, useTestimonials, useCategories } from "../hooks/useData";
import { ProductCard } from "../components/product/ProductCard";
import { QuickView } from "../components/product/QuickView";
import type { Product, Collection, Testimonial } from "../types";
import { formatNaira } from "../lib/utils";

export function HomePage() {
  const { settings } = useStore();
  const { products } = useProducts();
  const collections = useCollections();
  const categories = useCategories();
  const testimonials = useTestimonials();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const sections = [
    "hero",
    "collections",
    "featured-watches",
    "featured-fashion",
    "best-sellers",
    "new-arrivals",
    "limited-editions",
    "brand-story",
    "why-choose",
    "editorial",
    "testimonials",
    "instagram",
    "whatsapp-cta",
    "newsletter",
  ];

  const watchesCat = categories.find((c) => c.slug === "watches");
  const fashionCat = categories.find((c) => c.slug === "fashion");
  const watches = watchesCat ? products.filter((p) => p.category_id === watchesCat.id) : [];
  const fashion = fashionCat ? products.filter((p) => p.category_id === fashionCat.id) : [];

  const featuredWatches = watches.filter((p) => p.is_featured).slice(0, 4);
  const featuredFashion = fashion.filter((p) => p.is_featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.is_best_seller).slice(0, 4);
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);
  const limitedEditions = products.filter((p) => p.is_limited_edition).slice(0, 3); // 3 items for a 3-col grid

  const renderSection = (section: string) => {
    switch (section) {
      case "hero":
        return <HeroSection key="hero" />;
      case "collections":
        return <CollectionsSection key="collections" collections={collections} />;
      case "featured-watches":
        return (
          <ProductSection
            key="featured-watches"
            label="Featured Timepieces"
            title="Watches That Define"
            products={featuredWatches}
            onQuickView={setQuickViewProduct}
            viewAllLink="/category/watches"
          />
        );
      case "featured-fashion":
        return (
          <ProductSection
            key="featured-fashion"
            label="Curated Selection"
            title="Fashion Essentials"
            products={featuredFashion}
            onQuickView={setQuickViewProduct}
            viewAllLink="/category/fashion"
          />
        );
      case "best-sellers":
        return (
          <ProductSection
            key="best-sellers"
            label="Most Coveted"
            title="Best Sellers"
            products={bestSellers}
            onQuickView={setQuickViewProduct}
            viewAllLink="/shop"
          />
        );
      case "new-arrivals":
        return (
          <ProductSection
            key="new-arrivals"
            label="Just Arrived"
            title="New Arrivals"
            products={newArrivals}
            onQuickView={setQuickViewProduct}
            viewAllLink="/shop"
          />
        );
      case "limited-editions":
        return <LimitedEditionsSection key="limited-editions" products={limitedEditions} onQuickView={setQuickViewProduct} />;
      case "brand-story":
        return <BrandStorySection key="brand-story" />;
      case "why-choose":
        return <WhyChooseSection key="why-choose" />;
      case "editorial":
        return <EditorialSection key="editorial" />;
      case "testimonials":
        return <TestimonialsSection key="testimonials" testimonials={testimonials} />;
      case "instagram":
        return <InstagramSection key="instagram" />;
      case "whatsapp-cta":
        return <WhatsAppCTASection key="whatsapp-cta" />;
      case "newsletter":
        return <NewsletterSection key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex flex-col gap-16 md:gap-24 pb-16 md:pb-24 max-w-[100vw]">
      {sections.filter((s) => s !== "announcement").map((section) => renderSection(section))}
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function HeroSection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  // Premium fashion video (configurable from Admin Dashboard, defaults to local file)
  const isBadUrl = settings?.hero_video_url?.includes('mixkit.co');
  const videoUrl = (settings?.hero_video_url && settings.hero_video_url.trim() !== "" && !isBadUrl) 
    ? settings.hero_video_url 
    : "/assets/videos/hero-background.mp4";

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-ink-950 flex flex-col items-center justify-end pb-24 lg:pb-32 text-center">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video
          src={videoUrl}
          className="w-full h-full object-cover object-[center_25%] sm:object-[center_20%] lg:object-[center_15%] block"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Luxury Overlays */}
        <div className="absolute inset-0 bg-ink-950/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent opacity-90 z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full px-4 flex flex-col items-center justify-center max-w-6xl mx-auto animate-fade-up mt-auto">
        {/* Headline */}
        <h1 
          className="font-serif text-ink-50 uppercase m-0 p-0 text-center mx-auto whitespace-nowrap"
          style={{
            maxWidth: "100%",
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: "-1px",
            fontSize: "clamp(20px, 5.5vw, 82px)",
          }}
        >
          DARE TO WEAR DIFFERENT
        </h1>

        {/* Description */}
        <p 
          className="mt-6 font-light text-ink-200 text-center mx-auto m-0 uppercase"
          style={{
            maxWidth: "100%",
            letterSpacing: "0.15em",
            fontSize: "clamp(11px, 1.8vw, 15px)"
          }}
        >
          Premium Clothing • Luxury Watches • Signature Style
        </p>

        {/* Buttons */}
        <div className="mt-24 lg:mt-32 flex flex-row items-center justify-center gap-6 w-full mx-auto">
          <button
            onClick={() => navigate(settings?.hero_cta_link || "/shop")}
            className="bg-gold-400 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-900 transition-all hover:bg-gold-300 shrink-0"
          >
            {settings?.hero_cta_text || "Explore Collection"}
          </button>
          <button
            onClick={() => navigate("/collections")}
            className="border border-ink-600 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-50 transition-all hover:border-gold-400 hover:text-gold-400 shrink-0"
          >
            View Collections
          </button>
        </div>
      </div>
    </section>
  );
}

function CollectionsSection({ collections }: { collections: Collection[] }) {
  const { navigate } = useRouter();
  if (collections.length === 0) return null;

  return (
    <section className="w-full">
      <div className="container-luxury">
        <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
          <p className="section-label mb-3">Explore</p>
          <h2 className="section-title m-0">Curated Collections</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch auto-rows-fr">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => navigate(`/collection/${collection.slug}`)}
              className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-ink-800 text-left flex flex-col w-full h-full border border-ink-800 hover:border-gold-400/30 transition-all"
            >
              <img
                src={collection.image_url || ""}
                alt={collection.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent opacity-90 z-10 pointer-events-none" />
              <div className="relative z-20 mt-auto p-6 md:p-8 flex flex-col w-full">
                <h3 className="font-display text-2xl md:text-3xl text-ink-50 m-0">{collection.name}</h3>
                <p className="mt-3 text-sm md:text-base font-light text-ink-300 line-clamp-2 m-0">
                  {collection.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.15em] text-gold-400 opacity-100 lg:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Discover <ArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProductSectionProps {
  label: string;
  title: string;
  products: Product[];
  onQuickView: (p: Product) => void;
  viewAllLink: string;
}

function ProductSection({ label, title, products, onQuickView, viewAllLink }: ProductSectionProps) {
  const { navigate } = useRouter();
  if (products.length === 0) return null;

  return (
    <section className="w-full overflow-hidden">
      <div className="container-luxury">
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
            <p className="section-label mb-3">{label}</p>
            <h2 className="section-title m-0">{title}</h2>
          </div>
          <button
            onClick={() => navigate(viewAllLink)}
            className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300 transition-colors hover:text-gold-400 shrink-0"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {/* Strict Grid for Product Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 items-stretch auto-rows-fr">
          {products.map((product) => (
            <div key={product.id} className="h-full w-full flex flex-col">
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden w-full">
          <button onClick={() => navigate(viewAllLink)} className="btn-outline w-full max-w-sm">
            View All <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function LimitedEditionsSection({ products, onQuickView }: { products: Product[]; onQuickView: (p: Product) => void; }) {
  const { navigate } = useRouter();
  if (products.length === 0) return null;

  return (
    <section className="w-full">
      <div className="container-luxury">
        <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
          <p className="section-label mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Exclusive
          </p>
          <h2 className="section-title m-0">Limited Editions</h2>
          <p className="mt-4 text-sm md:text-base font-light text-ink-300 w-full max-w-xl mx-auto">
            Once they are gone, they are gone forever.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch auto-rows-fr">
          {products.map((product) => (
            <div key={product.id} className="group overflow-hidden bg-ink-900 border border-ink-800 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 p-4 flex flex-col h-full w-full">
              <div
                className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-ink-800 shrink-0 w-full"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-gold-400 px-3 py-1.5 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-900 z-10">
                  Limited
                </div>
              </div>
              <div className="pt-6 flex flex-col flex-1 w-full text-center items-center">
                <h3 className="font-display text-xl md:text-2xl text-ink-50 m-0">{product.name}</h3>
                <p className="mt-3 text-sm font-light text-ink-400 line-clamp-2 w-full flex-1 m-0">
                  {product.description}
                </p>
                <div className="mt-6 flex flex-col w-full gap-4 items-center shrink-0">
                  <span className="text-lg md:text-xl text-gold-400 m-0">{formatNaira(product.price)}</span>
                  <button
                    onClick={() => onQuickView(product)}
                    className="btn-outline w-full max-w-[220px]"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStorySection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  return (
    <section className="w-full bg-ink-900/40 py-16 md:py-24 border-y border-ink-800/50">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden w-full bg-ink-800">
            <img
              src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Brand Story"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-ink-950/20 z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-8 md:p-10 bg-gradient-to-t from-ink-950/90 to-transparent z-20">
              <p className="font-display text-3xl md:text-4xl text-gold-400 m-0">Est. Lagos</p>
              <p className="mt-2 text-[10px] md:text-xs text-ink-300 uppercase tracking-[0.2em] m-0">Crafted in Nigeria</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            <p className="section-label mb-4">Our Story</p>
            <h2 className="section-title mb-6 md:mb-8 m-0">The MarWiz Philosophy</h2>
            <div className="flex flex-col gap-6 text-sm md:text-base font-light leading-relaxed text-ink-200 w-full max-w-xl">
              <p className="m-0">{settings?.footer_about}</p>
              <p className="m-0">
                Every MarWiz piece is crafted with intention. We believe luxury is not about logos
                or labels — it is about the feeling of wearing something extraordinary, something
                that tells your story without saying a word.
              </p>
            </div>
            <button onClick={() => navigate("/page/about")} className="btn-outline mt-10 w-full sm:w-auto">
              Read Our Story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const features = [
    { icon: Award, title: "Master Craftsmanship", desc: "Every piece is crafted by master artisans with decades of experience." },
    { icon: Shield, title: "Authenticity Guaranteed", desc: "Each product comes with a certificate of authenticity." },
    { icon: Truck, title: "Nationwide Delivery", desc: "Complimentary delivery on orders above ₦50,000 across Nigeria." },
    { icon: Star, title: "Premium Materials", desc: "We source only the finest materials from trusted suppliers worldwide." },
  ];

  return (
    <section className="w-full bg-ink-900 py-16 md:py-24">
      <div className="container-luxury">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <p className="section-label mb-3">Why MarWiz</p>
          <h2 className="section-title m-0">The MarWiz Standard</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start auto-rows-fr">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center w-full h-full">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/20 bg-ink-950 shrink-0">
                <feature.icon size={28} className="text-gold-400" />
              </div>
              <h3 className="text-xs md:text-sm font-medium uppercase tracking-[0.15em] text-ink-100 mb-4 m-0">
                {feature.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-ink-400 w-full max-w-[280px] m-0">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialSection() {
  const { navigate } = useRouter();

  return (
    <section className="w-full">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch auto-rows-fr">
          <div className="group relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden bg-ink-800 w-full flex flex-col h-full border border-transparent hover:border-gold-400/20 transition-all">
            <img
              src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Editorial"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent z-10 pointer-events-none" />
            <div className="relative z-20 mt-auto p-8 md:p-12 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
              <p className="section-label mb-4">Editorial</p>
              <h3 className="font-display text-3xl md:text-4xl text-ink-50 mb-4 m-0">The Art of Tailoring</h3>
              <p className="w-full max-w-md text-sm md:text-base font-light text-ink-300 mb-8 m-0">
                Discover the meticulous process behind every MarWiz garment.
              </p>
              <button
                onClick={() => navigate("/page/about")}
                className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold-400 transition-colors hover:text-gold-300"
              >
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="group relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden bg-ink-800 w-full flex flex-col h-full border border-transparent hover:border-gold-400/20 transition-all">
            <img
              src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Editorial"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent z-10 pointer-events-none" />
            <div className="relative z-20 mt-auto p-8 md:p-12 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
              <p className="section-label mb-4">Editorial</p>
              <h3 className="font-display text-3xl md:text-4xl text-ink-50 mb-4 m-0">Timekeeping Reimagined</h3>
              <p className="w-full max-w-md text-sm md:text-base font-light text-ink-300 mb-8 m-0">
                Precision engineering meets timeless design in every MarWiz timepiece.
              </p>
              <button
                onClick={() => navigate("/category/watches")}
                className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold-400 transition-colors hover:text-gold-300"
              >
                Discover <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="w-full bg-ink-900/30 py-16 md:py-24 border-y border-ink-800/50">
      <div className="container-luxury">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <p className="section-label mb-3">Client Voices</p>
          <h2 className="section-title m-0">What They Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-stretch auto-rows-fr">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-ink-800 bg-ink-950/50 p-8 flex flex-col h-full w-full items-center text-center md:items-start md:text-left">
              <div className="mb-6 flex gap-1 justify-center md:justify-start w-full shrink-0">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-gold-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm md:text-base font-light leading-relaxed text-ink-200 flex-1 mb-8 w-full m-0">"{t.content}"</p>
              <div className="flex items-center gap-4 shrink-0 justify-center md:justify-start w-full">
                {t.image_url && (
                  <div className="h-12 w-12 overflow-hidden rounded-full shrink-0 border border-ink-800">
                    <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-sm font-medium text-ink-50 m-0">{t.name}</p>
                  {t.role && <p className="text-[10px] text-ink-400 mt-1 uppercase tracking-[0.15em] m-0">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  const { settings } = useStore();
  const images = [
    "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  return (
    <section className="w-full">
      <div className="container-luxury">
        <div className="mb-10 md:mb-12 flex flex-col items-center text-center">
          <p className="section-label mb-3">@{settings?.instagram_handle || "marwiz"}</p>
          <h2 className="section-title m-0">Follow Our Journey</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 w-full auto-rows-fr">
          {images.map((img, i) => (
            <a
              key={i}
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-ink-800 w-full block"
            >
              <img
                src={img}
                alt="Instagram"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/40 flex items-center justify-center z-10">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">View</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsAppCTASection() {
  const { settings } = useStore();
  const waNumber = settings?.whatsapp_number || "";
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <section className="w-full">
      <div className="container-luxury">
        <div className="relative overflow-hidden border border-gold-400/20 bg-ink-900 w-full flex flex-col">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-900/90 to-ink-950/90 pointer-events-none z-10" />

          <div className="relative z-20 p-10 md:p-16 lg:p-20 flex flex-col items-center text-center max-w-3xl mx-auto w-full">
            <MessageCircle size={36} className="mb-6 text-gold-400 shrink-0" />
            <h2 className="section-title mb-6 m-0 text-3xl md:text-5xl">Personal Concierge</h2>
            <p className="text-sm md:text-base lg:text-lg font-light leading-relaxed text-ink-200 mb-10 w-full m-0">
              Prefer a more personal shopping experience? Chat with our concierge team on WhatsApp
              for tailored recommendations, sizing, and order assistance.
            </p>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto text-center shrink-0">
              <MessageCircle size={16} />
              Chat With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="w-full border-t border-ink-800 bg-ink-950 py-16 md:py-24">
      <div className="container-luxury">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center w-full">
          <p className="section-label mb-4">Stay Connected</p>
          <h2 className="section-title mb-6 m-0 text-3xl md:text-4xl">Join the MarWiz Circle</h2>
          <p className="text-sm md:text-base font-light text-ink-300 mb-10 leading-relaxed w-full m-0">
            Be the first to discover new collections, limited editions, and exclusive offers.
          </p>
          {submitted ? (
            <div className="bg-ink-900 border border-gold-400/20 p-6 w-full animate-fade-up flex flex-col">
              <p className="text-sm md:text-base text-gold-400 m-0">
                Thank you for joining the MarWiz Circle. Check your inbox for a welcome message.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-4 w-full"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-luxury flex-1 text-center sm:text-left text-sm md:text-base border-b border-ink-800 focus:border-gold-400 pb-4 bg-transparent outline-none text-ink-50 placeholder:text-ink-500 transition-colors w-full rounded-none m-0"
              />
              <button type="submit" className="btn-primary shrink-0 w-full sm:w-auto text-[11px] md:text-xs">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}