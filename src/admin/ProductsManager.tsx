import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { formatNaira, slugify } from "../lib/utils";
import { ProductGalleryUpload } from "./ImageUpload";
import { Edit, Trash2, Plus, X } from "lucide-react";
import type { Product, Category, HomepageSection } from "../types";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.15em] text-ink-400 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ProductsManager({ showToast }: { showToast: (msg: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const [{ data: prods }, { data: cats }, { data: cols }] = await Promise.all([
      supabase.from("products").select("*, category:categories!products_category_id_fkey(*), product_collections(collections(*))").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("collections").select("*").order("sort_order"),
    ]);
    if (prods) {
      const mapped = prods.map((p: any) => ({
        ...p,
        collections: p.product_collections?.map((pc: any) => pc.collections).filter(Boolean) || [],
      }));
      setProducts(mapped as Product[]);
    }
    if (cats) setCategories(cats as Category[]);
    if (cols) setCollections(cols as Collection[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    showToast("Product deleted successfully.");
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
        showToast={showToast}
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
                      {p.images && p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div>
                      <span className="text-sm text-ink-100 block">{p.name}</span>
                      <span className="text-xs text-ink-500">
                        {p.category?.name || "No Category"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gold-400">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-sm text-ink-300">{p.stock}</td>
                  <div className="flex gap-1 flex-wrap">
                    {p.is_active && <span className="bg-green-900/30 text-green-300 px-2 py-0.5 text-[10px] uppercase">Active</span>}
                  </div>
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
  product, categories, collections, onClose, onSaved, showToast,
}: {
  product: Product | null;
  categories: Category[];
  collections: Collection[];
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    category_id: product?.category_id || "",
    collection_ids: (product as any)?.collections?.map((c: any) => c.id) || [],
    images: product?.images || [] as string[],
    colors: (product?.variants?.colors || []).join(", "),
    sizes: (product?.variants?.sizes || []).join(", "),
    specs: JSON.stringify(product?.specs || {}, null, 2),
    stock: product?.stock?.toString() || "0",
    availability: product?.availability || "in_stock",
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
      images: form.images,
      variants: {
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      },
      specs: (() => { try { return JSON.parse(form.specs); } catch { return {}; } })(),
      stock: parseInt(form.stock) || 0,
      availability: form.availability,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    try {
      let productId = product?.id;
      if (product) {
        const { error } = await supabase.from("products").update(data).eq("id", product.id);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase.from("products").insert(data).select("id").single();
        if (error) throw error;
        productId = inserted.id;
      }

      if (productId) {
        // Update product_collections
        await supabase.from("product_collections").delete().eq("product_id", productId);
        if (form.collection_ids.length > 0) {
          await supabase.from("product_collections").insert(
            form.collection_ids.map((id: string) => ({ product_id: productId, collection_id: id }))
          );
        }
      }

      showToast(product ? "? Saved Successfully" : "? Product Created Successfully");
      onSaved();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCollection = (id: string) => {
    setForm(prev => ({
      ...prev,
      collection_ids: prev.collection_ids.includes(id) 
        ? prev.collection_ids.filter((cid: string) => cid !== id)
        : [...prev.collection_ids, id]
    }));
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display text-gold-400">{product ? "Edit Product" : "Add Product"}</h2>
        <button onClick={onClose} className="text-ink-400 hover:text-ink-100 p-2 border border-ink-800 bg-ink-900 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="border border-ink-800 bg-ink-900 p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.15em] text-ink-500 font-medium">General Information</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Product Name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" />
              </FormField>
              <FormField label="Slug (optional)">
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-luxury" placeholder="Auto-generated if empty" />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-luxury min-h-[120px]" />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Price (?)">
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-luxury" />
              </FormField>
              <FormField label="Compare at Price (?)">
                <input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className="input-luxury" />
              </FormField>
              <FormField label="Stock Quantity">
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-luxury" />
              </FormField>
              <FormField label="Availability">
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input-luxury appearance-none">
                  <option value="in_stock">In Stock</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Media */}
          <div className="border border-ink-800 bg-ink-900 p-6 space-y-5">
            <h3 className="text-xs uppercase tracking-[0.15em] text-ink-500 font-medium">Media & Variants</h3>
            <ProductGalleryUpload
              bucket="products"
              images={form.images}
              onChange={(urls) => setForm({ ...form, images: urls })}
            />
            <div className="grid gap-5 sm:grid-cols-2 mt-4">
              <FormField label="Colors (comma separated)">
                <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input-luxury" placeholder="Black, Gold, Silver" />
              </FormField>
              <FormField label="Sizes (comma separated)">
                <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input-luxury" placeholder="S, M, L, XL" />
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Organization */}
          <div className="border border-ink-800 bg-ink-900 p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.15em] text-ink-500 font-medium">Organization</h3>
            
            <FormField label="Category (Required)">
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input-luxury w-full"
                required
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parent_id && "— "} {c.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Collections">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {collections.map((col) => (
                  <label key={col.id} className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 accent-gold-400"
                      checked={form.collection_ids.includes(col.id)}
                      onChange={() => toggleCollection(col.id)}
                    />
                    <span className="text-sm text-ink-300 group-hover:text-gold-400 transition-colors">
                      {col.name}
                    </span>
                  </label>
                ))}
                {collections.length === 0 && <p className="text-xs text-ink-500">No collections found.</p>}
              </div>
            </FormField>
          </div>

          {/* Visibility & Flags */}
          <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.15em] text-ink-500 font-medium mb-4">Status & Flags</h3>
            {[
              { id: "is_active", label: "Active (Visible in store)" },
            ].map((flag) => (
              <label key={flag.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="accent-gold-400 w-4 h-4"
                  checked={(form as any)[flag.id]}
                  onChange={(e) => setForm({ ...form, [flag.id]: e.target.checked })}
                />
                <span className="text-sm text-ink-300 group-hover:text-gold-400 transition-colors">
                  {flag.label}
                </span>
              </label>
            ))}
          </div>

          <div className="border border-ink-800 bg-ink-900 p-6">
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3">
              {saving ? "Saving..." : (product ? "Save Changes" : "Publish Product")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
