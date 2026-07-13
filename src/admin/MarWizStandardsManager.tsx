import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, LayoutTemplate, Award, Shield, Truck, Star, Check, Heart, Gem } from "lucide-react";
import { supabase } from "../lib/supabase";

export interface MarWizStandard {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const AVAILABLE_ICONS = ["Award", "Shield", "Truck", "Star", "Check", "Heart", "Gem"];

interface StandardsManagerProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

export function MarWizStandardsManager({ showToast }: StandardsManagerProps) {
  const [standards, setStandards] = useState<MarWizStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStandard, setEditingStandard] = useState<Partial<MarWizStandard> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchStandards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marwiz_standards")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) {
      showToast("Error fetching standards", "error");
    } else {
      setStandards(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const handleSave = async () => {
    if (!editingStandard?.title || !editingStandard?.description || !editingStandard?.icon_name) {
      showToast("Title, Description, and Icon are required", "error");
      return;
    }

    const payload = {
      ...editingStandard,
      is_active: editingStandard.is_active ?? true,
      display_order: editingStandard.display_order ?? 0,
    };

    if (isNew) {
      const { error } = await supabase.from("marwiz_standards").insert([payload]);
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Standard created successfully");
        setEditingStandard(null);
        fetchStandards();
      }
    } else {
      const { error } = await supabase
        .from("marwiz_standards")
        .update(payload)
        .eq("id", editingStandard.id);
      
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Standard updated successfully");
        setEditingStandard(null);
        fetchStandards();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this standard?")) return;
    
    const { error } = await supabase.from("marwiz_standards").delete().eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Standard deleted successfully");
      fetchStandards();
    }
  };

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "Award": return <Award size={20} />;
      case "Shield": return <Shield size={20} />;
      case "Truck": return <Truck size={20} />;
      case "Star": return <Star size={20} />;
      case "Check": return <Check size={20} />;
      case "Heart": return <Heart size={20} />;
      case "Gem": return <Gem size={20} />;
      default: return <Star size={20} />;
    }
  };

  if (editingStandard) {
    return (
      <div className="bg-ink-900 border border-ink-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif text-ink-50">{isNew ? "New Standard" : "Edit Standard"}</h2>
          <button onClick={() => setEditingStandard(null)} className="text-ink-400 hover:text-ink-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Title *</label>
            <input 
              type="text" 
              value={editingStandard.title || ""} 
              onChange={e => setEditingStandard({ ...editingStandard, title: e.target.value })} 
              className="input-luxury w-full" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Description *</label>
            <textarea 
              value={editingStandard.description || ""} 
              onChange={e => setEditingStandard({ ...editingStandard, description: e.target.value })} 
              className="input-luxury w-full min-h-[100px]" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Icon *</label>
            <div className="flex gap-4 flex-wrap">
              {AVAILABLE_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setEditingStandard({ ...editingStandard, icon_name: icon })}
                  className={`p-3 border transition-colors flex items-center justify-center ${editingStandard.icon_name === icon ? "border-gold-400 text-gold-400 bg-ink-950" : "border-ink-800 text-ink-400 hover:border-gold-400/50"}`}
                >
                  {getIcon(icon)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Display Order</label>
              <input 
                type="number" 
                value={editingStandard.display_order || 0} 
                onChange={e => setEditingStandard({ ...editingStandard, display_order: parseInt(e.target.value) || 0 })} 
                className="input-luxury w-full" 
              />
            </div>
          </div>

          <div className="p-4 border border-ink-800 bg-ink-950/50 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={editingStandard.is_active ?? true} 
                onChange={e => setEditingStandard({ ...editingStandard, is_active: e.target.checked })}
                className="accent-gold-400 h-4 w-4" 
              />
              <span className="text-sm text-ink-200">Active</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t border-ink-800 pt-6">
          <button onClick={() => setEditingStandard(null)} className="btn-outline">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Standard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-ink-50">MarWiz Standards</h2>
          <p className="text-sm text-ink-400">Manage the 'Why MarWiz / The MarWiz Standard' section on the homepage.</p>
        </div>
        <button 
          onClick={() => {
            setIsNew(true);
            setEditingStandard({
              is_active: true,
              display_order: standards.length + 1,
              icon_name: "Star"
            });
          }} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> New Standard
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-ink-400">Loading standards...</div>
      ) : standards.length === 0 ? (
        <div className="p-12 border border-dashed border-ink-800 text-center text-ink-400 bg-ink-900/50">
          <LayoutTemplate size={48} className="mx-auto mb-4 opacity-50" />
          <p>No standards found.</p>
          <button onClick={() => { setIsNew(true); setEditingStandard({ icon_name: "Star" }); }} className="mt-4 text-gold-400 hover:underline">
            Create your first standard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map(std => (
            <div key={std.id} className="border border-ink-800 bg-ink-900 p-6 flex flex-col items-center text-center">
              <div className="mb-4 text-gold-400 h-16 w-16 rounded-full border border-gold-400/20 bg-ink-950 flex items-center justify-center">
                {getIcon(std.icon_name)}
              </div>
              <h3 className="font-serif text-lg text-ink-50 mb-2">{std.title}</h3>
              <p className="text-sm text-ink-400 mb-6 flex-grow">{std.description}</p>
              
              <div className="w-full flex justify-between items-center border-t border-ink-800/50 pt-4">
                <span className="text-xs text-ink-500">Order: {std.display_order}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setIsNew(false); setEditingStandard(std); }} className="p-2 text-ink-400 hover:text-gold-400 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(std.id)} className="p-2 text-ink-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
