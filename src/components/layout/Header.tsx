import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Heart, Search } from "lucide-react";
import { useStore } from "../../store/StoreContext";
import { useRouter } from "../../lib/router";
import { AnnouncementBar } from "./AnnouncementBar";

export function Header() {
  const { navItems, cartCount, setCartOpen, setSearchOpen, settings, wishlist } = useStore();
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

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
        }`}
      >
        {showAnnouncement && !scrolled && <AnnouncementBar />}

        <div className="container-luxury">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-ink-100"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo and Brand */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 md:gap-4"
            >
              {settings?.logo_url && (
                <img 
                  src={settings.logo_url} 
                  alt={brandName} 
                  className="h-8 md:h-10 lg:h-11 w-auto object-contain shrink-0"
                />
              )}
              <div className="flex flex-col items-start justify-center">
                <span className="font-display text-2xl md:text-3xl font-medium tracking-wide text-ink-50 leading-none">
                  {brandParts[0]}
                </span>
                {brandParts.length > 1 && (
                  <span className="text-[9px] md:text-[11px] font-medium tracking-[0.35em] uppercase text-gold-400 mt-1.5 leading-none">
                    {brandParts.slice(1).join(" ")}
                  </span>
                )}
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.href)}
                  className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                    path === item.href
                      ? "text-gold-400"
                      : "text-ink-200 hover:text-gold-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-ink-900 p-6 animate-slide-in-left">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl text-ink-50">
                {brandParts[0]}
                <span className="text-gold-400"> {brandParts.slice(1).join(" ")}</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-ink-300">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.href)}
                  className="py-3 text-sm font-medium uppercase tracking-[0.15em] text-ink-200 transition-colors hover:text-gold-400"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
