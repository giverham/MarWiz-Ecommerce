import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
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
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function variantKey(variant: { color?: string; size?: string }) {
  return `${variant.color || ""}-${variant.size || ""}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    (async () => {
      const [settingsRes, navRes] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("nav_items").select("*").neq("is_active", false).order("sort_order"),
      ]);
      
      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
      
      const customNav = (navRes.data as NavItem[]) || [];
      
      // Make nav_items the sole source of truth
      setNavItems(customNav.sort((a, b) => a.sort_order - b.sort_order));
      
      setLoading(false);
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
      setCartOpen(true);
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

  return (
    <StoreContext.Provider
      value={{
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
        cartOpen,
        setCartOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
