import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Heart, Search } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { AnnouncementBar } from "./AnnouncementBar";

export function Header() {
  const { cartCount, setCartOpen, setSearchOpen, settings, wishlist } = useStore();
  const { navigate, path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const brandName = settings?.brand_name || "MarWiz Wears & Watches";
  const brandParts = brandName.split(" ");
  const showAnnouncement = settings?.announcement_active && settings?.announcement_text;

  const HARDCODED_NAV = [
    { id: "home", label: "Home", href: "/" },
    { id: "shop", label: "Shop", href: "/shop" },
    { id: "collections", label: "Collections", href: "/collections" },
    { id: "contact", label: "Contact", href: "/contact" },
    { id: "about", label: "About", href: "/about" }
  ];

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 bg-transparent`}
      >
        {showAnnouncement && !scrolled && <AnnouncementBar />}

        <div className="container-luxury">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Left side: Menu and Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Menu button */}
              <button
                className="flex items-center text-ink-100 hover:text-gold-400 transition-colors group"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-ink-900 border border-ink-800 group-hover:border-gold-400/50 transition-colors">
                  <Menu size={16} />
                </div>
              </button>

              {/* Logo */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                aria-label="Home"
              >
                {settings?.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={brandName} 
                    className="h-8 w-8 rounded-full object-cover shrink-0 border border-gold-400/20"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border border-gold-400/20 bg-ink-950 flex items-center justify-center shrink-0">
                    <span className="font-display font-medium text-ink-50 text-sm">
                      {brandParts[0]?.[0] || "M"}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-ink-200 transition-colors hover:text-gold-400"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => navigate("/wishlist")}
                className="relative text-ink-200 transition-colors hover:text-gold-400"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-400 text-[8px] font-bold text-ink-900">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-ink-200 transition-colors hover:text-gold-400"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-400 text-[8px] font-bold text-ink-900">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-60 bg-black/60 backdrop-blur-md border-r border-white/10 p-6 flex flex-col animate-slide-in-left shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-12 shrink-0">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={brandName} 
                  className="h-10 w-10 rounded-full object-cover shrink-0 border border-gold-400/20"
                />
              ) : (
                <span className="font-display text-xl text-ink-50">
                  {brandParts[0]}
                </span>
              )}
              <button 
                onClick={() => setMobileOpen(false)} 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 border border-ink-800 text-ink-300 hover:text-gold-400 hover:border-gold-400/50 transition-colors shrink-0"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {HARDCODED_NAV.map((item) => {
                const isActive = path === item.href;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.href);
                      setMobileOpen(false);
                    }}
                    className={`py-4 text-left text-xs md:text-sm font-light uppercase tracking-[0.2em] transition-all flex items-center gap-4 group ${
                      isActive ? "text-gold-400 pl-4" : "text-white/80 hover:text-gold-400 hover:pl-4"
                    }`}
                  >
                    <span className={`h-px bg-gold-400 transition-all ${isActive ? "w-6" : "w-0 group-hover:w-6"}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-auto pt-8 border-t border-ink-800 shrink-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-500 text-center">
                © {new Date().getFullYear()} {brandParts.join(" ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
