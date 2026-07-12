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

  const sections = settings?.homepage_sections || [
    "announcement",
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
  const limitedEditions = products.filter((p) => p.is_limited_edition).slice(0, 3);

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
    <div>
      {sections.filter((s) => s !== "announcement").map((section) => renderSection(section))}
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function HeroSection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  return (
    <section className="relative flex h-[80vh] w-full items-center overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        {settings?.hero_video_url ? (
          <video
            src={settings.hero_video_url}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : settings?.hero_image_url ? (
          <img
            src={settings.hero_image_url}
            alt="Hero"
            className="h-full w-full object-cover animate-fade-in"
          />
        ) : null}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/50 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/30" />
      </div>

      <div className="relative z-10 w-full animate-fade-up">
        <div className="container-luxury">
          <div className="max-w-5xl">
            {/* Headline */}
            <h1 className="font-display text-4xl font-medium leading-[1.15] text-ink-50 text-balance sm:text-5xl lg:text-[3.50rem]">
              {settings?.hero_title || "Dare To Wear Different"}
            </h1>
            
            {/* Split layout below the headline with zero large empty spaces */}
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
              {/* Left Column: Description */}
              <div className="max-w-xl">
                <p className="text-base font-light leading-relaxed text-ink-200 sm:text-lg">
                  {settings?.hero_subtitle || "Timeless luxury crafted for those who refuse the ordinary."}
                </p>
              </div>
              
              {/* Right Column: Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                <button
                  onClick={() => navigate(settings?.hero_cta_link || "/shop")}
                  className="btn-primary justify-center py-3 px-8 whitespace-nowrap flex items-center gap-2"
                >
                  {settings?.hero_cta_text || "Explore Collection"}
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/collections")}
                  className="btn-outline justify-center py-3 px-8 whitespace-nowrap"
                >
                  View Collections
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="h-8 w-px bg-gold-400/40 animate-pulse"></div>
      </div>
    </section>
  );
}

// ============ COLLECTIONS ============
function CollectionsSection({ collections }: { collections: Collection[] }) {
  const { navigate } = useRouter();

  if (collections.length === 0) return null;

  return (
    <section className="pb-12 md:pb-14 pt-4 md:pt-5">
      <div className="container-luxury">
        <div className="mb-6 md:mb-8 text-center">
          <p className="section-label mb-3">Explore</p>
          <h2 className="section-title">Curated Collections</h2>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
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
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-display text-2xl text-ink-50">{collection.name}</h3>
                <p className="mt-2 text-sm font-light text-ink-300 line-clamp-2">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

// ============ PRODUCT SECTION ============
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
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="section-label mb-3">{label}</p>
            <h2 className="section-title">{title}</h2>
          </div>
          <button
            onClick={() => navigate(viewAllLink)}
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300 transition-colors hover:text-gold-400"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <button onClick={() => navigate(viewAllLink)} className="btn-outline">
            View All <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============ LIMITED EDITIONS ============
function LimitedEditionsSection({
  products,
  onQuickView,
}: {
  products: Product[];
  onQuickView: (p: Product) => void;
}) {
  const { navigate } = useRouter();

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="mb-6 md:mb-8 text-center">
          <p className="section-label mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Exclusive
          </p>
          <h2 className="section-title">Limited Editions</h2>
          <p className="mt-3 text-sm font-light text-ink-400">
            Once they are gone, they are gone forever.
          </p>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden bg-ink-800 border border-gold-400/20 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-gold-400/40 p-2">
              <div
                className="zoom-container aspect-[2/3] cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-4 right-4 bg-gold-400 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink-900">
                Limited
              </div>
              <div className="p-5 md:p-6">
                <h3 className="font-display text-xl text-ink-50">{product.name}</h3>
                <p className="mt-1.5 text-sm font-light text-ink-400 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg text-gold-400">{formatNaira(product.price)}</span>
                  <button
                    onClick={() => onQuickView(product)}
                    className="text-xs uppercase tracking-[0.15em] text-ink-300 hover:text-gold-400"
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

// ============ BRAND STORY ============
function BrandStorySection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  return (
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Brand Story"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/80 to-transparent p-6 md:p-8">
              <p className="font-display text-3xl text-gold-400">Est. Lagos</p>
              <p className="text-sm text-ink-300">Crafted in Nigeria</p>
            </div>
          </div>
          <div>
            <p className="section-label mb-4">Our Story</p>
            <h2 className="section-title mb-6">The MarWiz Philosophy</h2>
            <p className="text-base font-light leading-relaxed text-ink-300">
              {settings?.footer_about}
            </p>
            <p className="mt-4 text-base font-light leading-relaxed text-ink-300">
              Every MarWiz piece is crafted with intention. We believe luxury is not about logos
              or labels — it is about the feeling of wearing something extraordinary, something
              that tells your story without saying a word.
            </p>
            <button onClick={() => navigate("/page/about")} className="btn-outline mt-8">
              Read Our Story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ WHY CHOOSE ============
function WhyChooseSection() {
  const features = [
    { icon: Award, title: "Master Craftsmanship", desc: "Every piece is crafted by master artisans with decades of experience." },
    { icon: Shield, title: "Authenticity Guaranteed", desc: "Each product comes with a certificate of authenticity." },
    { icon: Truck, title: "Nationwide Delivery", desc: "Complimentary delivery on orders above ₦50,000 across Nigeria." },
    { icon: Star, title: "Premium Materials", desc: "We source only the finest materials from trusted suppliers worldwide." },
  ];

  return (
    <section className="border-y border-ink-800 bg-ink-900 py-12 md:py-14">
      <div className="container-luxury">
        <div className="mb-6 md:mb-8 text-center">
          <p className="section-label mb-3">Why MarWiz</p>
          <h2 className="section-title">The MarWiz Standard</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30">
                <feature.icon size={24} className="text-gold-400" />
              </div>
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-ink-100">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-ink-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ EDITORIAL ============
function EditorialSection() {
  const { navigate } = useRouter();

  return (
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <div className="group relative aspect-[16/10] overflow-hidden bg-ink-800">
            <img
              src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Editorial"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="section-label mb-2">Editorial</p>
              <h3 className="font-display text-2xl text-ink-50 md:text-3xl">The Art of Tailoring</h3>
              <p className="mt-2 max-w-md text-sm font-light text-ink-300">
                Discover the meticulous process behind every MarWiz garment.
              </p>
              <button
                onClick={() => navigate("/page/about")}
                className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold-400"
              >
                Read More <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="group relative aspect-[16/10] overflow-hidden bg-ink-800">
            <img
              src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Editorial"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="section-label mb-2">Editorial</p>
              <h3 className="font-display text-2xl text-ink-50 md:text-3xl">Timekeeping Reimagined</h3>
              <p className="mt-2 max-w-md text-sm font-light text-ink-300">
                Precision engineering meets timeless design in every MarWiz timepiece.
              </p>
              <button
                onClick={() => navigate("/category/watches")}
                className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold-400"
              >
                Discover <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-ink-800 bg-ink-900 py-12 md:py-14">
      <div className="container-luxury">
        <div className="mb-6 md:mb-8 text-center">
          <p className="section-label mb-3">Client Voices</p>
          <h2 className="section-title">What They Say</h2>
        </div>
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-ink-700 p-5 md:p-6">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-gold-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm font-light leading-relaxed text-ink-300">"{t.content}"</p>
              <div className="mt-5 flex items-center gap-3">
                {t.image_url && (
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink-100">{t.name}</p>
                  {t.role && <p className="text-xs text-ink-500">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ INSTAGRAM ============
function InstagramSection() {
  const { settings } = useStore();

  const images = [
    "https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];

  return (
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="mb-5 text-center">
          <p className="section-label mb-3">@{settings?.instagram_handle || "marwiz"}</p>
          <h2 className="section-title">Follow Our Journey</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {images.map((img, i) => (
            <a
              key={i}
              href={settings?.instagram_url || "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-ink-800"
            >
              <img
                src={img}
                alt="Instagram"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/40" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ WHATSAPP CTA ============
function WhatsAppCTASection() {
  const { settings } = useStore();

  const waNumber = settings?.whatsapp_number || "";
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <section className="py-12 md:py-14">
      <div className="container-luxury">
        <div className="relative overflow-hidden border border-gold-400/20 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 px-6 py-10 text-center md:px-12 md:py-12 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 opacity-5">
            <img
              src="https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative z-10">
            <MessageCircle size={32} className="mx-auto mb-4 text-gold-400" />
            <h2 className="section-title mb-4">Shop Via WhatsApp</h2>
            <p className="mx-auto max-w-lg text-base font-light leading-relaxed text-ink-300">
              Prefer a more personal shopping experience? Chat with our concierge team on WhatsApp
              for product recommendations, sizing, and order assistance.
            </p>
            <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary mt-8">
              <MessageCircle size={16} />
              Chat With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ NEWSLETTER ============
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="border-t border-ink-800 bg-ink-950 py-12 md:py-14">
      <div className="container-luxury">
        <div className="mx-auto max-w-xl text-center">
          <p className="section-label mb-3">Stay Connected</p>
          <h2 className="section-title mb-4">Join the MarWiz Circle</h2>
          <p className="text-base font-light text-ink-400">
            Be the first to discover new collections, limited editions, and exclusive offers.
          </p>
          {submitted ? (
            <p className="mt-6 text-sm text-gold-400">
              Thank you for joining the MarWiz Circle. Check your inbox for a welcome message.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-luxury flex-1 text-center sm:text-left"
              />
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
