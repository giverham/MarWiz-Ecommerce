import { useState, useEffect, useRef, memo } from "react";
import { ArrowRight, Star, Shield, Truck, Award, MessageCircle, Check, Heart, Gem, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="w-full overflow-x-hidden flex flex-col pb-0 max-w-[100vw] relative bg-[#0b0a0a]">
      {/* Tactile Fine-Grain Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.035]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Luxury Geometric Grid Line Pattern (Highly Visible & Premium) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.12]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(212,175,55,0.15)' stroke-width='0.75'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />


      
      {settings?.homepage_sections?.map((sectionId: string) => {
        switch (sectionId) {
          case 'hero':
            return <HeroSection key="hero" settings={settings} />;
          case 'trending':
            const trendingProducts = products
              .filter(p => p.collections?.some((c: any) => c.slug === 'trending-products'))
              .slice(0, 8);
            return (
              <ProductSection
                key="trending"
                label="Trending Collection"
                title="Trending Products"
                products={trendingProducts}
                onQuickView={setQuickViewProduct}
                viewAllLink="/shop"
                brandName={settings?.brand_name}
              />
            );
          case 'showcase':
            return collections.filter(c => c.show_in_homepage).map(col => {
              const collectionProducts = products
                .filter(p => p.collections?.some((c: any) => c.id === col.id))
                .slice(0, col.limit_products || 8);
                
              return (
                <ProductSection
                  key={`collection-${col.id}`}
                  label={col.subtitle || "Collection"}
                  title={col.name}
                  products={collectionProducts}
                  onQuickView={setQuickViewProduct}
                  viewAllLink={`/collections/${col.slug}`}
                  brandName={settings?.brand_name}
                />
              );
            });
          case 'why-choose':
            return <WhyChooseSection key="why-choose" brandName={settings?.brand_name} />;
          case 'testimonials':
            return <TestimonialsSection key="testimonials" testimonials={testimonials} />;
          case 'newsletter':
            return <NewsletterSection key="newsletter" brandName={settings?.brand_name} />;
          default:
            return null;
        }
      })}


      {/* Clear, visible ambient luxury glow */}
      <div className="absolute top-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-amber-500/15 blur-[150px] pointer-events-none -z-10 animate-ambient-glow-1" />
      <div className="absolute top-[60%] right-[5%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[180px] pointer-events-none -z-10 animate-ambient-glow-2" />
      <div className="absolute top-[80%] left-[8%] w-[480px] h-[480px] rounded-full bg-amber-700/12 blur-[150px] pointer-events-none -z-10 animate-ambient-glow-1" />

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

const HeroSection = memo(function HeroSection({ settings }: { settings: any }) {
  const { navigate } = useRouter();

  const heroMedia = settings?.hero_background_media;
  const isVideo = heroMedia ? (heroMedia.endsWith('.mp4') || heroMedia.endsWith('.webm') || heroMedia.endsWith('.mov')) : false;

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#0b0a0a] flex flex-col items-center justify-center pt-8 pb-10 lg:pb-12 text-center">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 w-full h-full bg-[#0b0a0a]">
        {heroMedia && (
          isVideo ? (
            <div className="relative z-10 w-full h-full min-h-[100dvh] min-h-[600px] overflow-hidden" style={{ background: "url('/video-fallback.jpg') center center / cover no-repeat", backgroundColor: "#0b0a0a" }}>
              <video
                poster="/video-fallback.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full min-h-full object-cover"
                style={{ filter: "none", mixBlendMode: "normal", background: "url('/video-fallback.jpg') center center / cover no-repeat", backgroundColor: "#0b0a0a", objectFit: "cover" }}
              >
                <source src={heroMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-20"></div>
            </div>
          ) : (
            <>
              <img 
                src={heroMedia} 
                alt={settings?.hero_title || "Hero Background"} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Elegant Bottom Overlay Gradient Mask to blend image seamlessly with background */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0b0a0a] pointer-events-none z-10" />
            </>
          )
        )}
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
            className="font-playfair font-bold text-gold-400 uppercase m-0 p-0 text-center mx-auto whitespace-nowrap"
            style={{
              maxWidth: "100%",
              fontWeight: "bold",
              lineHeight: 1,
              letterSpacing: "0.4em",
              fontSize: "clamp(14px, 2.5vw, 30px)",
              marginTop: "4px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)"
            }}
          >
            {settings?.brand_name?.split(" ")?.slice(1).join(" ") || "Wears & Watches"}
          </h2>
        </div>

        {/* Slogan */}
        {settings?.hero_title && (
          <div className="flex justify-center w-full mx-auto" style={{ marginTop: "18vh" }}>
            <p 
              className="font-playfair italic font-bold text-ink-900 text-center m-0 rounded-full animate-pulse-luxury"
              style={{
                backgroundColor: "rgba(201, 169, 110, 0.35)",
                padding: "8px 24px",
                maxWidth: "100%",
                letterSpacing: "0.05em",
                fontSize: "clamp(16px, 1.5vw, 22px)",
                WebkitTextStroke: "1px black"
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
            className="font-bold text-white text-center mx-auto m-0 uppercase"
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
                onClick={() => navigate("/collections")}
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
});



interface ProductSectionProps {
  label: string;
  title: string;
  products: Product[];
  onQuickView: (p: Product) => void;
  viewAllLink: string;
  brandName?: string;
}

const ProductSection = memo(function ProductSection({ label, title, products, onQuickView, viewAllLink, brandName }: ProductSectionProps) {
  const { navigate } = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth * 0.75, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth * 0.75, behavior: "smooth" });
    }
  };

  return (
    <section 
      className="w-full overflow-hidden relative z-10"
      style={{
        paddingTop: "12px",
        paddingBottom: "16px",
        marginTop: "8px",
        marginBottom: "8px"
      }}
    >
      <div className="container-luxury">
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
            <p className="section-label mb-3">{label}</p>
            <h2 className="section-title m-0">{title}</h2>
          </div>
          
          <div className="flex items-center gap-6 shrink-0">
            {products.length > 4 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-neutral-900/40 backdrop-blur-sm text-ink-300 hover:text-gold-400 hover:border-gold-400/30 transition-all"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={scrollRight}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-neutral-900/40 backdrop-blur-sm text-ink-300 hover:text-gold-400 hover:border-gold-400/30 transition-all"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            <button
              onClick={() => navigate(viewAllLink)}
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300 transition-colors hover:text-gold-400 shrink-0"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-white/5 bg-neutral-900/10 backdrop-blur-md rounded-md">
            <p className="text-gold-400 font-serif text-xl md:text-2xl mb-2">Products Coming Soon</p>
            <p className="text-sm font-light text-ink-400">
              {brandName || "MarWiz Wears & Watches"} is undergoing scheduled maintenance. Please check back shortly.
            </p>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth w-full items-stretch"
          >
            {products.map((product) => {
              const aspect = product.category?.slug?.includes("watch") ? "square" : "portrait";
              return (
                <div 
                  key={product.id} 
                  className="w-[75%] sm:w-[45%] md:w-[31%] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col h-full"
                >
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
});



const WhyChooseSection = memo(function WhyChooseSection({ brandName }: { brandName?: string }) {
  const [features, setFeatures] = useState<any[]>([]);

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
    <section className="w-full py-4 md:py-6 my-2 bg-transparent relative z-10 border-t border-white/5">
      <div className="container-luxury">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <p className="section-label mb-3">Why {brandName?.split(" ")?.[0] || "MarWiz"}</p>
          <h2 className="section-title m-0">The {brandName?.split(" ")?.[0] || "MarWiz"} Standard</h2>
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
});



const TestimonialsSection = memo(function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="w-full py-4 md:py-6 my-2 bg-transparent relative z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 md:mb-12 flex flex-col items-center text-center">
          <p className="section-label mb-3">Client Voices</p>
          <h2 className="section-title m-0">What They Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch auto-rows-fr">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-ink-800 bg-ink-950/50 pt-4 pb-4 px-5 flex flex-col h-full w-full items-start text-left">
              <p className="text-sm md:text-base font-light leading-relaxed text-ink-200 flex-1 mb-3 w-full m-0">"{t.content}"</p>
              <div className="flex items-center gap-3 shrink-0 justify-start w-full">
                {t.image_url && (
                  <div className="h-10 w-10 overflow-hidden rounded-full shrink-0 border border-ink-800">
                    <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" loading="eager" />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink-50 m-0">{t.name}</p>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={10} className="text-gold-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  {t.role && <p className="text-[10px] text-ink-400 mt-0.5 uppercase tracking-[0.15em] m-0">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});



const WhatsAppCTASection = memo(function WhatsAppCTASection({ whatsappNumber }: { whatsappNumber?: string }) {
  const waLink = `https://wa.me/${whatsappNumber || ""}`;

  return (
    <section className="w-full py-4 md:py-6 my-2 bg-transparent relative z-10 border-t border-white/5">
      <div className="container-luxury">
        <div className="relative overflow-hidden border border-gold-400/20 bg-ink-900 w-full flex flex-col">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
              className="h-full w-full object-cover object-[center_35%]"
              loading="eager"
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
});



const NewsletterSection = memo(function NewsletterSection({ brandName }: { brandName?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="w-full py-4 md:py-6 my-2 bg-transparent relative z-10 border-t border-white/5">
      <div className="container-luxury">
        <div className="mx-auto max-w-2xl flex flex-col items-center text-center w-full">
          <p className="section-label mb-4">Stay Connected</p>
          <h2 className="section-title mb-6 m-0 text-3xl md:text-4xl">Join the {brandName?.split(" ")?.[0] || "MarWiz"} Circle</h2>
          <p className="text-sm md:text-base font-light text-ink-300 mb-10 leading-relaxed w-full m-0">
            Be the first to discover new collections, limited editions, and exclusive offers from {brandName || "MarWiz"}.
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
});



export const BrandStorySection = memo(function BrandStorySection({ settings }: { settings: any }) {
  const { navigate } = useRouter();

  return (
    <section className="w-full py-4 md:py-6 my-2 bg-transparent relative z-10 border-t border-white/5">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden w-full bg-ink-800">
            <img
              src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Brand Story"
              className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
              loading="eager"
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
});