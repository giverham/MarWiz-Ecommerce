import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import type { Page } from "../types";

import { supabase } from "../lib/supabase";

export function AboutPageManager({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<Page | null>(null);

  const [form, setForm] = useState({
    about_marwiz: { title: "", subtitle: "", description: "", image: "", button: "" },
    statistics: [] as any[],
    mission: { title: "", description: "", enabled: true },
    vision: { title: "", description: "", enabled: true },
    pillars: [] as any[],
    behind_the_craft: { image: "", title: "", subtitle: "", description: "", button: "", enabled: true },
    seo: { title: "", description: "" }
  });

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pages").select("*").eq("slug", "about").single();
    if (error) {
      if (error.code !== "PGRST116") showToast("Error loading about page data", "error");
    } else if (data) {
      setPageData(data);
      const content = data.content || {};
      
      // Migration logic from old structure if new structure is empty
      setForm({
        about_marwiz: content.about_marwiz || {
          title: content.title || "About MarWiz",
          subtitle: content.subtitle || "",
          description: content.description || "",
          image: content.main_image || "",
          button: content.cta_btn_text || "Shop Collection"
        },
        statistics: content.statistics || [
          { title: "Years of Craft", number: content.stat_years?.replace("+","") || "12", suffix: "+", enabled: true },
          { title: "Global Clients", number: content.stat_customers?.replace("+","") || "5000", suffix: "+", enabled: true },
          { title: "Luxury Designs", number: content.stat_products?.replace("+","") || "150", suffix: "+", enabled: true },
          { title: "Orders Delivered", number: content.stat_orders?.replace("+","") || "10000", suffix: "+", enabled: true },
        ],
        mission: content.mission || {
          title: content.mission_title || "Our Mission",
          description: content.mission_desc || "",
          enabled: true
        },
        vision: content.vision || {
          title: content.vision_title || "Our Vision",
          description: content.vision_desc || "",
          enabled: true
        },
        pillars: content.pillars || (content.values || []).map((v: any) => ({ ...v, enabled: true })) || [],
        behind_the_craft: content.behind_the_craft || {
          image: content.brand_story_image || "",
          title: "Behind The Craft",
          subtitle: "",
          description: content.company_story || "",
          button: "Learn More",
          enabled: true
        },
        seo: content.seo || { title: data.title || "About Us - MarWiz", description: "" }
      });
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    let pageId = pageData?.id;
    
    const payload = {
      slug: "about",
      title: "About MarWiz",
      is_active: true,
      content: form
    };

    if (!pageId) {
      const { data, error } = await supabase.from("pages").insert([payload]).select().single();
      if (error) showToast(error.message, "error");
      else {
        showToast("About page created successfully");
        setPageData(data);
      }
    } else {
      const { error } = await supabase.from("pages").update(payload).eq("id", pageId);
      if (error) showToast(error.message, "error");
      else showToast("About page updated successfully");
    }
    setSaving(false);
  };

  const moveArrayItem = (arrayName: 'statistics' | 'pillars', index: number, direction: -1 | 1) => {
    const arr = [...form[arrayName]];
    if (index + direction < 0 || index + direction >= arr.length) return;
    const temp = arr[index];
    arr[index] = arr[index + direction];
    arr[index + direction] = temp;
    setForm({ ...form, [arrayName]: arr });
  };

  const addArrayItem = (arrayName: 'statistics' | 'pillars', newItem: any) => {
    setForm({ ...form, [arrayName]: [...form[arrayName], newItem] });
  };

  const removeArrayItem = (arrayName: 'statistics' | 'pillars', index: number) => {
    const arr = [...form[arrayName]];
    arr.splice(index, 1);
    setForm({ ...form, [arrayName]: arr });
  };

  const updateArrayItem = (arrayName: 'statistics' | 'pillars', index: number, field: string, value: any) => {
    const arr = [...form[arrayName]];
    arr[index][field] = value;
    setForm({ ...form, [arrayName]: arr });
  };

  if (loading) return <div className="text-ink-400 p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-ink-50">About Page Manager</h2>
          <p className="text-sm text-ink-400">Manage all content dynamically rendered on the About page.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* About MarWiz */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-4">
            <h3 className="font-serif text-gold-400 text-lg border-b border-ink-800 pb-2">1. About MarWiz</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Title</label>
                <input type="text" className="input-luxury w-full" value={form.about_marwiz.title} onChange={e => setForm({...form, about_marwiz: {...form.about_marwiz, title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Subtitle</label>
                <input type="text" className="input-luxury w-full" value={form.about_marwiz.subtitle} onChange={e => setForm({...form, about_marwiz: {...form.about_marwiz, subtitle: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Description</label>
                <textarea className="input-luxury w-full min-h-[120px]" value={form.about_marwiz.description} onChange={e => setForm({...form, about_marwiz: {...form.about_marwiz, description: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Button Text</label>
                <input type="text" className="input-luxury w-full" value={form.about_marwiz.button} onChange={e => setForm({...form, about_marwiz: {...form.about_marwiz, button: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Image (Portrait)</label>
                {form.about_marwiz.image ? (
                  <div className="relative w-32 aspect-[3/4] mb-2">
                    <img src={form.about_marwiz.image} alt="About" className="w-full h-full object-cover border border-ink-800" />
                    <button onClick={() => setForm({...form, about_marwiz: {...form.about_marwiz, image: ""}})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 size={12}/></button>
                  </div>
                ) : (
                  <ImageUpload bucket="pages" value={form.about_marwiz.image} onChange={url => setForm({...form, about_marwiz: {...form.about_marwiz, image: url}})} />
                )}
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-6">
            <h3 className="font-serif text-gold-400 text-lg border-b border-ink-800 pb-2">2. Mission & Vision</h3>
            
            {/* Mission */}
            <div className="space-y-4 p-4 border border-ink-800 bg-ink-950/50">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-ink-50">Mission Statement</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-ink-400">Enabled</span>
                  <input type="checkbox" className="accent-gold-400" checked={form.mission.enabled} onChange={e => setForm({...form, mission: {...form.mission, enabled: e.target.checked}})} />
                </label>
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">Title</label>
                <input type="text" className="input-luxury w-full" value={form.mission.title} onChange={e => setForm({...form, mission: {...form.mission, title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">Description</label>
                <textarea className="input-luxury w-full min-h-[80px]" value={form.mission.description} onChange={e => setForm({...form, mission: {...form.mission, description: e.target.value}})} />
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-4 p-4 border border-ink-800 bg-ink-950/50">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-ink-50">Vision Statement</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-ink-400">Enabled</span>
                  <input type="checkbox" className="accent-gold-400" checked={form.vision.enabled} onChange={e => setForm({...form, vision: {...form.vision, enabled: e.target.checked}})} />
                </label>
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">Title</label>
                <input type="text" className="input-luxury w-full" value={form.vision.title} onChange={e => setForm({...form, vision: {...form.vision, title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">Description</label>
                <textarea className="input-luxury w-full min-h-[80px]" value={form.vision.description} onChange={e => setForm({...form, vision: {...form.vision, description: e.target.value}})} />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-4">
            <h3 className="font-serif text-gold-400 text-lg border-b border-ink-800 pb-2">SEO Configuration</h3>
            <div>
              <label className="block text-xs text-ink-400 mb-1">SEO Title</label>
              <input type="text" className="input-luxury w-full" value={form.seo.title} onChange={e => setForm({...form, seo: {...form.seo, title: e.target.value}})} />
            </div>
            <div>
              <label className="block text-xs text-ink-400 mb-1">SEO Description</label>
              <textarea className="input-luxury w-full min-h-[80px]" value={form.seo.description} onChange={e => setForm({...form, seo: {...form.seo, description: e.target.value}})} />
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Statistics */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-ink-800 pb-2">
              <h3 className="font-serif text-gold-400 text-lg">3. Statistics</h3>
              <button onClick={() => addArrayItem('statistics', { title: "New Stat", number: "100", suffix: "+", enabled: true })} className="text-gold-400 text-sm flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Stat
              </button>
            </div>
            
            <div className="space-y-3">
              {form.statistics.map((stat, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-ink-800 bg-ink-950/50">
                  <div className="flex flex-col gap-1 mt-1">
                    <button onClick={() => moveArrayItem('statistics', i, -1)} className="text-ink-500 hover:text-ink-200"><ArrowUp size={14} /></button>
                    <button onClick={() => moveArrayItem('statistics', i, 1)} className="text-ink-500 hover:text-ink-200"><ArrowDown size={14} /></button>
                  </div>
                  <div className="flex-grow grid grid-cols-2 gap-3">
                    <input type="text" className="input-luxury text-sm" placeholder="Title (e.g. Years of Craft)" value={stat.title} onChange={e => updateArrayItem('statistics', i, 'title', e.target.value)} />
                    <div className="flex gap-2">
                      <input type="text" className="input-luxury text-sm flex-grow" placeholder="Number (e.g. 12)" value={stat.number} onChange={e => updateArrayItem('statistics', i, 'number', e.target.value)} />
                      <input type="text" className="input-luxury text-sm w-16" placeholder="Suffix" value={stat.suffix} onChange={e => updateArrayItem('statistics', i, 'suffix', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center pt-2">
                    <input type="checkbox" className="accent-gold-400 w-4 h-4" checked={stat.enabled} onChange={e => updateArrayItem('statistics', i, 'enabled', e.target.checked)} title="Enable/Disable" />
                    <button onClick={() => removeArrayItem('statistics', i)} className="text-red-400 hover:text-red-300" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {form.statistics.length === 0 && <p className="text-ink-500 text-sm">No statistics added.</p>}
            </div>
          </section>

          {/* Pillars */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-ink-800 pb-2">
              <h3 className="font-serif text-gold-400 text-lg">4. Foundation / Pillars</h3>
              <button onClick={() => addArrayItem('pillars', { title: "New Pillar", description: "", enabled: true })} className="text-gold-400 text-sm flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Pillar
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {form.pillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-ink-800 bg-ink-950/50">
                  <div className="flex flex-col gap-1 mt-1">
                    <button onClick={() => moveArrayItem('pillars', i, -1)} className="text-ink-500 hover:text-ink-200"><ArrowUp size={14} /></button>
                    <button onClick={() => moveArrayItem('pillars', i, 1)} className="text-ink-500 hover:text-ink-200"><ArrowDown size={14} /></button>
                  </div>
                  <div className="flex-grow space-y-2">
                    <input type="text" className="input-luxury text-sm w-full font-bold text-gold-400" placeholder="Pillar Title" value={pillar.title} onChange={e => updateArrayItem('pillars', i, 'title', e.target.value)} />
                    <textarea className="input-luxury text-sm w-full min-h-[60px]" placeholder="Description" value={pillar.description} onChange={e => updateArrayItem('pillars', i, 'description', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center pt-2">
                    <input type="checkbox" className="accent-gold-400 w-4 h-4" checked={pillar.enabled} onChange={e => updateArrayItem('pillars', i, 'enabled', e.target.checked)} title="Enable/Disable" />
                    <button onClick={() => removeArrayItem('pillars', i)} className="text-red-400 hover:text-red-300" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {form.pillars.length === 0 && <p className="text-ink-500 text-sm">No pillars added.</p>}
            </div>
          </section>

          {/* Behind The Craft */}
          <section className="bg-ink-900 border border-ink-800 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-ink-800 pb-2">
              <h3 className="font-serif text-gold-400 text-lg">5. Behind The Craft</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-ink-400">Enabled</span>
                <input type="checkbox" className="accent-gold-400" checked={form.behind_the_craft.enabled} onChange={e => setForm({...form, behind_the_craft: {...form.behind_the_craft, enabled: e.target.checked}})} />
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Title</label>
                <input type="text" className="input-luxury w-full" value={form.behind_the_craft.title} onChange={e => setForm({...form, behind_the_craft: {...form.behind_the_craft, title: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Subtitle</label>
                <input type="text" className="input-luxury w-full" value={form.behind_the_craft.subtitle} onChange={e => setForm({...form, behind_the_craft: {...form.behind_the_craft, subtitle: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Description</label>
                <textarea className="input-luxury w-full min-h-[100px]" value={form.behind_the_craft.description} onChange={e => setForm({...form, behind_the_craft: {...form.behind_the_craft, description: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Button Text</label>
                <input type="text" className="input-luxury w-full" value={form.behind_the_craft.button} onChange={e => setForm({...form, behind_the_craft: {...form.behind_the_craft, button: e.target.value}})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Featured Image (Landscape)</label>
                {form.behind_the_craft.image ? (
                  <div className="relative w-full aspect-video mb-2">
                    <img src={form.behind_the_craft.image} alt="Behind the craft" className="w-full h-full object-cover border border-ink-800" />
                    <button onClick={() => setForm({...form, behind_the_craft: {...form.behind_the_craft, image: ""}})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 size={12}/></button>
                  </div>
                ) : (
                  <ImageUpload bucket="pages" value={form.behind_the_craft.image} onChange={url => setForm({...form, behind_the_craft: {...form.behind_the_craft, image: url}})} />
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
