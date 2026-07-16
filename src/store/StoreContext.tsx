import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { CartItem, Product, SiteSettings, NavItem } from "../types";

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  settings: SiteSettings | null;
  navItems: NavItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number, variant?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string, variantKey: string) => void;
  updateQuantity: (productId: string, variantKey: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cartNotification: string | null;
  setCartNotification: (msg: string | null) => void;
}

interface CartUIContextValue {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const CartUIContext = createContext<CartUIContextValue | null>(null);

function variantKey(variant: { color?: string; size?: string }) {
  return `${variant.color || ""}-${variant.size || ""}`;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  announcement_text: "Dare to Wear Different | Enjoy Free Shipping Worldwide",
  announcement_active: true,
  hero_title: "MarWiz Wears & Watches",
  hero_subtitle: "Daringly Premium. Uncompromised Style.",
  hero_background_media: null,
  hero_image_url: null,
  hero_video_url: null,
  hero_cta_text: "Shop the Collection",
  hero_cta_link: "/shop",
  brand_name: "MarWiz",
  tagline: "Dare To Wear Different",
  logo_url: null,
  favicon_url: null,
  footer_about: "Premium clothing and watches crafted for those who define luxury on their own terms.",
  footer_copyright: "© 2026 MarWiz. All Rights Reserved.",
  bank_name: null,
  account_name: null,
  account_number: null,
  whatsapp_number: "+1234567890",
  contact_email: "contact@marwiz.store",
  contact_phone: "+1234567890",
  contact_address: "MarWiz Headquarters",
  contact_hours: "24/7",
  instagram_url: null,
  facebook_url: null,
  twitter_url: null,
  tiktok_url: null,
  why_marwiz: [],
  meta_title: "MarWiz - Premium Clothing & Luxury Watches",
  meta_description: "Discover exclusive clothing and custom watches.",
  meta_keywords: "fashion, luxury, watches",
  google_analytics_id: null,
  google_search_console: null,
  primary_color: "#0b0a0a",
  secondary_color: "#d4af37",
  accent_color: "#1c1917",
  maintenance_mode: false,
  homepage_sections: ["hero", "trending", "why-choose", "testimonials", "newsletter"],
  instagram_handle: "marwiz",
  brand_story_image_url: null,
  whatsapp_cta_image_url: null,
  default_placeholder_url: null,
  default_product_url: null
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpenState] = useState(false);
  const setCartOpen = useCallback((open: boolean) => {
    setCartOpenState(open);
  }, []);
  const [searchOpen, setSearchOpenState] = useState(false);
  const setSearchOpen = useCallback((open: boolean) => {
    setSearchOpenState(open);
  }, []);
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  useEffect(() => {
    if (cartNotification) {
      const timer = setTimeout(() => setCartNotification(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [cartNotification]);
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, navRes] = await Promise.all([
          supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
          supabase.from("nav_items").select("*").neq("is_active", false).order("sort_order"),
        ]);
        
        setSettings((settingsRes.data as SiteSettings) || DEFAULT_SETTINGS);
        
        const customNav = (navRes.data as NavItem[]) || [];
        
        // Make nav_items the sole source of truth
        setNavItems(customNav.sort((a, b) => a.sort_order - b.sort_order));
      } catch (error) {
        console.error("Failed to load database config, falling back to local storage:", error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    })();

    try {
      const savedCart = localStorage.getItem("marwiz-cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("marwiz-wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("marwiz-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("marwiz-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("cart=true")) {
      setCartOpen(true);
      setCart([
        {
          product: {
            id: "test-product-id",
            name: "Luxury Gold Watch (Test)",
            slug: "luxury-gold-watch-test",
            price: 299,
            compare_at_price: 450,
            images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400"],
            variants: { colors: ["Gold"], sizes: ["One Size"] },
            specs: {},
            stock: 10,
            availability: "in_stock",
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString()
          },
          quantity: 2,
          variant: { color: "Gold", size: "One Size" }
        }
      ]);
    }
  }, []);

  // Dynamic CSS Variables and Favicon
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.primary_color) root.style.setProperty('--color-ink-950', settings.primary_color);
      if (settings.secondary_color) root.style.setProperty('--color-gold-400', settings.secondary_color);
      if (settings.accent_color) root.style.setProperty('--color-ink-900', settings.accent_color);

      if (settings.favicon_url) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = settings.favicon_url;
      }
    }
  }, [settings]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant: { color?: string; size?: string } = {}) => {
      setCart((prev) => {
        const key = variantKey(variant);
        const existing = prev.find(
          (item) => item.product.id === product.id && variantKey(item.variant) === key
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id && variantKey(item.variant) === key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity, variant }];
      });
      setCartNotification(`✓ Added to Cart`);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, vKey: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && variantKey(item.variant) === vKey)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, vKey: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, vKey);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId && variantKey(item.variant) === vKey
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const storeValue = useMemo(
    () => ({
      cart,
      wishlist,
      settings,
      navItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      toggleWishlist,
      isWishlisted,
      searchOpen,
      setSearchOpen,
      cartNotification,
      setCartNotification,
    }),
    [
      cart,
      wishlist,
      settings,
      navItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      toggleWishlist,
      isWishlisted,
      searchOpen,
      setSearchOpen,
      cartNotification,
    ]
  );

  const cartUIValue = useMemo(
    () => ({ cartOpen, setCartOpen }),
    [cartOpen, setCartOpen]
  );

  return (
    <StoreContext.Provider value={storeValue}>
      <CartUIContext.Provider value={cartUIValue}>{children}</CartUIContext.Provider>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCartUI() {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI must be used within StoreProvider");
  return ctx;
}
