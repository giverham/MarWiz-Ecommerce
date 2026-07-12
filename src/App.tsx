import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { AdminAuthProvider } from "./admin/AdminAuth";
import { AdminApp } from "./admin/AdminApp";
import { useRouter } from "./lib/router";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { SearchBar } from "./components/layout/SearchBar";
import { Loader } from "./components/layout/Loader";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { WishlistPage } from "./pages/WishlistPage";
import { StaticPage } from "./pages/StaticPage";

function AppContent() {
  const { path } = useRouter();
  const { settings, loading } = useStore();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Admin route
  if (path.startsWith("/admin")) {
    return (
      <AdminAuthProvider>
        <AdminApp />
      </AdminAuthProvider>
    );
  }

  if (showLoader || loading) return <Loader />;

  // Maintenance mode
  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="text-center max-w-md px-6">
          <h1 className="font-display text-4xl text-gold-400 mb-4">We'll Be Back Soon</h1>
          <p className="text-sm font-light text-ink-400">
            MarWiz Wears & Watches is undergoing scheduled maintenance. Please check back shortly.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-ink-600">Dare To Wear Different</p>
        </div>
      </div>
    );
  }

  // Parse route
  const renderPage = () => {
    if (path === "/" || path === "") return <HomePage />;

    if (path === "/shop") return <ShopPage />;
    if (path === "/collections") return <CollectionsPage />;
    if (path === "/wishlist") return <WishlistPage />;
    if (path === "/checkout") return <CheckoutPage />;

    if (path.startsWith("/category/")) {
      const slug = path.split("/category/")[1];
      return <ShopPage categorySlug={slug} />;
    }

    if (path.startsWith("/collection/")) {
      const slug = path.split("/collection/")[1];
      return <ShopPage title={slug.charAt(0).toUpperCase() + slug.slice(1)} />;
    }

    if (path.startsWith("/product/")) {
      const slug = path.split("/product/")[1];
      return <ProductDetailPage slug={slug} />;
    }

    if (path.startsWith("/page/")) {
      const slug = path.split("/page/")[1];
      return <StaticPage slug={slug} />;
    }

    // 404
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-display text-6xl text-ink-700">404</h1>
          <p className="mt-4 text-sm text-ink-400">Page not found.</p>
          <a href="#/" className="btn-outline mt-6 inline-flex">Return Home</a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Header />
      <main>{renderPage()}</main>
      <Footer />
      <CartDrawer />
      <SearchBar />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
