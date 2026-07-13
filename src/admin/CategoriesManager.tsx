import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { slugify } from "../lib/utils";
import { ImageUpload } from "./ImageUpload";
import { Edit, Save, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import type { Category } from "../types";

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

export function CategoriesManager({ showToast }: { showToast: (msg: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data as Category[]);
  }, []);

  useEffect(() => { load(); }, [load]);

  const parentCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  const startEdit = (cat: Category | null = null, parentId: string | null = null) => {
    if (cat) {
      setEditing({ ...cat });
    } else {
      setEditing({ name: "", slug: "", description: "", image_url: "", sort_order: 0, parent_id: parentId });
    }
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    const data = {
      name: editing.name.trim(),
      slug: (editing.slug || slugify(editing.name)).trim(),
      description: editing.description,
      image_url: editing.image_url,
      sort_order: Number(editing.sort_order) || 0,
      parent_id: editing.parent_id || null,
      is_active: true,
    };
    try {
      if (editing.id) {
        const { error } = await supabase.from("categories").update(data).eq("id", editing.id);
        if (error) throw error;
        showToast("? Saved Successfully");
      } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw error;
        showToast("? Category Created Successfully");
      }
      setEditing(null);
      load();
    } catch (err: any) {
      alert("Error saving category: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? If it is a parent category, all subcategories will also be deleted.")) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      showToast("Category deleted successfully.");
      load();
    } catch (err: any) {
      alert("Error deleting category: " + err.message);
    }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedParents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedParents(next);
  };

  return (
    <div className="space-y-6">
      {editing ? (
        <div className="border border-ink-800 bg-ink-900 p-6 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-gold-400">
            {editing.id ? "Edit Category" : (editing.parent_id ? "Add Subcategory" : "Add Parent Category")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-luxury" />
            </FormField>
            <FormField label="Slug">
              <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input-luxury" placeholder="Leave blank to auto-generate" />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Description">
              <input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-luxury" />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} className="input-luxury" />
            </FormField>
          </div>
          
          <FormField label="Parent Category">
            <select
              value={editing.parent_id || ""}
              onChange={(e) => setEditing({ ...editing, parent_id: e.target.value || null })}
              className="input-luxury"
            >
              <option value="">None (Top Level)</option>
              {parentCategories.map(pc => (
                <option key={pc.id} value={pc.id}>{pc.name}</option>
              ))}
            </select>
          </FormField>

          <ImageUpload
            bucket="categories"
            value={editing.image_url || ""}
            onChange={(url) => setEditing({ ...editing, image_url: url })}
            label="Category Cover Image"
          />

          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save Category</button>
            <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-display text-gold-400">Category Manager</h2>
          <button onClick={() => startEdit()} className="btn-primary py-2 px-4 text-xs">
            <Plus size={16} /> Add Parent Category
          </button>
        </div>
      )}

      {!editing && (
        <div className="space-y-3">
          {parentCategories.map((parent) => {
            const subs = getSubcategories(parent.id as string);
            const isExpanded = expandedParents.has(parent.id as string);
            return (
              <div key={parent.id} className="border border-ink-800 bg-ink-900 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-ink-950/50">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleExpand(parent.id as string)} className="text-ink-400 hover:text-gold-400">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    {parent.image_url && <img src={parent.image_url} alt="" className="h-10 w-10 object-cover" />}
                    <div>
                      <p className="text-sm text-ink-100 font-medium">{parent.name}</p>
                      <p className="text-xs text-ink-500">/{parent.slug} � {subs.length} subcategories</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(null, parent.id)} className="text-gold-400 hover:text-gold-300 text-xs uppercase tracking-wider flex items-center gap-1">
                      <Plus size={14} /> Subcategory
                    </button>
                    <button onClick={() => startEdit(parent)} className="text-ink-400 hover:text-gold-400"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(parent.id as string)} className="text-ink-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-ink-800 p-2 pl-12 bg-ink-900/50 space-y-1">
                    {subs.length === 0 ? (
                      <p className="text-xs text-ink-500 p-2">No subcategories yet.</p>
                    ) : (
                      subs.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-3 border-b border-ink-800/50 last:border-0 hover:bg-ink-800/20 transition-colors">
                          <div className="flex items-center gap-3">
                            {sub.image_url && <img src={sub.image_url} alt="" className="h-8 w-8 object-cover" />}
                            <div>
                              <p className="text-sm text-ink-300">{sub.name}</p>
                              <p className="text-xs text-ink-600">/{sub.slug}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => startEdit(sub)} className="text-ink-400 hover:text-gold-400"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(sub.id as string)} className="text-ink-400 hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
