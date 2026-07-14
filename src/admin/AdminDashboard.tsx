import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Settings, Image as ImageIcon,
  FileText, Star, Palette, Menu, X, LogOut, Layers, Tag, MessageSquare,
  Phone, Search, CreditCard, Globe, Eye, Plus, Trash2,
  Edit, Save, AlertCircle, Upload,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuth";
import { useStore } from "../store/StoreContext";
import { supabase } from "../lib/supabase";
import { formatNaira } from "../lib/utils";
import { ImageUpload } from "./ImageUpload";
import { MediaPicker } from "./MediaPicker";
import type { Order, Testimonial, Page, NavItem, SiteSettings, MediaItem, Enquiry } from "../types";
import { ProductsManager } from "./ProductsManager";
import { CollectionsManager } from "./CollectionsManager";
import { AboutPageManager } from "./AboutPageManager";
import { MarWizStandardsManager } from "./MarWizStandardsManager";
import { CategoriesManager } from "./CategoriesManager";

type AdminSection =
  | "dashboard"
  | "products"
  | "categories"
  | "collections"
  | "orders"
  | "enquiries"
  | "testimonials"
  | "pages"
  | "nav"
  | "settings"
  | "appearance"
  | "seo"
  | "standards";

export function AdminDashboard() {
  const { signOut } = useAdminAuth();
  const { settings } = useStore();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const menuItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "collections", label: "Collections", icon: Layers },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "testimonials", label: "Testimonials", icon: Star },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "nav", label: "Navigation", icon: Menu },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "standards", label: "Standards", icon: Star },
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
          <div className="p-6 mb-8 text-center flex items-center justify-center">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 object-contain" />
            ) : (
              <h1 className="text-2xl font-serif uppercase tracking-[0.2em] text-ink-50">MARWIZ</h1>
            )}
          </div>
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
          {section === "products" && <ProductsManager showToast={showToast} />}
          {section === "categories" && <CategoriesManager showToast={showToast} />}
          {section === "collections" && <CollectionsManager showToast={showToast} />}
          {section === "orders" && <OrdersManager showToast={showToast} />}
          {section === "enquiries" && <EnquiriesManager />}
          {section === "testimonials" && <TestimonialsManager showToast={showToast} />}
          {section === "pages" && <AboutPageManager showToast={showToast} />}
          {section === "nav" && <NavManager showToast={showToast} />}
          {section === "settings" && <SettingsManager showToast={showToast} />}
          {section === "appearance" && <AppearanceManager showToast={showToast} />}
          {section === "seo" && <SEOManager showToast={showToast} />}
          {section === "standards" && <MarWizStandardsManager showToast={showToast} />}
        </div>
      </main>
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 border border-gold-400/50 bg-ink-950 px-5 py-3 text-sm text-gold-400 font-display shadow-xl shadow-gold-400/10 transition-all duration-300 ease-in-out">
          <span className="text-gold-400 font-bold">✓</span>
          <span>{toast.message}</span>
        </div>
      )}
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


// Modular CategoriesManager imported from CategoriesManager.tsx is used instead.



// ============ ORDERS MANAGER ============
function OrdersManager({ showToast }: { showToast: (msg: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      showToast("✓ Order Status Updated");
      load();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      showToast("✓ Order Deleted");
      load();
      if (selected?.id === id) setSelected(null);
    } catch (err: any) {
      alert("Error deleting order: " + err.message);
    }
  };

  const handlePrintInvoice = () => {
    if (!selected) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const itemsHtml = selected.items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 0; font-size: 14px; color: #1e293b;">
          ${item.name}
          ${item.variant && (item.variant.color || item.variant.size) ? `
            <div style="font-size: 11px; color: #64748b;">
              ${[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
            </div>
          ` : ""}
        </td>
        <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #1e293b;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #1e293b;">₦${Number(item.price).toLocaleString()}</td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 600; color: #1e293b;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${selected.order_number}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: #0f172a;
            }
            .invoice-title {
               font-size: 24px;
               font-weight: 800;
               text-transform: uppercase;
               letter-spacing: 0.05em;
               color: #c9a96e;
            }
            .grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #c9a96e;
              margin-bottom: 8px;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 4px;
            }
            .info-text {
              font-size: 14px;
              line-height: 1.5;
              margin: 0;
              color: #334155;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              border-bottom: 2px solid #0f172a;
              padding: 10px 0;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #64748b;
            }
            .total-section {
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            }
            .total-box {
              width: 300px;
              border-top: 2px solid #0f172a;
              padding-top: 15px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div>
                <div class="logo">MARWIZ</div>
                <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">Luxury Watches & Fine Fashion</p>
              </div>
              <div style="text-align: right;">
                <div class="invoice-title">INVOICE</div>
                <p style="font-size: 14px; font-weight: 600; margin: 4px 0 0 0; color: #0f172a;">${selected.order_number}</p>
                <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Date: ${new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div class="grid">
              <div>
                <div class="section-title">Billed To</div>
                <p class="info-text" style="font-weight: 600;">${selected.customer_name}</p>
                <p class="info-text">${selected.address}</p>
                <p class="info-text">${selected.city}, ${selected.state}</p>
                <p class="info-text">Phone: ${selected.phone}</p>
                ${selected.email ? `<p class="info-text">Email: ${selected.email}</p>` : ""}
              </div>
              <div>
                <div class="section-title">Payment Info</div>
                <p class="info-text" style="font-weight: 600;">Bank Transfer Receipt Required</p>
                <p class="info-text" style="margin-top: 10px; font-size: 12px; color: #64748b;">Please transfer the exact amount to complete shipment confirmation.</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Item Description</th>
                  <th style="text-align: center; width: 80px;">Qty</th>
                  <th style="text-align: right; width: 120px;">Price</th>
                  <th style="text-align: right; width: 120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-box">
                <div class="total-row">
                  <span style="font-size: 14px; color: #64748b;">Subtotal</span>
                  <span style="font-size: 14px; font-weight: 600; color: #1e293b;">₦${Number(selected.subtotal || selected.total).toLocaleString()}</span>
                </div>
                 <div class="total-row" style="margin-bottom: 0; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                  <span style="font-size: 16px; font-weight: 700; color: #0f172a;">Total Amount</span>
                  <span style="font-size: 18px; font-weight: 800; color: #c9a96e;">₦${Number(selected.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            ${selected.notes ? `
              <div style="margin-top: 30px;">
                <div class="section-title">Order Notes</div>
                <p class="info-text" style="font-style: italic;">"${selected.notes}"</p>
              </div>
            ` : ""}

            <div class="footer">
              <p style="margin: 0; font-weight: 600;">Thank you for shopping with MarWiz.</p>
              <p style="margin: 5px 0 0 0; font-size: 10px;">For enquiries, please contact us on WhatsApp via configured business line.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === "all" || o.status === filter;
    const matchesSearch =
      search.trim() === "" ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (selected) {
    return (
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-ink-100 font-display">Order details: {selected.order_number}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-ink-950 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Print Invoice
            </button>
            <button
              onClick={() => deleteOrder(selected.id)}
              className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Delete
            </button>
            <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-100 p-1"><X size={20} /></button>
          </div>
        </div>

        {/* Status manager and verification */}
        <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-ink-500 block mb-1">Update Status</span>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="input-luxury max-w-[200px]"
              >
                {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s} className="bg-ink-900">{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="border border-ink-800 bg-ink-950/40 p-3 flex flex-col justify-center rounded">
              <span className="text-[10px] uppercase tracking-[0.1em] text-gold-400 mb-1">Transfer Verification Receipt</span>
              <p className="text-xs text-ink-300">
                Payment Method: <span className="font-semibold text-ink-200">Bank Transfer</span>
              </p>
              <p className="text-[10px] text-ink-500 mt-1">
                Admin note: Verify fund deposit before transitioning status to "Confirmed"
              </p>
            </div>
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

        {/* Order Items */}
        <div className="border border-ink-800 bg-ink-900 p-6">
          <h3 className="text-sm uppercase tracking-wider text-gold-400 mb-4 font-display">Items</h3>
          <div className="space-y-3">
            {selected.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-ink-800 pb-3 last:border-0">
                <div className="h-14 w-12 overflow-hidden bg-ink-800">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-ink-950 border border-ink-800 flex items-center justify-center text-[8px] text-ink-500 font-mono">NO IMG</div>
                  )}
                </div>
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
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border ${
                filter === s
                  ? "bg-gold-400 text-ink-900 border-gold-400"
                  : "border-ink-800 text-ink-400 hover:text-gold-400 hover:border-gold-400/40 bg-ink-950/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, order #..."
          className="input-luxury max-w-xs text-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-500 py-12 text-center font-mono">No orders matching the filters found.</p>
      ) : (
        <div className="overflow-x-auto border border-ink-800 bg-ink-900/30">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-800 bg-ink-900">
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500 font-display">Order</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500 font-display">Customer</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500 font-display">Total</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500 font-display">Status</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-ink-500 font-display">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} onClick={() => setSelected(order)} className="border-b border-ink-800 hover:bg-ink-900/50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 text-sm text-ink-100 font-semibold">{order.order_number}</td>
                  <td className="px-4 py-3 text-sm text-ink-300">{order.customer_name}</td>
                  <td className="px-4 py-3 text-sm text-gold-400 font-semibold">{formatNaira(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                      order.status === "pending"
                        ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
                        : order.status === "delivered"
                        ? "border-green-500/20 bg-green-500/5 text-green-400"
                        : order.status === "cancelled"
                        ? "border-red-500/20 bg-red-500/5 text-red-400"
                        : "border-gold-400/20 bg-gold-400/5 text-gold-400"
                    }`}>
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
function TestimonialsManager({ showToast }: { showToast: (msg: string) => void }) {
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
    try {
      if (editing) {
        const { error } = await supabase.from("testimonials").update(data).eq("id", editing.id);
        if (error) throw error;
        showToast("✓ Saved Successfully");
      } else {
        const { error } = await supabase.from("testimonials").insert(data);
        if (error) throw error;
        showToast("✓ Testimonial Created Successfully");
      }
      setEditing(null);
      setForm({ name: "", role: "", content: "", rating: "5", image_url: "" });
      load();
    } catch (err: any) {
      alert("Error saving testimonial: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      showToast("Testimonial deleted successfully.");
      load();
    } catch (err: any) {
      alert("Error deleting testimonial: " + err.message);
    }
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
          <FormField label="Rating (1-5)">
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-luxury">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n} className="bg-ink-900">{n} Stars</option>)}
            </select>
          </FormField>
          
          <div className="sm:col-span-2">
            <ImageUpload
              bucket="testimonials"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              label="Customer Photo"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save</button>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: "", role: "", content: "", rating: "5", image_url: "" }); }} className="btn-outline">Cancel</button>}
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between border border-ink-800 bg-ink-900 p-4">
            <div className="flex items-center gap-3">
              {t.image_url && <div className="h-10 w-10 overflow-hidden rounded-full border border-gold-400/20"><img src={t.image_url} alt="" className="h-full w-full object-cover" /></div>}
              <div>
                <p className="text-sm text-ink-100">{t.name} <span className="text-ink-500">— {t.role}</span></p>
                <p className="text-xs text-ink-400 mt-1">"{t.content}"</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-gold-400 text-xs">★</span>
                  ))}
                </div>
              </div>
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
export function PagesManager({ showToast }: { showToast: (msg: string) => void }) {
  const [items, setItems] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);

  // Custom states for each editor type
  const [aboutForm, setAboutForm] = useState({
    heading: "",
    title: "",
    subtitle: "",
    description: "",
    company_story: "",
    main_image: "",
    brand_story_image: "",
    gallery_images: [] as string[],
    stat_years: "",
    stat_customers: "",
    stat_products: "",
    stat_orders: "",
    mission_title: "",
    mission_desc: "",
    vision_title: "",
    vision_desc: "",
    values: [] as { title: string; desc: string }[],
    team: [] as { name: string; position: string; photo: string; bio: string }[],
    cta_title: "",
    cta_desc: "",
    cta_btn_text: "",
    cta_btn_link: "",
    cta_bg_image: "",
  });
  const [aboutActiveTab, setAboutActiveTab] = useState("general");

  const addAboutValue = () => {
    setAboutForm(prev => ({
      ...prev,
      values: [...(prev.values || []), { title: "New Value", desc: "Description of the value" }]
    }));
  };

  const updateAboutValue = (index: number, field: "title" | "desc", value: string) => {
    setAboutForm(prev => {
      const copy = [...(prev.values || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, values: copy };
    });
  };

  const removeAboutValue = (index: number) => {
    setAboutForm(prev => ({
      ...prev,
      values: (prev.values || []).filter((_, i) => i !== index)
    }));
  };

  const addAboutTeamMember = () => {
    setAboutForm(prev => ({
      ...prev,
      team: [...(prev.team || []), { name: "New Member", position: "Role", photo: "", bio: "" }]
    }));
  };

  const updateAboutTeamMember = (index: number, field: "name" | "position" | "photo" | "bio", value: string) => {
    setAboutForm(prev => {
      const copy = [...(prev.team || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, team: copy };
    });
  };

  const removeAboutTeamMember = (index: number) => {
    setAboutForm(prev => ({
      ...prev,
      team: (prev.team || []).filter((_, i) => i !== index)
    }));
  };

  const addAboutGalleryImage = (url: string) => {
    if (!url) return;
    setAboutForm(prev => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), url]
    }));
  };

  const removeAboutGalleryImage = (index: number) => {
    setAboutForm(prev => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, i) => i !== index)
    }));
  };

  const [contactForm, setContactForm] = useState({ heading: "", body: "", email: "", phone: "", whatsapp: "", address: "", hours: "", google_map: "", hero_image: "", background_image: "" });
  const [faqsForm, setFaqsForm] = useState<{ heading: string; items: { q: string; a: string }[] }>({ heading: "", items: [] });
  const [policyForm, setPolicyForm] = useState({ heading: "", body: "" });

  const load = useCallback(async () => {
    const { data } = await supabase.from("pages").select("*").order("slug");
    if (data) setItems(data as Page[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (p: Page) => {
    setEditing(p);
    const c = (p.content || {}) as any;
    if (p.slug === "about") {
      setAboutForm({
        heading: c.heading || "",
        title: c.title || "",
        subtitle: c.subtitle || "",
        description: c.description || "",
        company_story: c.company_story || "",
        main_image: c.main_image || "",
        brand_story_image: c.brand_story_image || "",
        gallery_images: c.gallery_images || [],
        stat_years: c.stat_years || "",
        stat_customers: c.stat_customers || "",
        stat_products: c.stat_products || "",
        stat_orders: c.stat_orders || "",
        mission_title: c.mission_title || "",
        mission_desc: c.mission_desc || "",
        vision_title: c.vision_title || "",
        vision_desc: c.vision_desc || "",
        values: c.values || [],
        team: c.team || [],
        cta_title: c.cta_title || "",
        cta_desc: c.cta_desc || "",
        cta_btn_text: c.cta_btn_text || "",
        cta_btn_link: c.cta_btn_link || "",
        cta_bg_image: c.cta_bg_image || "",
      });
    } else if (p.slug === "contact") {
      setContactForm({
        heading: c.heading || "",
        body: c.body || "",
        email: c.email || "",
        phone: c.phone || "",
        whatsapp: c.whatsapp || "",
        address: c.address || "",
        hours: c.hours || "",
        google_map: c.google_map || "",
        hero_image: c.hero_image || "",
        background_image: c.background_image || "",
      });
    } else if (p.slug === "faqs") {
      setFaqsForm({
        heading: c.heading || "",
        items: c.items || [],
      });
    } else {
      setPolicyForm({
        heading: c.heading || "",
        body: c.body || "",
      });
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    let newContent = {};
    if (editing.slug === "about") {
      newContent = aboutForm;
    } else if (editing.slug === "contact") {
      newContent = contactForm;
    } else if (editing.slug === "faqs") {
      newContent = faqsForm;
    } else {
      newContent = policyForm;
    }

    try {
      const { error } = await supabase
        .from("pages")
        .update({ content: newContent })
        .eq("id", editing.id);

      if (error) throw error;
      showToast("✓ Saved Successfully");
      setEditing(null);
      load();
    } catch (err: any) {
      alert("Error saving page: " + err.message);
    }
  };

  const addFaqItem = () => {
    setFaqsForm((prev) => ({
      ...prev,
      items: [...prev.items, { q: "New Question", a: "New Answer" }],
    }));
  };

  const updateFaqItem = (index: number, field: "q" | "a", val: string) => {
    setFaqsForm((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const removeFaqItem = (index: number) => {
    setFaqsForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveFaqItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqsForm.items.length) return;
    setFaqsForm((prev) => {
      const updated = [...prev.items];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, items: updated };
    });
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink-50">Edit Page: {editing.title}</h2>
            <p className="text-xs text-ink-400">/page/{editing.slug}</p>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="btn-outline text-xs py-1.5 px-3"
          >
            Back to Pages
          </button>
        </div>

        <div className="border border-ink-800 bg-ink-900 p-6 space-y-6">
          {editing.slug === "about" && (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-ink-800 pb-4">
                {[
                  { id: "general", label: "General Content" },
                  { id: "media", label: "Media & Gallery" },
                  { id: "stats", label: "Key Stats" },
                  { id: "mission", label: "Mission & Vision" },
                  { id: "values", label: "Core Values" },
                  { id: "team", label: "Team Profiles" },
                  { id: "cta", label: "CTA Banner" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAboutActiveTab(tab.id)}
                    className={`px-4 py-2 text-xs font-display uppercase tracking-wider transition-all duration-200 border ${
                      aboutActiveTab === tab.id
                        ? "border-gold-400 bg-gold-400/10 text-gold-400 font-medium"
                        : "border-ink-800 bg-ink-950 text-ink-400 hover:text-ink-100 hover:border-ink-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* General Tab */}
              {aboutActiveTab === "general" && (
                <div className="space-y-5">
                  <FormField label="About Page Hero Heading"><input value={aboutForm.heading || ""} onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })} className="input-luxury" /></FormField>
                  <FormField label="Section Title"><input value={aboutForm.title || ""} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} className="input-luxury" /></FormField>
                  <FormField label="Section Subtitle (Intro)"><input value={aboutForm.subtitle || ""} onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })} className="input-luxury" /></FormField>
                  <FormField label="Core Description"><textarea value={aboutForm.description || ""} onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })} className="input-luxury resize-none" rows={4} /></FormField>
                  <FormField label="Detailed Company Story"><textarea value={aboutForm.company_story || ""} onChange={(e) => setAboutForm({ ...aboutForm, company_story: e.target.value })} className="input-luxury resize-none" rows={5} /></FormField>
                </div>
              )}

              {/* Media & Gallery Tab */}
              {aboutActiveTab === "media" && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField label="Main Presentation Image">
                      <MediaPicker
                        bucket="pages"
                        value={aboutForm.main_image || ""}
                        onChange={(url) => setAboutForm({ ...aboutForm, main_image: url })}
                        label="Select Main Image"
                      />
                    </FormField>
                    <FormField label="Brand Story Section Image">
                      <MediaPicker
                        bucket="pages"
                        value={aboutForm.brand_story_image || ""}
                        onChange={(url) => setAboutForm({ ...aboutForm, brand_story_image: url })}
                        label="Select Brand Story Image"
                      />
                    </FormField>
                  </div>
                  
                  <div className="border border-ink-800 bg-ink-950 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-display text-gold-400 uppercase tracking-wider">Additional Gallery Images</h3>
                      <div className="flex items-center gap-2">
                        <MediaPicker
                          bucket="gallery"
                          value=""
                          onChange={(url) => addAboutGalleryImage(url)}
                          label="Add to Gallery"
                        />
                      </div>
                    </div>
                    {aboutForm.gallery_images && aboutForm.gallery_images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {aboutForm.gallery_images.map((img, idx) => (
                          <div key={idx} className="relative group border border-ink-800 aspect-square overflow-hidden bg-ink-900">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <button
                              type="button"
                              onClick={() => removeAboutGalleryImage(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ink-500 italic">No additional gallery images loaded. Use the picker above to add.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Key Stats Tab */}
              {aboutActiveTab === "stats" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Years in Business Label/Val"><input value={aboutForm.stat_years || ""} onChange={(e) => setAboutForm({ ...aboutForm, stat_years: e.target.value })} className="input-luxury" placeholder="e.g. 12+" /></FormField>
                  <FormField label="Happy Customers Label/Val"><input value={aboutForm.stat_customers || ""} onChange={(e) => setAboutForm({ ...aboutForm, stat_customers: e.target.value })} className="input-luxury" placeholder="e.g. 5,000+" /></FormField>
                  <FormField label="Active Products Label/Val"><input value={aboutForm.stat_products || ""} onChange={(e) => setAboutForm({ ...aboutForm, stat_products: e.target.value })} className="input-luxury" placeholder="e.g. 150+" /></FormField>
                  <FormField label="Orders Delivered Label/Val"><input value={aboutForm.stat_orders || ""} onChange={(e) => setAboutForm({ ...aboutForm, stat_orders: e.target.value })} className="input-luxury" placeholder="e.g. 10,000+" /></FormField>
                </div>
              )}

              {/* Mission & Vision Tab */}
              {aboutActiveTab === "mission" && (
                <div className="space-y-5">
                  <div className="border border-ink-800 bg-ink-950 p-5 space-y-4">
                    <FormField label="Mission Section Title"><input value={aboutForm.mission_title || ""} onChange={(e) => setAboutForm({ ...aboutForm, mission_title: e.target.value })} className="input-luxury" /></FormField>
                    <FormField label="Mission Statement Description"><textarea value={aboutForm.mission_desc || ""} onChange={(e) => setAboutForm({ ...aboutForm, mission_desc: e.target.value })} className="input-luxury resize-none" rows={3} /></FormField>
                  </div>
                  <div className="border border-ink-800 bg-ink-950 p-5 space-y-4">
                    <FormField label="Vision Section Title"><input value={aboutForm.vision_title || ""} onChange={(e) => setAboutForm({ ...aboutForm, vision_title: e.target.value })} className="input-luxury" /></FormField>
                    <FormField label="Vision Statement Description"><textarea value={aboutForm.vision_desc || ""} onChange={(e) => setAboutForm({ ...aboutForm, vision_desc: e.target.value })} className="input-luxury resize-none" rows={3} /></FormField>
                  </div>
                </div>
              )}

              {/* Core Values Tab */}
              {aboutActiveTab === "values" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display text-gold-400 uppercase tracking-wider">Manage Brand Core Values</h3>
                    <button type="button" onClick={addAboutValue} className="btn-outline text-xs flex items-center gap-1.5 py-1.5 px-3">
                      <Plus size={14} /> Add Value Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(aboutForm.values || []).map((val, idx) => (
                      <div key={idx} className="border border-ink-800 bg-ink-950 p-4 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => removeAboutValue(idx)}
                          className="absolute top-4 right-4 text-ink-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="sm:col-span-1">
                            <FormField label="Value Title">
                              <input
                                value={val.title}
                                onChange={(e) => updateAboutValue(idx, "title", e.target.value)}
                                className="input-luxury"
                              />
                            </FormField>
                          </div>
                          <div className="sm:col-span-2">
                            <FormField label="Value Short Description">
                              <input
                                value={val.desc}
                                onChange={(e) => updateAboutValue(idx, "desc", e.target.value)}
                                className="input-luxury"
                              />
                            </FormField>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(aboutForm.values || []).length === 0 && (
                      <p className="text-xs text-ink-500 italic text-center py-6">No brand core values defined yet. Click Add Value Card to get started.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Team Profiles Tab */}
              {aboutActiveTab === "team" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display text-gold-400 uppercase tracking-wider">Manage Team Profiles</h3>
                    <button type="button" onClick={addAboutTeamMember} className="btn-outline text-xs flex items-center gap-1.5 py-1.5 px-3">
                      <Plus size={14} /> Add Team Profile
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(aboutForm.team || []).map((member, idx) => (
                      <div key={idx} className="border border-ink-800 bg-ink-950 p-5 space-y-4 relative group">
                        <button
                          type="button"
                          onClick={() => removeAboutTeamMember(idx)}
                          className="absolute top-5 right-5 text-ink-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid gap-5 md:grid-cols-4">
                          <div className="md:col-span-1">
                            <FormField label="Photo Image">
                              <MediaPicker
                                bucket="testimonials"
                                value={member.photo}
                                onChange={(url) => updateAboutTeamMember(idx, "photo", url)}
                                label="Select Photo"
                              />
                            </FormField>
                          </div>
                          <div className="md:col-span-3 space-y-3">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <FormField label="Full Name">
                                <input
                                  value={member.name}
                                  onChange={(e) => updateAboutTeamMember(idx, "name", e.target.value)}
                                  className="input-luxury"
                                />
                              </FormField>
                              <FormField label="Position / Role">
                                <input
                                  value={member.position}
                                  onChange={(e) => updateAboutTeamMember(idx, "position", e.target.value)}
                                  className="input-luxury"
                                />
                              </FormField>
                            </div>
                            <FormField label="Short Biography / Bio">
                              <textarea
                                value={member.bio}
                                onChange={(e) => updateAboutTeamMember(idx, "bio", e.target.value)}
                                className="input-luxury resize-none"
                                rows={2}
                              />
                            </FormField>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(aboutForm.team || []).length === 0 && (
                      <p className="text-xs text-ink-500 italic text-center py-6">No team members defined yet. Click Add Team Profile to get started.</p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA Section Tab */}
              {aboutActiveTab === "cta" && (
                <div className="space-y-5">
                  <FormField label="CTA Banner Title"><input value={aboutForm.cta_title || ""} onChange={(e) => setAboutForm({ ...aboutForm, cta_title: e.target.value })} className="input-luxury" /></FormField>
                  <FormField label="CTA Description text"><textarea value={aboutForm.cta_desc || ""} onChange={(e) => setAboutForm({ ...aboutForm, cta_desc: e.target.value })} className="input-luxury resize-none" rows={2} /></FormField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="CTA Button Label"><input value={aboutForm.cta_btn_text || ""} onChange={(e) => setAboutForm({ ...aboutForm, cta_btn_text: e.target.value })} className="input-luxury" /></FormField>
                    <FormField label="CTA Redirect Link"><input value={aboutForm.cta_btn_link || ""} onChange={(e) => setAboutForm({ ...aboutForm, cta_btn_link: e.target.value })} className="input-luxury" /></FormField>
                  </div>
                  <FormField label="CTA Background Media Banner">
                    <MediaPicker
                      bucket="banners"
                      value={aboutForm.cta_bg_image || ""}
                      onChange={(url) => setAboutForm({ ...aboutForm, cta_bg_image: url })}
                      label="Select CTA Background"
                    />
                  </FormField>
                </div>
              )}
            </div>
          )}

          {editing.slug === "contact" && (
            <div className="space-y-5">
              <FormField label="Contact Heading">
                <input
                  value={contactForm.heading}
                  onChange={(e) => setContactForm({ ...contactForm, heading: e.target.value })}
                  className="input-luxury"
                />
              </FormField>
              <FormField label="Contact Body text">
                <textarea
                  value={contactForm.body}
                  onChange={(e) => setContactForm({ ...contactForm, body: e.target.value })}
                  className="input-luxury resize-none"
                  rows={3}
                />
              </FormField>
              <div className="grid gap-5 sm:grid-cols-3">
                <FormField label="Concierge Email">
                  <input
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="input-luxury"
                  />
                </FormField>
                <FormField label="Concierge Phone">
                  <input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="input-luxury"
                  />
                </FormField>
                <FormField label="WhatsApp Line">
                  <input
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                    className="input-luxury"
                  />
                </FormField>
              </div>
              <FormField label="Showroom Address">
                <input
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="input-luxury"
                />
              </FormField>
              <FormField label="Business Hours">
                <input
                  value={contactForm.hours}
                  onChange={(e) => setContactForm({ ...contactForm, hours: e.target.value })}
                  className="input-luxury"
                />
              </FormField>
              <FormField label="Google Map Embed / Share URL">
                <input
                  value={contactForm.google_map}
                  onChange={(e) => setContactForm({ ...contactForm, google_map: e.target.value })}
                  className="input-luxury"
                  placeholder="https://maps.google.com/..."
                />
              </FormField>
              <div className="grid gap-5 sm:grid-cols-2">
                <ImageUpload
                  bucket="pages"
                  value={contactForm.hero_image}
                  onChange={(url) => setContactForm({ ...contactForm, hero_image: url })}
                  label="Contact Hero Banner Image"
                />
                <ImageUpload
                  bucket="pages"
                  value={contactForm.background_image}
                  onChange={(url) => setContactForm({ ...contactForm, background_image: url })}
                  label="Contact Section Background"
                />
              </div>
            </div>
          )}

          {editing.slug === "faqs" && (
            <div className="space-y-5">
              <FormField label="FAQs Heading">
                <input
                  value={faqsForm.heading}
                  onChange={(e) => setFaqsForm({ ...faqsForm, heading: e.target.value })}
                  className="input-luxury"
                />
              </FormField>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-ink-800 pb-2">
                  <label className="label-luxury">Frequently Asked Questions list</label>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="text-xs text-gold-400 hover:underline"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {faqsForm.items.map((item, idx) => (
                    <div key={idx} className="border border-ink-800 bg-ink-950/50 p-4 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Item #{idx + 1}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveFaqItem(idx, "up")}
                            className="text-xs text-ink-400 hover:text-gold-400 disabled:opacity-30"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            disabled={idx === faqsForm.items.length - 1}
                            onClick={() => moveFaqItem(idx, "down")}
                            className="text-xs text-ink-400 hover:text-gold-400 disabled:opacity-30"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFaqItem(idx)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <input
                        value={item.q}
                        onChange={(e) => updateFaqItem(idx, "q", e.target.value)}
                        className="input-luxury text-sm"
                        placeholder="Question"
                      />
                      <textarea
                        value={item.a}
                        onChange={(e) => updateFaqItem(idx, "a", e.target.value)}
                        className="input-luxury resize-none text-sm"
                        rows={2}
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!["about", "contact", "faqs"].includes(editing.slug) && (
            <div className="space-y-5">
              <FormField label="Policy Heading">
                <input
                  value={policyForm.heading}
                  onChange={(e) => setPolicyForm({ ...policyForm, heading: e.target.value })}
                  className="input-luxury"
                />
              </FormField>
              <FormField label="Policy Body content">
                <textarea
                  value={policyForm.body}
                  onChange={(e) => setPolicyForm({ ...policyForm, body: e.target.value })}
                  className="input-luxury resize-none"
                  rows={15}
                />
              </FormField>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary">
              <Save size={16} /> Save Changes
            </button>
            <button onClick={() => setEditing(null)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div>
              <p className="text-sm text-ink-100">{p.title}</p>
              <p className="text-xs text-ink-500">/page/{p.slug}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(p)} className="text-ink-400 hover:text-gold-400 flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold border border-ink-800 px-3 py-1.5 bg-ink-950/40"><Edit size={12} /> Edit Page Content</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ NAV MANAGER ============
function NavManager({ showToast }: { showToast: (msg: string) => void }) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [form, setForm] = useState({ label: "", href: "", type: "custom", targetSlug: "" });
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [collections, setCollections] = useState<{ name: string; slug: string }[]>([]);
  const [pages, setPages] = useState<{ title: string; slug: string }[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase.from("nav_items").select("*").order("sort_order");
    if (data) setItems(data as NavItem[]);

    // Load helper options
    const { data: cats } = await supabase.from("categories").select("name, slug");
    if (cats) setCategories(cats);

    const { data: cols } = await supabase.from("collections").select("name, slug");
    if (cols) setCollections(cols);

    const { data: pgs } = await supabase.from("pages").select("title, slug");
    if (pgs) setPages(pgs);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleLinkTypeChange = (type: string) => {
    setForm((prev) => {
      let href = "";
      if (type === "custom") href = "";
      return { ...prev, type, targetSlug: "", href };
    });
  };

  const handleTargetSlugChange = (slug: string) => {
    setForm((prev) => {
      let href = "";
      if (prev.type === "page") href = `/page/${slug}`;
      else if (prev.type === "collection") href = `/collection/${slug}`;
      else if (prev.type === "category") href = `/category/${slug}`;
      return { ...prev, targetSlug: slug, href };
    });
  };

  const handleAdd = async () => {
    if (!form.label || !form.href) {
      alert("Please enter a label and select/enter a valid link destination.");
      return;
    }
    try {
      const { error } = await supabase.from("nav_items").insert({
        label: form.label,
        href: form.href,
        sort_order: items.length > 0 ? Math.max(...items.map(i => i.sort_order || 0)) + 1 : 1,
        is_active: true,
      });
      if (error) throw error;
      showToast("✓ Navigation Item Added");
      setForm({ label: "", href: "", type: "custom", targetSlug: "" });
      load();
    } catch (err: any) {
      alert("Error adding item: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation item?")) return;
    try {
      const { error } = await supabase.from("nav_items").delete().eq("id", id);
      if (error) throw error;
      showToast("Item deleted");
      load();
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  const toggleActive = async (item: NavItem) => {
    try {
      const { error } = await supabase.from("nav_items").update({ is_active: !item.is_active }).eq("id", item.id);
      if (error) throw error;
      showToast(item.is_active ? "Item Hidden" : "Item Visible");
      load();
    } catch (err: any) {
      alert("Error updating item: " + err.message);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    try {
      // Swap sort_order
      const { error: err1 } = await supabase
        .from("nav_items")
        .update({ sort_order: targetItem.sort_order })
        .eq("id", currentItem.id);

      const { error: err2 } = await supabase
        .from("nav_items")
        .update({ sort_order: currentItem.sort_order })
        .eq("id", targetItem.id);

      if (err1 || err2) throw (err1 || err2);

      showToast("✓ Menu Order Updated");
      load();
    } catch (err: any) {
      alert("Error updating order: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-gold-400">Add Menu Link</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Menu Label">
            <input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="input-luxury"
              placeholder="e.g., Shop Watches, About Us"
            />
          </FormField>

          <FormField label="Link Destination Type">
            <select
              value={form.type}
              onChange={(e) => handleLinkTypeChange(e.target.value)}
              className="input-luxury"
            >
              <option value="custom" className="bg-ink-900">Custom URL / Anchor</option>
              <option value="page" className="bg-ink-900">Static Page</option>
              <option value="collection" className="bg-ink-900">Shop Collection</option>
              <option value="category" className="bg-ink-900">Product Category</option>
            </select>
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {form.type === "custom" && (
            <FormField label="Custom URL">
              <input
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                className="input-luxury"
                placeholder="e.g. /shop, #featured, or absolute https://"
              />
            </FormField>
          )}

          {form.type === "page" && (
            <FormField label="Select Page">
              <select
                value={form.targetSlug}
                onChange={(e) => handleTargetSlugChange(e.target.value)}
                className="input-luxury"
              >
                <option value="" className="bg-ink-900">-- Choose a page --</option>
                {pages.map((p) => (
                  <option key={p.slug} value={p.slug} className="bg-ink-900">{p.title}</option>
                ))}
              </select>
            </FormField>
          )}

          {form.type === "collection" && (
            <FormField label="Select Collection">
              <select
                value={form.targetSlug}
                onChange={(e) => handleTargetSlugChange(e.target.value)}
                className="input-luxury"
              >
                <option value="" className="bg-ink-900">-- Choose a collection --</option>
                {collections.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-ink-900">{c.name}</option>
                ))}
              </select>
            </FormField>
          )}

          {form.type === "category" && (
            <FormField label="Select Category">
              <select
                value={form.targetSlug}
                onChange={(e) => handleTargetSlugChange(e.target.value)}
                className="input-luxury"
              >
                <option value="" className="bg-ink-900">-- Choose a category --</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="bg-ink-900">{cat.name}</option>
                ))}
              </select>
            </FormField>
          )}
        </div>

        {form.href && (
          <div className="text-xs text-gold-400/80 bg-ink-950/40 p-2 border border-ink-800/40 font-mono">
            Generated URL: {form.href}
          </div>
        )}

        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> Add Link Item
        </button>
      </div>

      <div className="space-y-2">
        <label className="label-luxury">Menu Link Items (Order defines layout order)</label>
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-4">
            <div>
              <p className="text-sm font-medium text-ink-100">{item.label}</p>
              <p className="text-xs text-ink-500 font-mono">{item.href}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 border-r border-ink-800/60 pr-3 mr-1">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-ink-400 hover:text-gold-400 disabled:opacity-20 font-semibold"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === items.length - 1}
                  className="p-1 text-ink-400 hover:text-gold-400 disabled:opacity-20 font-semibold"
                  title="Move Down"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => toggleActive(item)}
                className={`text-xs uppercase tracking-wider font-semibold border px-2.5 py-1 ${
                  item.is_active
                    ? "border-green-500/20 bg-green-500/5 text-green-400"
                    : "border-ink-800 bg-ink-950 text-ink-500"
                }`}
              >
                {item.is_active ? "Visible" : "Hidden"}
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-ink-400 hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MEDIA MANAGER ============
export function MediaManager({ showToast }: { showToast: (msg: string) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState("gallery");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as MediaItem[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUploadFiles = async (files: FileList) => {
    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const cleanName = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${cleanName}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // Upload to "gallery" bucket
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);

        // Detect file type
        let fileType = "image";
        if (file.type.startsWith("video/")) fileType = "video";
        else if (file.type.startsWith("audio/")) fileType = "audio";
        else if (file.type.includes("pdf") || file.type.includes("doc") || file.type.includes("xls") || file.type.includes("ppt")) fileType = "document";

        // Insert metadata in media table
        await supabase.from("media").insert({
          url: data.publicUrl,
          name: file.name,
          folder,
          type: fileType,
        });
      });

      await Promise.all(uploadPromises);
      showToast("✓ Files Uploaded Successfully");
      load();
    } catch (err: any) {
      alert("Error uploading media: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete this file: "${item.name}"?`)) return;
    try {
      // Delete from storage if it belongs to our bucket
      if (item.url.includes("/storage/v1/object/public/gallery/")) {
        const filePath = item.url.split("/public/gallery/")[1];
        if (filePath) {
          await supabase.storage.from("gallery").remove([filePath]);
        }
      }

      await supabase.from("media").delete().eq("id", item.id);
      showToast("File deleted successfully");
      load();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast("✓ Copied Public URL to Clipboard");
  };

  const startRename = (item: MediaItem) => {
    setRenamingId(item.id);
    setRenameValue(item.name || "");
  };

  const handleRenameSave = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      const { error } = await supabase.from("media").update({ name: renameValue.trim() }).eq("id", id);
      if (error) throw error;
      showToast("✓ Name Updated");
      setRenamingId(null);
      load();
    } catch (err: any) {
      alert("Error renaming: " + err.message);
    }
  };

  const folders = ["products", "hero", "collections", "gallery", "testimonials", "logos", "banners"];

  const filteredItems = items.filter(
    (m) => m.folder === folder && (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const renderFilePreview = (item: MediaItem) => {
    if (item.type === "image") {
      return <img src={item.url} alt="" className="h-full w-full object-cover" />;
    }
    
    let label = "DOC";
    let color = "text-blue-400";
    if (item.type === "video") { label = "VIDEO"; color = "text-purple-400"; }
    else if (item.type === "audio") { label = "AUDIO"; color = "text-green-400"; }
    
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-ink-950 p-4 border border-ink-800">
        <span className={`text-2xl font-bold tracking-wider ${color}`}>{label}</span>
        <span className="text-[10px] text-ink-400 mt-2 truncate w-full text-center">{item.name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Folder filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 flex-wrap">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold border ${
                folder === f
                  ? "bg-gold-400 text-ink-900 border-gold-400"
                  : "border-ink-800 text-ink-400 hover:text-gold-400 hover:border-gold-400/40 bg-ink-950/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files..."
          className="input-luxury max-w-xs text-xs"
        />
      </div>

      {/* Upload dropzone area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? "border-gold-400 bg-gold-400/5"
            : "border-ink-800 hover:border-gold-400/50 bg-ink-900/30"
        } relative`}
      >
        <input
          type="file"
          id="media-uploader-input"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
        />
        <label
          htmlFor="media-uploader-input"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="h-10 w-10 rounded-full border border-ink-800 flex items-center justify-center text-ink-400 bg-ink-950">
            <Upload size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-200">
              {uploading ? "Uploading files..." : "Drag & Drop files here, or click to browse"}
            </p>
            <p className="text-xs text-ink-500 mt-1">
              Supports JPG, PNG, WEBP, AVIF, SVG, MP4, MP3, PDF, DOCX (Uploading to /{folder})
            </p>
          </div>
        </label>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((m) => (
          <div
            key={m.id}
            className="group relative aspect-square overflow-hidden border border-ink-800 bg-ink-900 flex flex-col justify-end"
          >
            <div className="h-full w-full">{renderFilePreview(m)}</div>

            {/* Quick action controls overlay */}
            <div className="absolute inset-0 bg-ink-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleCopyLink(m.url)}
                  className="p-1.5 bg-ink-900 border border-ink-800 text-gold-400 hover:bg-gold-400 hover:text-ink-900 rounded"
                  title="Copy Public URL"
                >
                  Link
                </button>
                <button
                  onClick={() => startRename(m)}
                  className="p-1.5 bg-ink-900 border border-ink-800 text-ink-200 hover:bg-ink-800 rounded text-xs"
                  title="Rename File"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="p-1.5 bg-ink-900 border border-ink-800 text-red-400 hover:bg-red-950/50 rounded"
                  title="Delete File"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {renamingId === m.id ? (
                <div className="space-y-2 bg-ink-950 p-2 border border-ink-800 rounded">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="input-luxury py-1 px-2 text-[10px] w-full"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setRenamingId(null)}
                      className="text-[10px] text-ink-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRenameSave(m.id)}
                      className="text-[10px] text-gold-400 font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-ink-300 font-mono truncate bg-ink-950/90 py-1 px-1.5 border-t border-ink-800">
                  {m.name}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-ink-500 font-mono">
            No media files found in folder: /{folder}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ SETTINGS MANAGER ============
function SettingsManager({ showToast }: { showToast: (msg: string) => void }) {
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
    try {
      const { error } = await supabase.from("site_settings").update({
        announcement_text: settings.announcement_text,
        announcement_active: settings.announcement_active,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_background_media: settings.hero_background_media,
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
        brand_story_image_url: settings.brand_story_image_url,
        whatsapp_cta_image_url: settings.whatsapp_cta_image_url,
        default_placeholder_url: settings.default_placeholder_url,
        default_product_url: settings.default_product_url,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
      
      if (error) throw error;
      showToast("✓ Settings Saved Successfully");
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
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
            {/* Hero Section settings */}
            <div className="space-y-6 pt-6 border-t border-ink-800">
              <h4 className="text-lg font-serif text-ink-50">Hero Section</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Hero Headline">
                  <input value={settings.hero_title || ""} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="input-luxury" />
                </FormField>
                <FormField label="Hero Subtitle">
                  <input value={settings.hero_subtitle || ""} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} className="input-luxury" />
                </FormField>
                <FormField label="Hero Background Media (Video or Image)">
                  <div className="space-y-2">
                    {settings.hero_background_media ? (
                      <div className="relative aspect-video rounded-sm overflow-hidden bg-ink-950/50 group border border-ink-800">
                        {settings.hero_background_media.endsWith('.mp4') ? (
                          <video src={settings.hero_background_media} className="w-full h-full object-cover" />
                        ) : (
                          <img src={settings.hero_background_media} className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={() => setSettings({ ...settings, hero_background_media: null })} className="absolute top-2 right-2 p-1.5 bg-ink-950/80 text-ink-400 hover:text-red-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <ImageUpload bucket="banners" value="" onChange={(url) => setSettings({ ...settings, hero_background_media: url })} label="Upload Video or Image" accept="image/*,video/*" />
                    )}
                  </div>
                </FormField>
                <FormField label="Hero CTA Text">
                  <input value={settings.hero_cta_text || ""} onChange={(e) => setSettings({ ...settings, hero_cta_text: e.target.value })} className="input-luxury" />
                </FormField>
                <FormField label="Hero CTA Link">
                  <input value={settings.hero_cta_link || ""} onChange={(e) => setSettings({ ...settings, hero_cta_link: e.target.value })} className="input-luxury" />
                </FormField>
              </div>
            </div>
      </SettingsGroup>

      {/* Brand */}
      <SettingsGroup title="Brand Identity" icon={Palette}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Brand Name"><input value={settings.brand_name || ""} onChange={(e) => update("brand_name", e.target.value)} className="input-luxury" /></FormField>
          <FormField label="Tagline"><input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} className="input-luxury" /></FormField>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Brand Logo">
            <MediaPicker
              bucket="logos"
              value={settings.logo_url || ""}
              onChange={(url) => update("logo_url", url)}
              label="Select Luxury Logo"
            />
          </FormField>
          <FormField label="Favicon Asset">
            <MediaPicker
              bucket="logos"
              value={settings.favicon_url || ""}
              onChange={(url) => update("favicon_url", url)}
              label="Select Favicon Icon"
            />
          </FormField>
        </div>
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
        <FormField label="Contact Hours (Opening Times)"><input value={settings.contact_hours || ""} onChange={(e) => update("contact_hours", e.target.value)} className="input-luxury" placeholder="Mon - Sat: 9:00 AM - 6:00 PM" /></FormField>
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

      {/* Storefront Fallbacks & Rich Media */}
      <SettingsGroup title="Storefront Fallbacks & Rich Media" icon={ImageIcon}>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Brand Story Image">
            <MediaPicker
              bucket="banners"
              value={settings.brand_story_image_url || ""}
              onChange={(url) => update("brand_story_image_url", url)}
              label="Select Brand Story Image"
            />
          </FormField>
          <FormField label="WhatsApp CTA Image">
            <MediaPicker
              bucket="banners"
              value={settings.whatsapp_cta_image_url || ""}
              onChange={(url) => update("whatsapp_cta_image_url", url)}
              label="Select WhatsApp CTA Image"
            />
          </FormField>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Default Image Placeholder">
            <MediaPicker
              bucket="products"
              value={settings.default_placeholder_url || ""}
              onChange={(url) => update("default_placeholder_url", url)}
              label="Select Site Placeholder"
            />
          </FormField>
          <FormField label="Default Product Detail Fallback">
            <MediaPicker
              bucket="products"
              value={settings.default_product_url || ""}
              onChange={(url) => update("default_product_url", url)}
              label="Select Product Fallback"
            />
          </FormField>
        </div>
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
function AppearanceManager({ showToast }: { showToast: (msg: string) => void }) {
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
    try {
      const { error } = await supabase.from("site_settings").update({
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        accent_color: settings.accent_color,
        homepage_sections: settings.homepage_sections,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
      
      if (error) throw error;
      showToast("✓ Appearance Theme Saved");
    } catch (err: any) {
      alert("Error saving theme: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-ink-400">Loading...</p>;

  const allSections = [
    { id: "hero", name: "Hero Banner" },
    { id: "trending", name: "Trending Products" },
    { id: "showcase", name: "Homepage Showcase" },
    { id: "about", name: "About MarWiz" },
    { id: "why-choose", name: "Why Choose MarWiz" },
    { id: "testimonials", name: "Testimonials" },
    { id: "whatsapp-cta", name: "WhatsApp CTA" },
    { id: "newsletter", name: "Newsletter" }
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
          {[...allSections].sort((a, b) => {
            const indexA = (settings.homepage_sections || []).indexOf(a.id);
            const indexB = (settings.homepage_sections || []).indexOf(b.id);
            const posA = indexA === -1 ? 999 : indexA;
            const posB = indexB === -1 ? 999 : indexB;
            return posA - posB;
          }).map((section) => {
            const enabled = (settings.homepage_sections || []).includes(section.id);
            const order = (settings.homepage_sections || []).indexOf(section.id);
            return (
              <div key={section.id} className="flex items-center justify-between border border-ink-800 bg-ink-900 p-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={enabled} onChange={() => toggleSection(section.id)} className="accent-gold-400" />
                  <span className="text-sm text-ink-200">{section.name}</span>
                  {enabled && <span className="text-xs text-ink-500">Position {order + 1}</span>}
                </div>
                {enabled && (
                  <div className="flex gap-1">
                    <button onClick={() => moveSection(section.id, "up")} className="text-ink-400 hover:text-gold-400 px-2 py-1 text-xs font-semibold">Up</button>
                    <button onClick={() => moveSection(section.id, "down")} className="text-ink-400 hover:text-gold-400 px-2 py-1 text-xs font-semibold">Down</button>
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
function SEOManager({ showToast }: { showToast: (msg: string) => void }) {
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
    try {
      const { error } = await supabase.from("site_settings").update({
        meta_title: settings.meta_title,
        meta_description: settings.meta_description,
        meta_keywords: settings.meta_keywords,
        google_analytics_id: settings.google_analytics_id,
        google_search_console: settings.google_search_console,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);
      
      if (error) throw error;
      showToast("✓ SEO Settings Saved Successfully");
    } catch (err: any) {
      alert("Error saving SEO: " + err.message);
    } finally {
      setSaving(false);
    }
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

// ============ ENQUIRIES MANAGER ============
function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "accepted" | "declined">("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setEnquiries(data as Enquiry[]);
    } catch (err) {
      console.error(err);
      alert("Error loading enquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      if (selected?.id === id) {
        setSelected((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting enquiry.");
    }
  };

  const filtered = enquiries.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink-50">Customer Enquiries</h2>
          <p className="text-sm text-ink-400">View and manage messages sent from the contact form</p>
        </div>
        <div className="flex gap-1.5 border border-ink-800 p-1 bg-ink-900 self-start sm:self-auto">
          {(["all", "unread", "accepted", "declined"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                filter === opt
                  ? "bg-gold-400 text-ink-950"
                  : "text-ink-400 hover:text-ink-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-ink-400">Loading enquiries...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-800 bg-ink-900/50 p-12 text-center">
          <p className="text-ink-400">No enquiries found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`border p-5 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.status === "unread"
                  ? "border-gold-400/50 bg-ink-900"
                  : "border-ink-800 bg-ink-900/50 hover:bg-ink-900"
              }`}
              onClick={() => {
                setSelected(item);
                if (item.status === "unread") {
                  updateStatus(item.id, "accepted");
                }
              }}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink-100 text-sm">{item.name}</span>
                  <span className="text-xs text-ink-400">{item.email}</span>
                  {item.status === "unread" && (
                    <span className="px-2 py-0.5 bg-gold-400/10 text-gold-400 text-[10px] uppercase font-bold tracking-wider">
                      New
                    </span>
                  )}
                  {item.status === "accepted" && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-wider">
                      Accepted
                    </span>
                  )}
                  {item.status === "declined" && (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] uppercase font-bold tracking-wider">
                      Declined
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-300 truncate max-w-xl">{item.message}</p>
                <p className="text-xs text-ink-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto" onClick={(e) => e.stopPropagation()}>
                {item.status !== "accepted" && (
                  <button
                    onClick={() => updateStatus(item.id, "accepted")}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 border border-green-500/20 text-xs font-semibold uppercase"
                    title="Accept"
                  >
                    Accept
                  </button>
                )}
                {item.status !== "declined" && (
                  <button
                    onClick={() => updateStatus(item.id, "declined")}
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 border border-yellow-500/20 text-xs font-semibold uppercase"
                    title="Decline"
                  >
                    Decline
                  </button>
                )}
                <button
                  onClick={() => deleteEnquiry(item.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="border border-ink-800 bg-ink-900 w-full max-w-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-100"
            >
              <X size={20} />
            </button>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
                Enquiry Details
              </span>
              <h3 className="font-display text-2xl text-ink-50 mt-1">{selected.name}</h3>
              <p className="text-sm text-ink-400">{selected.email}</p>
            </div>
            <div className="border-t border-b border-ink-800 py-6">
              <p className="text-sm uppercase tracking-wider text-ink-500 mb-2">Message</p>
              <p className="text-base font-light leading-relaxed text-ink-200 whitespace-pre-line">
                {selected.message}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-ink-500">
                Received: {new Date(selected.created_at).toLocaleString()}
              </span>
              <div className="flex gap-2">
                {selected.status === "archived" ? (
                  <button
                    onClick={() => updateStatus(selected.id, "unread")}
                    className="btn-secondary py-2 px-4"
                  >
                    Mark Unread
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(selected.id, "archived")}
                    className="btn-secondary py-2 px-4"
                  >
                    Archive
                  </button>
                )}
                <button
                  onClick={() => deleteEnquiry(selected.id)}
                  className="btn-danger py-2 px-4 flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
