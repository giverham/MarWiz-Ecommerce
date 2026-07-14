import { useState, useEffect } from "react";
import { ChevronDown, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/StoreContext";
import type { Page } from "../types";

interface StaticPageProps {
  slug: string;
}

export function StaticPage({ slug }: StaticPageProps) {
  const { settings } = useStore();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .neq("is_active", false)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPage(data as Page);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container-luxury">
          <div className="h-12 w-1/2 shimmer-bg animate-shimmer mb-6" />
          <div className="h-48 w-full shimmer-bg animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-ink-300">Page not found.</p>
      </div>
    );
  }

  const content = page.content as Record<string, unknown>;

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-luxury">
        {slug === "about" ? (
          <AboutContent content={content} />
        ) : (
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-section text-ink-50 mb-8">
              {(content.heading as string) || page.title}
            </h1>

            {slug === "contact" ? (
              <ContactContent content={content} settings={settings} />
            ) : slug === "faqs" ? (
              <FAQContent content={content} />
            ) : (
              <div>
                {content.image ? (
                  <div className="mb-8 aspect-[16/9] overflow-hidden">
                    <img src={content.image as string} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <p className="text-base font-light leading-relaxed text-ink-300 whitespace-pre-line">
                  {content.body as string}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactContent({
  content,
  settings,
}: {
  content: Record<string, unknown>;
  settings: ReturnType<typeof useStore>["settings"];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("enquiries").insert({
        name,
        email,
        message,
      });
      if (error) throw error;
      alert("Thank you for reaching out. We will respond shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Error sending message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <p className="text-base font-light leading-relaxed text-ink-300">
          {content.body as string}
        </p>
        <div className="mt-8 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{settings?.contact_address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{settings?.contact_email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{settings?.contact_phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle size={18} className="shrink-0 text-gold-400" />
            <a 
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/\+/g, "")}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-ink-300 hover:text-gold-400 transition-colors"
            >
              WhatsApp: {settings?.whatsapp_number}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{settings?.contact_hours}</span>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-luxury">Name</label>
            <input
              required
              type="text"
              className="input-luxury"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxury">Email</label>
            <input
              required
              type="email"
              className="input-luxury"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxury">Message</label>
            <textarea
              required
              rows={5}
              className="input-luxury resize-none"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FAQContent({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ q: string; a: string }>) || [];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-ink-700 bg-ink-900">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <span className="text-sm font-medium text-ink-100">{item.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-gold-400 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm font-light leading-relaxed text-ink-300">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AboutContent({ content }: { content: Record<string, any> }) {
  const about = content.about_marwiz || {
    title: content.title || "The House of MarWiz",
    subtitle: content.subtitle || "Nigerian Luxury & Heritage",
    description: content.description || "",
    image: content.main_image || "",
    button: content.cta_btn_text || "Shop Collection"
  };

  const statistics = content.statistics || [
    { title: "Years of Craft", number: content.stat_years?.replace("+", "") || "12", suffix: "+", enabled: true },
    { title: "Global Clients", number: content.stat_customers?.replace("+", "") || "5,000", suffix: "+", enabled: true },
    { title: "Luxury Designs", number: content.stat_products?.replace("+", "") || "150", suffix: "+", enabled: true },
    { title: "Orders Delivered", number: content.stat_orders?.replace("+", "") || "10,000", suffix: "+", enabled: true },
  ];

  const mission = content.mission || {
    title: content.mission_title || "Our Mission",
    description: content.mission_desc || "",
    enabled: true
  };

  const vision = content.vision || {
    title: content.vision_title || "Our Vision",
    description: content.vision_desc || "",
    enabled: true
  };

  const pillars = content.pillars || (content.values || []).map((v: any) => ({ ...v, enabled: true }));

  const btc = content.behind_the_craft || {
    image: content.brand_story_image || "",
    title: "Behind The Craft",
    subtitle: "The Narrative",
    description: content.company_story || "",
    button: "Learn More",
    enabled: !!content.company_story
  };

  return (
    <div className="space-y-16 md:space-y-20 pt-8">
      {/* 1. About MarWiz */}
      <section className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          {about.subtitle && (
            <p className="text-xs uppercase tracking-[0.25em] text-gold-400 font-display">
              {about.subtitle}
            </p>
          )}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-50 leading-tight">
            {about.title}
          </h2>
          <p className="text-lg font-light leading-relaxed text-ink-300 whitespace-pre-line">
            {about.description}
          </p>
          {about.button && (
            <div className="pt-4">
              <a href="/shop" className="btn-primary inline-block">
                {about.button}
              </a>
            </div>
          )}
        </div>
        <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden border border-ink-800 bg-ink-900 shadow-2xl mx-auto w-full max-w-sm">
          <img
            src={about.image}
            alt={about.title}
            className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
          />
        </div>
      </section>

      {/* 2. Key Stats Row */}
      {statistics.filter((s: any) => s.enabled).length > 0 && (
        <section className="border-y border-ink-800 py-12 bg-ink-950/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statistics.filter((s: any) => s.enabled).map((stat: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-gold-400 tracking-tight">
                  {stat.number}{stat.suffix}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 font-medium">{stat.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Mission & Vision Section */}
      {(mission.enabled || vision.enabled) && (
        <section className="grid gap-8 md:grid-cols-2 pb-8">
          {mission.enabled && (
            <div className="border border-ink-800 bg-ink-900/60 p-8 sm:p-10 space-y-4 hover:border-gold-400/30 transition-colors duration-300">
              <h4 className="font-display text-xl text-gold-400 uppercase tracking-wider">
                {mission.title}
              </h4>
              <p className="text-sm font-light leading-relaxed text-ink-300 whitespace-pre-line">
                {mission.description}
              </p>
            </div>
          )}
          {vision.enabled && (
            <div className="border border-ink-800 bg-ink-900/60 p-8 sm:p-10 space-y-4 hover:border-gold-400/30 transition-colors duration-300">
              <h4 className="font-display text-xl text-gold-400 uppercase tracking-wider">
                {vision.title}
              </h4>
              <p className="text-sm font-light leading-relaxed text-ink-300 whitespace-pre-line">
                {vision.description}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
