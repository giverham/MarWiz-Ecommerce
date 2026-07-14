import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";

export function Footer() {
  const { settings } = useStore();
  const { navigate } = useRouter();

  const footerLinks = [
    { label: "About", href: "/page/about" },
    { label: "Contact", href: "/page/contact" },
    { label: "FAQs", href: "/page/faqs" },
    { label: "Shipping", href: "/page/shipping" },
    { label: "Returns", href: "/page/returns" },
    { label: "Privacy Policy", href: "/page/privacy" },
    { label: "Terms & Conditions", href: "/page/terms" },
  ];

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="container-luxury py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 object-contain mb-4" />
            ) : (
              <h3 className="font-display text-2xl text-ink-50">
                {settings?.brand_name?.split(" ")?.[0] || "MarWiz"}
                <span className="text-gold-400">
                  {" "}
                  {settings?.brand_name?.split(" ")?.slice(1).join(" ") || ""}
                </span>
              </h3>
            )}
            <p className="mt-4 text-sm font-light leading-relaxed text-ink-400">
              {settings?.footer_about}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigate("/shop")} className="text-sm text-ink-300 transition-colors hover:text-gold-400">
                  Shop All
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/category/watches")} className="text-sm text-ink-300 transition-colors hover:text-gold-400">
                  Luxury Watches
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/category/fashion")} className="text-sm text-ink-300 transition-colors hover:text-gold-400">
                  Luxury Fashion
                </button>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Information
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-sm text-ink-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ink-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
                <span>{settings?.contact_address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-300">
                <Phone size={16} className="shrink-0 text-gold-400" />
                <span>{settings?.contact_phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-300">
                <Mail size={16} className="shrink-0 text-gold-400" />
                <span>{settings?.contact_email}</span>
              </li>
            </ul>
            {/* Social */}
            <div className="mt-5 flex gap-3">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center border border-ink-700 text-ink-300 transition-all hover:border-gold-400 hover:text-gold-400">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center border border-ink-700 text-ink-300 transition-all hover:border-gold-400 hover:text-gold-400">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center border border-ink-700 text-ink-300 transition-all hover:border-gold-400 hover:text-gold-400">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — copyright and theme toggle */}
      <div className="border-t border-ink-800">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">{settings?.footer_copyright}</p>
        </div>
      </div>
    </footer>
  );
}
