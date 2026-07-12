import { useState, useEffect } from "react";
import { ChevronDown, Mail, Phone, MapPin, Clock } from "lucide-react";
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
      .eq("is_active", true)
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
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <p className="text-base font-light leading-relaxed text-ink-300">
          {content.body as string}
        </p>
        <div className="mt-8 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{content.address as string || settings?.contact_address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{content.email as string || settings?.contact_email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{content.phone as string || settings?.contact_phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="shrink-0 text-gold-400" />
            <span className="text-sm text-ink-300">{content.hours as string}</span>
          </div>
        </div>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for reaching out. We will respond shortly.");
          }}
          className="space-y-5"
        >
          <div>
            <label className="label-luxury">Name</label>
            <input required type="text" className="input-luxury" placeholder="Your name" />
          </div>
          <div>
            <label className="label-luxury">Email</label>
            <input required type="email" className="input-luxury" placeholder="Your email" />
          </div>
          <div>
            <label className="label-luxury">Message</label>
            <textarea required rows={5} className="input-luxury resize-none" placeholder="Your message" />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
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
