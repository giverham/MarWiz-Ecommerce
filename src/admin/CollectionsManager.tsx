import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import type { Collection } from "../types";

import { supabase } from "../lib/supabase";

interface CollectionsManagerProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

export function CollectionsManager({ showToast }: CollectionsManagerProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<Partial<Collection> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true });
    
    if (error) {
      showToast("Error fetching collections", "error");
    } else {
      setCollections(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSave = async () => {
    if (!editingCollection?.name || !editingCollection?.slug) {
      showToast("Name and Slug are required", "error");
      return;
    }

    const payload = {
      ...editingCollection,
      is_active: editingCollection.is_active ?? true,
      show_in_homepage: editingCollection.show_in_homepage ?? false,
      is_featured: editingCollection.is_featured ?? false,
      sort_order: editingCollection.sort_order ?? 0,
    };

    if (isNew) {
      const { error } = await supabase.from("collections").insert([payload]);
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Collection created successfully");
        setEditingCollection(null);
        fetchCollections();
      }
    } else {
      const { error } = await supabase
        .from("collections")
        .update(payload)
        .eq("id", editingCollection.id);
      
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Collection updated successfully");
        setEditingCollection(null);
        fetchCollections();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Collection deleted successfully");
      fetchCollections();
    }
  };

  if (editingCollection) {
    return (
      <div className="bg-ink-900 border border-ink-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif text-ink-50">{isNew ? "New Collection" : "Edit Collection"}</h2>
          <button onClick={() => setEditingCollection(null)} className="text-ink-400 hover:text-ink-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Collection Title *</label>
              <input 
                type="text" 
                value={editingCollection.name || ""} 
                onChange={e => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setEditingCollection({ ...editingCollection, name: e.target.value, slug: isNew ? slug : editingCollection.slug });
                }} 
                className="input-luxury w-full" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Slug *</label>
              <input 
                type="text" 
                value={editingCollection.slug || ""} 
                onChange={e => setEditingCollection({ ...editingCollection, slug: e.target.value })} 
                className="input-luxury w-full bg-ink-950" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Subtitle</label>
              <input 
                type="text" 
                value={editingCollection.subtitle || ""} 
                onChange={e => setEditingCollection({ ...editingCollection, subtitle: e.target.value })} 
                className="input-luxury w-full" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Description</label>
              <textarea 
                value={editingCollection.description || ""} 
                onChange={e => setEditingCollection({ ...editingCollection, description: e.target.value })} 
                className="input-luxury w-full min-h-[100px]" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Button Text</label>
              <input 
                type="text" 
                value={editingCollection.button_text || ""} 
                onChange={e => setEditingCollection({ ...editingCollection, button_text: e.target.value })} 
                className="input-luxury w-full" 
                placeholder="e.g. Shop Collection"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Button Link</label>
              <input 
                type="text" 
                value={editingCollection.button_link || ""} 
                onChange={e => setEditingCollection({ ...editingCollection, button_link: e.target.value })} 
                className="input-luxury w-full" 
                placeholder="e.g. /collections/handmade"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Display Order</label>
                <input 
                  type="number" 
                  value={editingCollection.sort_order || 0} 
                  onChange={e => setEditingCollection({ ...editingCollection, sort_order: parseInt(e.target.value) || 0 })} 
                  className="input-luxury w-full" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 border border-ink-800 bg-ink-950/50 space-y-4">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider border-b border-ink-800 pb-2">Visibility Settings</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingCollection.is_active ?? true} 
                  onChange={e => setEditingCollection({ ...editingCollection, is_active: e.target.checked })}
                  className="accent-gold-400 h-4 w-4" 
                />
                <span className="text-sm text-ink-200">Collection Enabled (Public)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingCollection.show_in_homepage ?? false} 
                  onChange={e => setEditingCollection({ ...editingCollection, show_in_homepage: e.target.checked })}
                  className="accent-gold-400 h-4 w-4" 
                />
                <span className="text-sm text-ink-200">Show on Homepage</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingCollection.is_featured ?? false} 
                  onChange={e => setEditingCollection({ ...editingCollection, is_featured: e.target.checked })}
                  className="accent-gold-400 h-4 w-4" 
                />
                <span className="text-sm text-ink-200">Featured Collection (Highlights)</span>
              </label>
            </div>

            <div className="p-4 border border-ink-800 bg-ink-950/50 space-y-4">
              <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider border-b border-ink-800 pb-2">SEO Settings</h3>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">SEO Title</label>
                <input 
                  type="text" 
                  value={editingCollection.seo_title || ""} 
                  onChange={e => setEditingCollection({ ...editingCollection, seo_title: e.target.value })} 
                  className="input-luxury w-full" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">SEO Description</label>
                <textarea 
                  value={editingCollection.seo_description || ""} 
                  onChange={e => setEditingCollection({ ...editingCollection, seo_description: e.target.value })} 
                  className="input-luxury w-full min-h-[80px]" 
                />
              </div>
            </div>

            <div className="p-4 border border-ink-800 bg-ink-950/50 space-y-4">
               <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider border-b border-ink-800 pb-2">Media</h3>
               
               <div>
                  <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Cover Image (Square/Portrait)</label>
                  {editingCollection.image_url ? (
                    <div className="relative aspect-square w-32 mb-4">
                      <img src={editingCollection.image_url} alt="Cover" className="w-full h-full object-cover border border-ink-800" />
                      <button onClick={() => setEditingCollection({ ...editingCollection, image_url: null })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
                    </div>
                  ) : (
                    <ImageUpload bucket="collections" onUpload={(url) => setEditingCollection({ ...editingCollection, image_url: url })} />
                  )}
               </div>

               <div>
                  <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Banner Image (Landscape)</label>
                  {editingCollection.banner_image_url ? (
                    <div className="relative aspect-video w-full max-w-[200px] mb-4">
                      <img src={editingCollection.banner_image_url} alt="Banner" className="w-full h-full object-cover border border-ink-800" />
                      <button onClick={() => setEditingCollection({ ...editingCollection, banner_image_url: null })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={14}/></button>
                    </div>
                  ) : (
                    <ImageUpload bucket="collections" onUpload={(url) => setEditingCollection({ ...editingCollection, banner_image_url: url })} />
                  )}
               </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t border-ink-800 pt-6">
          <button onClick={() => setEditingCollection(null)} className="btn-outline">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-ink-50">Collections</h2>
          <p className="text-sm text-ink-400">Manage all collections, their homepage visibility, and SEO settings.</p>
        </div>
        <button 
          onClick={() => {
            setIsNew(true);
            setEditingCollection({
              is_active: true,
              show_in_homepage: false,
              is_featured: false,
              sort_order: 0
            });
          }} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> New Collection
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-400">Loading collections...</div>
      ) : collections.length === 0 ? (
        <div className="p-12 border border-dashed border-ink-800 text-center text-ink-400 bg-ink-900/50">
          <LayoutTemplate size={48} className="mx-auto mb-4 opacity-50" />
          <p>No collections found.</p>
          <button onClick={() => { setIsNew(true); setEditingCollection({}); }} className="mt-4 text-gold-400 hover:underline">
            Create your first collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {collections.map(col => (
            <div key={col.id} className="border border-ink-800 bg-ink-900 overflow-hidden flex flex-col group">
              <div className="aspect-[3/1] bg-ink-950 relative border-b border-ink-800">
                {(col.banner_image_url || col.image_url) ? (
                  <img src={col.banner_image_url || col.image_url!} alt={col.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-800">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {!col.is_active && <span className="bg-red-500/90 text-white text-[10px] uppercase px-2 py-1 tracking-wider">Disabled</span>}
                  {col.show_in_homepage && <span className="bg-gold-500/90 text-ink-950 font-bold text-[10px] uppercase px-2 py-1 tracking-wider">Homepage</span>}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-ink-50 mb-1">{col.name}</h3>
                  <p className="text-xs text-ink-400 line-clamp-2 mb-4">{col.description || col.subtitle || "No description"}</p>
                </div>
                <div className="flex justify-between items-center border-t border-ink-800/50 pt-4">
                  <span className="text-xs text-ink-500 uppercase tracking-wider">Order: {col.sort_order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setIsNew(false); setEditingCollection(col); }} className="p-2 text-ink-400 hover:text-gold-400 transition-colors bg-ink-950 rounded border border-ink-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(col.id)} className="p-2 text-ink-400 hover:text-red-400 transition-colors bg-ink-950 rounded border border-ink-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
