import { useState, useEffect, useCallback } from "react";
import { Upload, Image as ImageIcon, Search, Folder, X, Check, Film } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { MediaItem } from "../types";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  label?: string;
  accept?: string;
}

export function MediaPicker({
  value,
  onChange,
  bucket,
  label = "Select Media",
  accept = "image/*",
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load all media items
  const loadMedia = useCallback(async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as MediaItem[]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, loadMedia]);

  // Unique list of folders for filter
  const folders = ["all", ...Array.from(new Set(items.map((item) => item.folder || "gallery")))];

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || 
                          item.url.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolder === "all" || item.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const handleUploadFiles = async (files: FileList) => {
    try {
      setUploading(true);
      const file = files[0]; // Take only first file for single picker
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const cleanName = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `${cleanName}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to specified bucket
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      // Detect file type
      let fileType = "image";
      if (file.type.startsWith("video/")) fileType = "video";
      else if (file.type.startsWith("audio/")) fileType = "audio";
      else if (file.type.includes("pdf") || file.type.includes("doc") || file.type.includes("xls")) fileType = "document";

      // Insert metadata in media table
      const { error: insertError } = await supabase
        .from("media")
        .insert({
          url: data.publicUrl,
          name: file.name,
          folder: bucket,
          type: fileType,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onChange(data.publicUrl);
      setIsOpen(false);
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

  const isVideoFile = (url: string) => {
    return (
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".mov") ||
      url.includes("/video/") ||
      url.includes("video")
    );
  };

  return (
    <div className="space-y-2">
      {label && <label className="label-luxury">{label}</label>}
      
      {value ? (
        <div className="relative group border border-ink-800 bg-ink-900 overflow-hidden aspect-video max-h-48 flex items-center justify-center">
          {isVideoFile(value) ? (
            <video src={value} className="h-full w-full object-cover animate-fade-in" muted loop autoPlay playsInline />
          ) : (
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-ink-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              Choose from Library
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="btn-outline text-xs border-red-500/50 hover:bg-red-500/10 text-red-400 py-1.5 px-3"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="border border-dashed border-ink-800 hover:border-gold-400/50 bg-ink-950/40 hover:bg-ink-900/50 p-6 flex flex-col items-center justify-center space-y-2 w-full transition-all duration-300 group"
        >
          <div className="p-3 bg-ink-900 border border-ink-800 group-hover:border-gold-400/20 group-hover:text-gold-400 transition-colors">
            <ImageIcon size={20} className="text-ink-400 group-hover:text-gold-400" />
          </div>
          <span className="text-sm font-light text-ink-300 group-hover:text-gold-400">Choose from Media Library</span>
          <span className="text-xs text-ink-500">Or upload a new asset directly</span>
        </button>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-ink-950 border border-ink-800 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-ink-800 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-ink-50">Media Library Picker</h3>
                <p className="text-xs text-ink-400">Select an existing asset or upload a new one to {bucket}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-ink-400 hover:text-gold-400 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar: Folder Filter */}
              <div className="w-48 border-r border-ink-800 p-4 space-y-1 overflow-y-auto hidden sm:block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 block mb-2">Folders</span>
                {folders.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFolder(f)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs transition-colors rounded ${
                      activeFolder === f
                        ? "bg-gold-400/10 text-gold-400 font-medium"
                        : "text-ink-300 hover:bg-ink-900"
                    }`}
                  >
                    <Folder size={14} className={activeFolder === f ? "text-gold-400" : "text-ink-500"} />
                    <span className="capitalize">{f}</span>
                  </button>
                ))}
              </div>

              {/* Central Grid */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Actions Bar */}
                <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-ink-950/80">
                  <div className="relative w-full sm:max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search files..."
                      className="input-luxury pl-9 py-1.5 text-xs"
                    />
                  </div>

                  {/* Tiny Quick Upload */}
                  <label className="btn-primary text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
                    <Upload size={14} />
                    {uploading ? "Uploading..." : "Upload New File"}
                    <input
                      type="file"
                      accept={accept}
                      onChange={(e) => {
                        if (e.target.files) handleUploadFiles(e.target.files);
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Media Grid / Dropzone */}
                <div
                  className="flex-1 overflow-y-auto p-4 relative"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {dragActive && (
                    <div className="absolute inset-0 bg-gold-400/5 border-2 border-dashed border-gold-400/40 z-50 flex flex-col items-center justify-center gap-2">
                      <Upload className="text-gold-400 animate-bounce" size={32} />
                      <span className="text-sm text-gold-400 font-light">Drop file to upload instantly</span>
                    </div>
                  )}

                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                      {filteredItems.map((item) => {
                        const isSelected = value === item.url;
                        const isVideo = item.type === "video" || isVideoFile(item.url);

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              onChange(item.url);
                              setIsOpen(false);
                            }}
                            className={`group relative aspect-square border overflow-hidden cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? "border-gold-400 ring-2 ring-gold-400/20"
                                : "border-ink-800 hover:border-ink-700 bg-ink-900/50"
                            }`}
                          >
                            {isVideo ? (
                              <div className="w-full h-full relative bg-ink-950 flex items-center justify-center">
                                <Film size={32} className="text-gold-400/60" />
                                <div className="absolute bottom-2 left-2 right-2 bg-ink-950/80 p-1 text-[9px] font-mono text-ink-300 truncate rounded">
                                  {item.name || "Video"}
                                </div>
                              </div>
                            ) : (
                              <img src={item.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            )}

                            {/* Badge */}
                            <span className="absolute top-1 right-1 bg-ink-950/70 text-[8px] font-mono text-ink-400 px-1 py-0.5 rounded uppercase">
                              {item.folder || "gallery"}
                            </span>

                            {/* Selected Tick */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-gold-400/10 flex items-center justify-center">
                                <div className="bg-gold-400 text-ink-950 p-1 rounded-full">
                                  <Check size={16} strokeWidth={3} />
                                </div>
                              </div>
                            )}

                            {/* Name Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end h-1/2">
                              <span className="text-[10px] text-ink-100 truncate font-mono">{item.name || "Unnamed"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Folder className="text-ink-600 mb-2" size={32} />
                      <p className="text-xs text-ink-400 font-mono">No files found in folder: /{activeFolder}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-ink-800 flex justify-end gap-3 bg-ink-950">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-outline text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
