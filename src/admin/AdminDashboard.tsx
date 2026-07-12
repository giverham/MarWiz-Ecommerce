import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Settings, Image as ImageIcon,
  FileText, Star, Palette, Menu, X, LogOut, Layers, Tag, MessageSquare,
  Phone, Search, CreditCard, Globe, Eye, Plus, Trash2,
  Edit, Save, AlertCircle,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuth";
import { supabase } from "../lib/supabase";
import { formatNaira, slugify } from "../lib/utils";
import type { Product, Order, Category, Collection, Testimonial, Page, NavItem, SiteSettings, MediaItem } from "../types";

type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "collections"
  | "orders"
  | "testimonials"
  | "pages"
  | "nav"
  | "media"
  | "settings"
  | "appearance"
  | "seo";

export function AdminDashboard() {
  const { signOut } = useAdminAuth();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "collections", label: "Collections", icon: Layers },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "nav", label: "Navigation", icon: Menu },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "seo", label: "SEO", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 border-r border-ink-800 bg-ink-900 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-ink-800">
          <span className="font-display text-xl text-ink-50">
            MarWiz<span className="text-gold-400"> Admin</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ink-400">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                section === item.id
                  ? "bg-gold-400/10 text-gold-400 border-l-2 border-gold-400"
                  : "text-ink-400 hover:text-ink-100 hover:bg-ink-800"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink-400 hover:text-red-400 transition-colors mt-8 border-t border-ink-800 pt-4"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-ink-800 bg-ink-900/80 glass px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink-300">
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-medium text-ink-100 capitalize">{section.replace("-", " ")}</h1>
          <a
            href="#/"
            target="_blank"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-400 hover:text-gold-400"
          >
            <Eye size={14} /> View Site
          </a>
        </div>

        <div className="p-6 lg:p-8">
          {section === "dashboard" && <DashboardOverview />}
          {section === "products" && <ProductsManager />}
          {section === "categories" && <CategoriesManager />}
          {section === "collections" && <CollectionsManager />}
          {section === "orders" && <OrdersManager />}
          {section === "testimonials" && <TestimonialsManager />}
          {section === "pages" && <PagesManager />}
          {section === "nav" && <NavManager />}
          {section === "media" && <MediaManager />}
          {section === "settings" && <SettingsManager />}
          {section === "appearance" && <AppearanceManager />}
          {section === "seo" && <SEOManager />}
        </div>
      </main>
    </div>
  );
}

// ============ DASHBOARD OVERVIEW ============
function DashboardOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const allOrders = orders as Order[] || [];
      const revenue = allOrders.reduce((s, o) => s + o.total, 0);
      setStats({
        products: products || 0,
        orders: allOrders.length,
        revenue,
        pending: allOrders.filter((o) => o.status === "pending").length,
      });
      setRecentOrders(allOrders);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats.products.toString()} icon={Package} />
        <StatCard label="Total Orders" value={stats.orders.toString()} icon={ShoppingBag} />
        <StatCard label="Revenue" value={formatNaira(stats.revenue)} icon={CreditCard} />
        <StatCard label="Pending Orders" value={stats.pending.toString()} icon={AlertCircle} />
      </div>

      <div className="border border-ink-800 bg-ink-900 p-6">
        <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-gold-400 mb-4">
          Recent Orders
        </h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-ink-800 pb-3 last:border-0">
                <div>
                  <p className="text-sm text-ink-100">{order.order_number}</p>
                  <p className="text-xs text-ink-500">{order.customer_name} — {order.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold-400">{formatNaira(order.total)}</p>
                  <span className={`text-xs ${order.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
  return (
    <div className="border border-ink-800 bg-ink-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-500">{label}</span>
        <Icon size={18} className="text-gold-400" />
      </div>
      <p className="text-2xl font-medium text-ink-50">{value}</p>
    </div>
  );
}

// ============ PRODUCTS MANAGER ============
function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const [{ data: prods }, { data: cats }, { data: colls }] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("collections").select("*").order("sort_order"),
    ]);
    if (prods) setProducts(prods as Product[]);
    if (cats) setCategories(cats as Category[]);
    if (colls) setCollections(collections as Collection[]);
    if (colls) setCollections(colls as Collection[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  };

  if (showForm || editing) {
    return (
      <ProductForm
        product={editing}
        categories={categories}
        collections={collections}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSaved={() => { setShowForm(false); setEditing(null); load(); }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-400">{products.length} products</p>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div className="overflow-x-auto border border-ink-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-800 bg-ink-900">
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Product</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Price</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Stock</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Flags</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-ink-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-800 hover:bg-ink-900">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden bg-ink-800">
                      <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-sm text-ink-100">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gold-400">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-sm text-ink-300">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {p.is_featured && <span className="bg-gold-400/20 text-gold-400 px-2 py-0.5 text-[10px] uppercase">Featured</span>}
                    {p.is_best_seller && <span className="bg-blue-900/30 text-blue-300 px-2 py-0.5 text-[10px] uppercase">Best</span>}
                    {p.is_new_arrival && <span className="bg-green-900/30 text-green-300 px-2 py-0.5 text-[10px] uppercase">New</span>}
                    {p.is_limited_edition && <span className="bg-red-900/30 text-red-300 px-2 py-0.5 text-[10px] uppercase">Limited</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="text-ink-400 hover:text-gold-400 mr-3">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-ink-400 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  product, categories, collections, onClose, onSaved,
}: {
  product: Product | null;
  categories: Category[];
  collections: Collection[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    category_id: product?.category_id || "",
    collection_id: product?.collection_id || "",
    images: (product?.images || []).join("\n"),
    colors: (product?.variants?.colors || []).join(", "),
    sizes: (product?.variants?.sizes || []).join(", "),
    specs: JSON.stringify(product?.specs || {}, null, 2),
    stock: product?.stock?.toString() || "0",
    is_featured: product?.is_featured || false,
    is_best_seller: product?.is_best_seller || false,
    is_new_arrival: product?.is_new_arrival || false,
    is_limited_edition: product?.is_limited_edition || false,
    is_active: product?.is_active ?? true,
    sort_order: product?.sort_order?.toString() || "0",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      price: parseFloat(form.price) || 0,
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category_id: form.category_id || null,
      collection_id: form.collection_id || null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      variants: {
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      },
      specs: (() => { try { return JSON.parse(form.specs); } catch { return {}; } })(),
      stock: parseInt(form.stock) || 0,
      is_featured: form.is_featured,
      is_best_seller: form.is_best_seller,
      is_new_arrival: form.is_new_arrival,
      is_limited_edition: form.is_limited_edition,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (product) {
      await supabase.from("products").update(data).eq("id", product.id);
    } else {
      await supabase.from("products").insert(data);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-ink-100">{product ? "Edit Product" : "Add Product"}</h2>
        <button onClick={onClose} className="text-ink-400 hover:text-ink-100">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" />
        </FormField>
        <FormField label="Slug (leave blank to auto-generate)">
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury resize-none" rows={3} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Price (₦)">
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury" />
        </FormField>
        <FormField label="Compare at Price (₦)">
          <input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className="input-luxury" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category">
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-luxury">
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="Collection">
          <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })} className="input-luxury">
            <option value="">None</option>
            {collections.map((c) => <option key={c.id} value={c.id} className="bg-ink-900">{c.name}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Image URLs (one per line)">
        <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-luxury resize-none" rows={4} placeholder="https://..." />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Colors (comma-separated)">
          <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input-luxury" />
        </FormField>
        <FormField label="Sizes (comma-separated)">
          <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input-luxury" />
        </FormField>
      </div>

      <FormField label="Specifications (JSON)">
        <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} className="input-luxury resize-none font-mono text-xs" rows={5} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Stock">
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury" />
        </FormField>
        <FormField label="Sort Order">
          <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-luxury" />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { key: "is_featured", label: "Featured" },
          { key: "is_best_seller", label: "Best Seller" },
          { key: "is_new_arrival", label: "New Arrival" },
          { key: "is_limited_edition", label: "Limited Edition" },
          { key: "is_active", label: "Active" },
        ].map((flag) => (
          <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form[flag.key as keyof typeof form] as boolean}
              onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
              className="accent-gold-400"
            />
            <span className="text-sm text-ink-300">{flag.label}</span>
          </label>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={16} /> {saving ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}

// ============ CATEGORIES MANAGER ============
function CategoriesManager() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "", sort_order: "0" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setItems(data as Category[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image_url: cat.image_url || "", sort_order: cat.sort_order.toString() });
  };

  const handleSave = async () => {
    const data = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      image_url: form.image_url,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: true,
    };
    if (editing) {
      await supabase.from("categories").update(data).eq("id", editing.id);
    } else {
      await supabase.from("categories").insert(data);
    }
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "", sort_order: "0" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">{editing ? "Edit Category" : "Add Category"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" /></FormField>
        </div>
        <FormField label="Description"><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury" /></FormField>
        <FormField label="Image URL"><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-luxury" /></FormField>
        <FormField label="Sort Order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-luxury" /></FormField>
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: "", slug: "", description: "", image_url: "", sort_order: "0" }); }} className="btn-outline">Cancel</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div className="flex items-center gap-3">
              {cat.image_url && <div className="h-10 w-10 overflow-hidden"><img src={cat.image_url} alt="" className="h-full w-full object-cover" /></div>}
              <div>
                <p className="text-sm text-ink-100">{cat.name}</p>
                <p className="text-xs text-ink-500">/{cat.slug}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(cat)} className="text-ink-400 hover:text-gold-400"><Edit size={16} /></button>
              <button onClick={() => handleDelete(cat.id)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ COLLECTIONS MANAGER ============
function CollectionsManager() {
  const [items, setItems] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "", sort_order: "0" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("collections").select("*").order("sort_order");
    if (data) setItems(data as Collection[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (col: Collection) => {
    setEditing(col);
    setForm({ name: col.name, slug: col.slug, description: col.description || "", image_url: col.image_url || "", sort_order: col.sort_order.toString() });
  };

  const handleSave = async () => {
    const data = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      image_url: form.image_url,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: true,
    };
    if (editing) {
      await supabase.from("collections").update(data).eq("id", editing.id);
    } else {
      await supabase.from("collections").insert(data);
    }
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "", sort_order: "0" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    await supabase.from("collections").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">{editing ? "Edit Collection" : "Add Collection"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" /></FormField>
        </div>
        <FormField label="Description"><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury" /></FormField>
        <FormField label="Image URL"><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-luxury" /></FormField>
        <FormField label="Sort Order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-luxury" /></FormField>
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: "", slug: "", description: "", image_url: "", sort_order: "0" }); }} className="btn-outline">Cancel</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((col) => (
          <div key={col.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div className="flex items-center gap-3">
              {col.image_url && <div className="h-10 w-10 overflow-hidden"><img src={col.image_url} alt="" className="h-full w-full object-cover" /></div>}
              <div>
                <p className="text-sm text-ink-100">{col.name}</p>
                <p className="text-xs text-ink-500">/{col.slug}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(col)} className="text-ink-400 hover:text-gold-400"><Edit size={16} /></button>
              <button onClick={() => handleDelete(col.id)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ORDERS MANAGER ============
function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (selected) {
    return (
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-ink-100">Order {selected.order_number}</h2>
          <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-100"><X size={20} /></button>
        </div>

        <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-500">Status</span>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value)}
              className="bg-ink-800 text-sm text-ink-100 px-3 py-1.5 border border-ink-700"
            >
              {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                <option key={s} value={s} className="bg-ink-900">{s}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-ink-800">
            <InfoBlock label="Customer" value={selected.customer_name} />
            <InfoBlock label="Phone" value={selected.phone} />
            <InfoBlock label="Email" value={selected.email || "N/A"} />
            <InfoBlock label="Date" value={new Date(selected.created_at).toLocaleString()} />
            <InfoBlock label="Address" value={selected.address} />
            <InfoBlock label="City, State" value={`${selected.city}, ${selected.state}`} />
            {selected.notes && <InfoBlock label="Notes" value={selected.notes} />}
          </div>
        </div>

        <div className="border border-ink-800 bg-ink-900 p-6">
          <h3 className="text-sm uppercase tracking-wider text-gold-400 mb-4">Items</h3>
          <div className="space-y-3">
            {selected.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-ink-800 pb-3 last:border-0">
                <div className="h-14 w-12 overflow-hidden bg-ink-800"><img src={item.image} alt="" className="h-full w-full object-cover" /></div>
                <div className="flex-1">
                  <p className="text-sm text-ink-100">{item.name}</p>
                  {item.variant && (item.variant.color || item.variant.size) && (
                    <p className="text-xs text-ink-500">{[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}</p>
                  )}
                  <p className="text-xs text-ink-400">{item.quantity} x {formatNaira(item.price)}</p>
                </div>
                <span className="text-sm text-gold-400">{formatNaira(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-700 flex justify-between">
            <span className="text-sm text-ink-300">Total</span>
            <span className="text-xl text-ink-50">{formatNaira(selected.total)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
              filter === s ? "bg-gold-400 text-ink-900" : "border border-ink-700 text-ink-400 hover:text-ink-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-500 py-8 text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border border-ink-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-800 bg-ink-900">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Order</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Total</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} onClick={() => setSelected(order)} className="border-b border-ink-800 hover:bg-ink-900 cursor-pointer">
                  <td className="px-4 py-3 text-sm text-ink-100">{order.order_number}</td>
                  <td className="px-4 py-3 text-sm text-ink-300">{order.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-gold-400">{formatNaira(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs uppercase ${order.status === "pending" ? "text-yellow-500" : order.status === "delivered" ? "text-green-500" : "text-ink-300"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ TESTIMONIALS MANAGER ============
function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", role: "", content: "", rating: "5", image_url: "" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    if (data) setItems(data as Testimonial[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role || "", content: t.content, rating: t.rating.toString(), image_url: t.image_url || "" });
  };

  const handleSave = async () => {
    const data = {
      name: form.name,
      role: form.role,
      content: form.content,
      rating: parseInt(form.rating) || 5,
      image_url: form.image_url,
      is_active: true,
      sort_order: 0,
    };
    if (editing) {
      await supabase.from("testimonials").update(data).eq("id", editing.id);
    } else {
      await supabase.from("testimonials").insert(data);
    }
    setEditing(null);
    setForm({ name: "", role: "", content: "", rating: "5", image_url: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">{editing ? "Edit Testimonial" : "Add Testimonial"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Role"><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-luxury" /></FormField>
        </div>
        <FormField label="Content"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-luxury resize-none" rows={3} /></FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Rating (1-5)"><input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Image URL"><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-luxury" /></FormField>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: "", role: "", content: "", rating: "5", image_url: "" }); }} className="btn-outline">Cancel</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between border border-ink-800 bg-ink-900 p-4">
            <div>
              <p className="text-sm text-ink-100">{t.name} <span className="text-ink-500">— {t.role}</span></p>
              <p className="text-xs text-ink-400 mt-1 line-clamp-2">"{t.content}"</p>
              <p className="text-xs text-gold-400 mt-1">Rating: {t.rating}/5</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(t)} className="text-ink-400 hover:text-gold-400"><Edit size={16} /></button>
              <button onClick={() => handleDelete(t.id)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ PAGES MANAGER ============
function PagesManager() {
  const [items, setItems] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", content: "{}" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("pages").select("*").order("slug");
    if (data) setItems(data as Page[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (p: Page) => {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title, content: JSON.stringify(p.content, null, 2) });
  };

  const handleSave = async () => {
    let content;
    try { content = JSON.parse(form.content); } catch { content = { body: form.content }; }
    const data = { slug: form.slug, title: form.title, content, is_active: true };
    if (editing) {
      await supabase.from("pages").update(data).eq("id", editing.id);
    } else {
      await supabase.from("pages").insert(data);
    }
    setEditing(null);
    setForm({ slug: "", title: "", content: "{}" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    await supabase.from("pages").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">{editing ? "Edit Page" : "Add Page"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" /></FormField>
        </div>
        <FormField label="Content (JSON)">
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-luxury resize-none font-mono text-xs" rows={10} />
        </FormField>
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ slug: "", title: "", content: "{}" }); }} className="btn-outline">Cancel</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div>
              <p className="text-sm text-ink-100">{p.title}</p>
              <p className="text-xs text-ink-500">/page/{p.slug}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(p)} className="text-ink-400 hover:text-gold-400"><Edit size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ NAV MANAGER ============
function NavManager() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [form, setForm] = useState({ label: "", href: "" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("nav_items").select("*").order("sort_order");
    if (data) setItems(data as NavItem[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.label || !form.href) return;
    await supabase.from("nav_items").insert({
      label: form.label,
      href: form.href,
      sort_order: items.length + 1,
      is_active: true,
    });
    setForm({ label: "", href: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("nav_items").delete().eq("id", id);
    load();
  };

  const toggleActive = async (item: NavItem) => {
    await supabase.from("nav_items").update({ is_active: !item.is_active }).eq("id", item.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">Add Nav Item</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Label"><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-luxury" /></FormField>
          <FormField label="Link"><input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="input-luxury" placeholder="/shop" /></FormField>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> Add</button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div>
              <p className="text-sm text-ink-100">{item.label}</p>
              <p className="text-xs text-ink-500">{item.href}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleActive(item)} className={`text-xs uppercase ${item.is_active ? "text-green-500" : "text-ink-500"}`}>
                {item.is_active ? "Visible" : "Hidden"}
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MEDIA MANAGER ============
function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState("products");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as MediaItem[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!url) return;
    await supabase.from("media").insert({ url, name: name || url.split("/").pop(), folder, type: "image" });
    setUrl(""); setName("");
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("media").delete().eq("id", id);
    load();
  };

  const folders = ["products", "hero", "collections", "gallery", "testimonials", "logos", "banners"];

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">Add Media</h3>
        <FormField label="Image URL"><input value={url} onChange={(e) => setUrl(e.target.value)} className="input-luxury" placeholder="https://..." /></FormField>
        <FormField label="Name (optional)"><input value={name} onChange={(e) => setName(e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Folder">
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="input-luxury">
            {folders.map((f) => <option key={f} value={f} className="bg-ink-900">{f}</option>)}
          </select>
        </FormField>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> Add Media</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider ${folder === f ? "bg-gold-400 text-ink-900" : "border border-ink-700 text-ink-400"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.filter((m) => m.folder === folder).map((m) => (
          <div key={m.id} className="group relative aspect-square overflow-hidden border border-ink-800 bg-ink-900">
            <img src={m.url} alt={m.name || ""} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button onClick={() => handleDelete(m.id)} className="text-red-400"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ SETTINGS MANAGER ============
function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
    });
  }, []);

  const update = (field: keyof SiteSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value as never });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from("site_settings").update({
      announcement_text: settings.announcement_text,
      announcement_active: settings.announcement_active,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_image_url: settings.hero_image_url,
      hero_video_url: settings.hero_video_url,
      hero_cta_text: settings.hero_cta_text,
      hero_cta_link: settings.hero_cta_link,
      brand_name: settings.brand_name,
      tagline: settings.tagline,
      logo_url: settings.logo_url,
      favicon_url: settings.favicon_url,
      footer_about: settings.footer_about,
      footer_copyright: settings.footer_copyright,
      bank_name: settings.bank_name,
      account_name: settings.account_name,
      account_number: settings.account_number,
      whatsapp_number: settings.whatsapp_number,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      twitter_url: settings.twitter_url,
      tiktok_url: settings.tiktok_url,
      instagram_handle: settings.instagram_handle,
      maintenance_mode: settings.maintenance_mode,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    alert("Settings saved successfully.");
  };

  if (!settings) return <p className="text-ink-400">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Announcement */}
      <SettingsGroup title="Announcement Bar" icon={MessageSquare}>
        <FormField label="Announcement Text"><input value={settings.announcement_text || ""} onChange={(e) => update("announcement_text", e.target.value)} className="input-luxury" /></FormField>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.announcement_active} onChange={(e) => update("announcement_active", e.target.checked)} className="accent-gold-400" />
          <span className="text-sm text-ink-300">Show announcement bar</span>
        </label>
      </SettingsGroup>

      {/* Hero */}
      <SettingsGroup title="Hero Section" icon={LayoutDashboard}>
        <FormField label="Hero Title"><input value={settings.hero_title || ""} onChange={(e) => update("hero_title", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Hero Subtitle"><input value={settings.hero_subtitle || ""} onChange={(e) => update("hero_subtitle", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Hero Image URL"><input value={settings.hero_image_url || ""} onChange={(e) => update("hero_image_url", e.target.value)} className="input-luxury" /></FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="CTA Text"><input value={settings.hero_cta_text || ""} onChange={(e) => update("hero_cta_text", e.target.value)} className="input-luxury" /></FormField>
          <FormField label="CTA Link"><input value={settings.hero_cta_link || ""} onChange={(e) => update("hero_cta_link", e.target.value)} className="input-luxury" /></FormField>
        </div>
      </SettingsGroup>

      {/* Brand */}
      <SettingsGroup title="Brand Identity" icon={Palette}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Brand Name"><input value={settings.brand_name || ""} onChange={(e) => update("brand_name", e.target.value)} className="input-luxury" /></FormField>
          <FormField label="Tagline"><input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} className="input-luxury" /></FormField>
        </div>
        <FormField label="Logo URL"><input value={settings.logo_url || ""} onChange={(e) => update("logo_url", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Favicon URL"><input value={settings.favicon_url || ""} onChange={(e) => update("favicon_url", e.target.value)} className="input-luxury" /></FormField>
      </SettingsGroup>

      {/* Bank Details */}
      <SettingsGroup title="Bank Transfer Details" icon={CreditCard}>
        <FormField label="Bank Name"><input value={settings.bank_name || ""} onChange={(e) => update("bank_name", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Account Name"><input value={settings.account_name || ""} onChange={(e) => update("account_name", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Account Number"><input value={settings.account_number || ""} onChange={(e) => update("account_number", e.target.value)} className="input-luxury" /></FormField>
      </SettingsGroup>

      {/* Contact */}
      <SettingsGroup title="Contact Information" icon={Phone}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="WhatsApp Number"><input value={settings.whatsapp_number || ""} onChange={(e) => update("whatsapp_number", e.target.value)} className="input-luxury" placeholder="2348012345678" /></FormField>
          <FormField label="Contact Phone"><input value={settings.contact_phone || ""} onChange={(e) => update("contact_phone", e.target.value)} className="input-luxury" /></FormField>
        </div>
        <FormField label="Contact Email"><input value={settings.contact_email || ""} onChange={(e) => update("contact_email", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Contact Address"><textarea value={settings.contact_address || ""} onChange={(e) => update("contact_address", e.target.value)} className="input-luxury resize-none" rows={2} /></FormField>
      </SettingsGroup>

      {/* Social Media */}
      <SettingsGroup title="Social Media" icon={Globe}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Instagram URL"><input value={settings.instagram_url || ""} onChange={(e) => update("instagram_url", e.target.value)} className="input-luxury" /></FormField>
          <FormField label="Instagram Handle"><input value={settings.instagram_handle || ""} onChange={(e) => update("instagram_handle", e.target.value)} className="input-luxury" /></FormField>
        </div>
        <FormField label="Facebook URL"><input value={settings.facebook_url || ""} onChange={(e) => update("facebook_url", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="Twitter URL"><input value={settings.twitter_url || ""} onChange={(e) => update("twitter_url", e.target.value)} className="input-luxury" /></FormField>
        <FormField label="TikTok URL"><input value={settings.tiktok_url || ""} onChange={(e) => update("tiktok_url", e.target.value)} className="input-luxury" /></FormField>
      </SettingsGroup>

      {/* Footer */}
      <SettingsGroup title="Footer" icon={FileText}>
        <FormField label="Footer About"><textarea value={settings.footer_about || ""} onChange={(e) => update("footer_about", e.target.value)} className="input-luxury resize-none" rows={3} /></FormField>
        <FormField label="Footer Copyright"><input value={settings.footer_copyright || ""} onChange={(e) => update("footer_copyright", e.target.value)} className="input-luxury" /></FormField>
      </SettingsGroup>

      {/* Maintenance */}
      <SettingsGroup title="Maintenance" icon={AlertCircle}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.maintenance_mode} onChange={(e) => update("maintenance_mode", e.target.checked)} className="accent-gold-400" />
          <span className="text-sm text-ink-300">Enable maintenance mode (hides the site from visitors)</span>
        </label>
      </SettingsGroup>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={16} /> {saving ? "Saving..." : "Save All Settings"}
      </button>
    </div>
  );
}

// ============ APPEARANCE MANAGER ============
function AppearanceManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from("site_settings").update({
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      accent_color: settings.accent_color,
      homepage_sections: settings.homepage_sections,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    alert("Appearance saved.");
  };

  if (!settings) return <p className="text-ink-400">Loading...</p>;

  const allSections = [
    { id: "hero", label: "Hero Section" },
    { id: "collections", label: "Collections" },
    { id: "featured-watches", label: "Featured Watches" },
    { id: "featured-fashion", label: "Featured Fashion" },
    { id: "best-sellers", label: "Best Sellers" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "limited-editions", label: "Limited Editions" },
    { id: "brand-story", label: "Brand Story" },
    { id: "why-choose", label: "Why Choose MarWiz" },
    { id: "editorial", label: "Editorial Showcase" },
    { id: "testimonials", label: "Testimonials" },
    { id: "instagram", label: "Instagram Gallery" },
    { id: "whatsapp-cta", label: "WhatsApp CTA" },
    { id: "newsletter", label: "Newsletter" },
  ];

  const toggleSection = (id: string) => {
    const current = settings.homepage_sections || [];
    const exists = current.includes(id);
    const updated = exists ? current.filter((s) => s !== id) : [...current, id];
    setSettings({ ...settings, homepage_sections: updated });
  };

  const moveSection = (id: string, dir: "up" | "down") => {
    const current = [...(settings.homepage_sections || [])];
    const idx = current.indexOf(id);
    if (idx === -1) return;
    if (dir === "up" && idx > 0) {
      [current[idx], current[idx - 1]] = [current[idx - 1], current[idx]];
    } else if (dir === "down" && idx < current.length - 1) {
      [current[idx], current[idx + 1]] = [current[idx + 1], current[idx]];
    }
    setSettings({ ...settings, homepage_sections: current });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <SettingsGroup title="Theme Colours" icon={Palette}>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Primary Colour">
            <div className="flex items-center gap-2">
              <input type="color" value={settings.primary_color || "#0a0a0a"} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="h-10 w-14 bg-transparent border border-ink-700" />
              <input value={settings.primary_color || ""} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="input-luxury" />
            </div>
          </FormField>
          <FormField label="Secondary Colour">
            <div className="flex items-center gap-2">
              <input type="color" value={settings.secondary_color || "#c9a96e"} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="h-10 w-14 bg-transparent border border-ink-700" />
              <input value={settings.secondary_color || ""} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="input-luxury" />
            </div>
          </FormField>
          <FormField label="Accent Colour">
            <div className="flex items-center gap-2">
              <input type="color" value={settings.accent_color || "#1a1a1a"} onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })} className="h-10 w-14 bg-transparent border border-ink-700" />
              <input value={settings.accent_color || ""} onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })} className="input-luxury" />
            </div>
          </FormField>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Homepage Layout Builder" icon={Layers}>
        <p className="text-xs text-ink-500 mb-4">Enable, disable, and reorder homepage sections. Sections appear in the order listed below.</p>
        <div className="space-y-2">
          {allSections.map((section) => {
            const enabled = (settings.homepage_sections || []).includes(section.id);
            const order = (settings.homepage_sections || []).indexOf(section.id);
            return (
              <div key={section.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={enabled} onChange={() => toggleSection(section.id)} className="accent-gold-400" />
                  <span className="text-sm text-ink-200">{section.label}</span>
                  {enabled && <span className="text-xs text-ink-500">Position {order + 1}</span>}
                </div>
                {enabled && (
                  <div className="flex gap-1">
                    <button onClick={() => moveSection(section.id, "up")} className="text-ink-400 hover:text-gold-400 px-2 py-1 text-xs">Up</button>
                    <button onClick={() => moveSection(section.id, "down")} className="text-ink-400 hover:text-gold-400 px-2 py-1 text-xs">Down</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SettingsGroup>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={16} /> {saving ? "Saving..." : "Save Appearance"}
      </button>
    </div>
  );
}

// ============ SEO MANAGER ============
function SEOManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from("site_settings").update({
      meta_title: settings.meta_title,
      meta_description: settings.meta_description,
      meta_keywords: settings.meta_keywords,
      google_analytics_id: settings.google_analytics_id,
      google_search_console: settings.google_search_console,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    alert("SEO settings saved.");
  };

  if (!settings) return <p className="text-ink-400">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <SettingsGroup title="Meta Tags" icon={Globe}>
        <FormField label="Meta Title"><input value={settings.meta_title || ""} onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })} className="input-luxury" /></FormField>
        <FormField label="Meta Description"><textarea value={settings.meta_description || ""} onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })} className="input-luxury resize-none" rows={3} /></FormField>
        <FormField label="Meta Keywords"><input value={settings.meta_keywords || ""} onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })} className="input-luxury" /></FormField>
      </SettingsGroup>

      <SettingsGroup title="Google Integration" icon={Search}>
        <FormField label="Google Analytics ID"><input value={settings.google_analytics_id || ""} onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })} className="input-luxury" placeholder="G-XXXXXXXXXX" /></FormField>
        <FormField label="Google Search Console Verification"><input value={settings.google_search_console || ""} onChange={(e) => setSettings({ ...settings, google_search_console: e.target.value })} className="input-luxury" /></FormField>
      </SettingsGroup>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        <Save size={16} /> {saving ? "Saving..." : "Save SEO Settings"}
      </button>
    </div>
  );
}

// ============ SHARED COMPONENTS ============
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-luxury">{label}</label>
      {children}
    </div>
  );
}

function SettingsGroup({ title, icon: Icon, children }: { title: string; icon: typeof Settings; children: React.ReactNode }) {
  return (
    <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className="text-gold-400" />
        <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-ink-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-ink-500 mb-1">{label}</p>
      <p className="text-sm text-ink-200">{value}</p>
    </div>
  );
}
