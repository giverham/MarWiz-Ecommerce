import { useState, useEffect } from "react";
import { ArrowRight, Star, Shield, Truck, Award, MessageCircle, Check, Heart, Gem } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { useRouter } from "../lib/router";
import { useProducts, useTestimonials, useCollections } from "../hooks/useData";
import { supabase } from "../lib/supabase";
import { ProductCard } from "../components/product/ProductCard";
import { QuickView } from "../components/product/QuickView";
import type { Product, Testimonial } from "../types";


export function HomePage() {
  const { products } = useProducts();
  const collections = useCollections();
  const testimonials = useTestimonials();
  const { settings } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="w-full overflow-x-hidden flex flex-col pb-0 max-w-[100vw]">
      
      {settings?.homepage_sections?.map((sectionId: string) => {
        switch (sectionId) {
          case 'hero':
            return <HeroSection key="hero" />;
          case 'trending':
            const trendingProducts = products
              .filter(p => p.collections?.some((c: any) => c.slug === 'trending-products'))
              .slice(0, 4);
            return (
              <ProductSection
                key="trending"
                label="Trending Collection"
                title="Trending Products"
                products={trendingProducts}
                onQuickView={setQuickViewProduct}
                viewAllLink="/shop"
              />
            );
          case 'showcase':
            return collections.filter(c => c.show_in_homepage).map(col => {
              const collectionProducts = products
                .filter(p => p.collections?.some((c: any) => c.id === col.id))
                .slice(0, col.limit_products || 4);
                
              return (
                <ProductSection
                  key={`collection-${col.id}`}
                  label={col.subtitle || "Collection"}
                  title={col.name}
                  products={collectionProducts}
                  onQuickView={setQuickViewProduct}
                  viewAllLink={`/collections/${col.slug}`}
                />
              );
            });
          case 'why-choose':
            return <WhyChooseSection key="why-choose" />;
          case 'testimonials':
            return <TestimonialsSection key="testimonials" testimonials={testimonials} />;
          case 'newsletter':
            return <NewsletterSection key="newsletter" />;
          default:
            return null;
        }
      })}


      
      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

function HeroSection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  const heroMedia = settings?.hero_background_media;
  const isVideo = heroMedia ? (heroMedia.endsWith('.mp4') || heroMedia.endsWith('.webm') || heroMedia.endsWith('.mov')) : false;

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-ink-950 flex flex-col items-center justify-center pt-8 pb-10 lg:pb-12 text-center">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {heroMedia && (
          isVideo ? (
            <video
              src={heroMedia}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover bg-ink-950"
            />
          ) : (
            <img 
              src={heroMedia} 
              alt={settings?.hero_title || "Hero Background"} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        )}
        {/* Luxury Overlays */}
        <div className="absolute inset-0 bg-ink-950/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent opacity-90 z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full px-4 flex flex-col items-center max-w-6xl mx-auto animate-fade-up">
        {/* Brand Name Block */}
        <div style={{ marginTop: "8vh" }} className="flex flex-col items-center w-full">
          <h1 
            className="font-playfair text-ink-50 uppercase m-0 p-0 text-center mx-auto whitespace-nowrap"
            style={{
              maxWidth: "100%",
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: "-1px",
              fontSize: "clamp(40px, 8vw, 88px)",
            }}
          >
            {settings?.brand_name?.split(" ")?.[0] || "MarWiz"}
          </h1>

          {/* Brand Subtitle */}
          <h2 
            className="font-playfair text-gold-400 uppercase m-0 p-0 text-center mx-auto whitespace-nowrap"
            style={{
              maxWidth: "100%",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "0.4em",
              fontSize: "clamp(14px, 2.5vw, 30px)",
              marginTop: "4px"
            }}
          >
            {settings?.brand_name?.split(" ")?.slice(1).join(" ") || "Wears & Watches"}
          </h2>
        </div>

        {/* Slogan */}
        {settings?.hero_title && (
          <div className="flex justify-center w-full mx-auto" style={{ marginTop: "18vh" }}>
            <p 
              className="font-playfair italic font-medium text-ink-900 text-center m-0 rounded-full animate-pulse-luxury"
              style={{
                backgroundColor: "rgba(201, 169, 110, 0.35)",
                padding: "8px 24px",
                maxWidth: "100%",
                letterSpacing: "0.05em",
                fontSize: "clamp(16px, 1.5vw, 22px)",
              }}
            >
              • {settings.hero_title} •
            </p>
          </div>
        )}

        {/* Bottom Cluster */}
        <div className="flex flex-col items-center w-full" style={{ marginTop: "auto", paddingTop: "4vh", marginBottom: "4vh" }}>


          {/* Description / Supporting Text */}
          <p 
            className="font-light text-ink-300 text-center mx-auto m-0 uppercase"
            style={{
              maxWidth: "100%",
              letterSpacing: "0.15em",
              fontSize: "clamp(14px, 2vw, 22px)",
              marginBottom: "4vh"
            }}
          >
            {settings?.hero_subtitle || "Premium Clothing • Luxury Watches • Signature Style"}
          </p>

          {/* Buttons */}
          <div 
            className="flex flex-row items-center justify-center w-full mx-auto"
            style={{ gap: "24px" }}
          >
            {settings?.hero_cta_text && (
              <button
                onClick={() => navigate(settings?.hero_cta_link || "/shop")}
                className="bg-gold-400 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-900 transition-all hover:bg-gold-300 shrink-0"
              >
                Explore Collection
              </button>
            )}
            <button
              onClick={() => navigate("/shop")}
              className="border border-ink-600 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-50 transition-all hover:border-gold-400 hover:text-gold-400 shrink-0"
            >
              Shop All
            </button>
          </div>
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
  const { settings } = useStore();

  return (
    <section className="w-full overflow-hidden py-4 lg:py-6">
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

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-ink-800 bg-ink-900/20 rounded-sm">
            <p className="text-gold-400 font-serif text-xl md:text-2xl mb-2">Products Coming Soon</p>
            <p className="text-sm font-light text-ink-400">
              {settings?.brand_name || "MarWiz Wears & Watches"} is undergoing scheduled maintenance. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 items-stretch auto-rows-fr">
            {products.map((product) => {
              const aspect = product.category?.slug?.includes("watch") ? "square" : "portrait";
              return (
                <div key={product.id} className="h-full w-full flex flex-col">
                  <ProductCard 
                    product={product} 
                    onQuickView={onQuickView} 
                    imageAspect={aspect} 
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden w-full">
          <button onClick={() => navigate(viewAllLink)} className="btn-outline w-full max-w-sm">
            View All <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}



function WhyChooseSection() {
  const [features, setFeatures] = useState<any[]>([]);
  const { settings } = useStore();

  useEffect(() => {
    async function loadStandards() {
      const { data } = await supabase
        .from("marwiz_standards")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
        
      if (data && data.length > 0) {
        setFeatures(data);
      } else {
        setFeatures([]);
      }
    }
    loadStandards();
  }, []);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "Award": return Award;
      case "Shield": return Shield;
      case "Truck": return Truck;
      case "Star": return Star;
      case "Check": return Check;
      case "Heart": return Heart;
      case "Gem": return Gem;
      default: return Star;
    }
  };

  if (features.length === 0) return null;

  return (
    <section className="w-full bg-ink-900 py-4 lg:py-6">
      <div className="container-luxury">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <p className="section-label mb-3">Why {settings?.brand_name?.split(" ")?.[0] || "MarWiz"}</p>
          <h2 className="section-title m-0">The {settings?.brand_name?.split(" ")?.[0] || "MarWiz"} Standard</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start auto-rows-fr">
          {features.map((feature: any, i: number) => {
            const Icon = getIcon(feature.icon_name || feature.icon);
            return (
              <div key={i} className="flex flex-col items-center text-center w-full h-full">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/20 bg-ink-950 shrink-0">
                  <Icon size={28} className="text-gold-400" />
                </div>
                <h3 className="text-xs md:text-sm font-medium uppercase tracking-[0.15em] text-ink-100 mb-4 m-0">
                  {feature.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-ink-400 m-0 w-full max-w-[280px]">
                  {feature.description || feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="w-full bg-ink-900/30 py-4 lg:py-6 border-y border-ink-800/50">
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



export function WhatsAppCTASection() {
  const { settings } = useStore();
  const waNumber = settings?.whatsapp_number || "";
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <section className="w-full py-4 lg:py-6">
      <div className="container-luxury">
        <div className="relative overflow-hidden border border-gold-400/20 bg-ink-900 w-full flex flex-col">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
              className="h-full w-full object-cover object-[center_35%]"
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
  const { settings } = useStore();

  return (
    <section className="w-full border-t border-ink-800 bg-ink-950 py-4 lg:py-6">
      <div className="container-luxury">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center w-full">
          <p className="section-label mb-4">Stay Connected</p>
          <h2 className="section-title mb-6 m-0 text-3xl md:text-4xl">Join the {settings?.brand_name?.split(" ")?.[0] || "MarWiz"} Circle</h2>
          <p className="text-sm md:text-base font-light text-ink-300 mb-10 leading-relaxed w-full m-0">
            Be the first to discover new collections, limited editions, and exclusive offers from {settings?.brand_name || "MarWiz"}.
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

export function BrandStorySection() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  return (
    <section className="w-full bg-ink-900/40 py-4 lg:py-6 border-y border-ink-800/50">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden w-full bg-ink-800">
            <img
              src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Brand Story"
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
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
            <h2 className="section-title mb-6 md:mb-8 m-0">The {settings?.brand_name?.split(" ")?.[0] || "MarWiz"} Philosophy</h2>
            <div className="flex flex-col gap-6 text-sm md:text-base font-light leading-relaxed text-ink-200 w-full max-w-xl">
              <p className="m-0">{settings?.footer_about}</p>
              {settings?.tagline && (
                <p className="m-0">
                  {settings.tagline}. {settings?.brand_name?.split(" ")?.[0] || "MarWiz"} offers an extraordinary experience, something
                  that tells your story without saying a word.
                </p>
              )}
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