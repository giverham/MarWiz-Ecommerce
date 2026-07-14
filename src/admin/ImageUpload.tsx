import { useState } from "react";
import { Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ImageUploadProps {
  bucket: string;
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  bucket,
  value = "",
  onChange,
  onUpload,
  onRemove,
  accept = "image/*",
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (typeof onChange === "function") onChange(data.publicUrl);
      if (typeof onUpload === "function") onUpload(data.publicUrl);
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const isVideo = accept.includes("video") || (value ? (
    value.endsWith(".mp4") ||
    value.endsWith(".webm") ||
    value.endsWith(".mov") ||
    value.endsWith(".ogg") ||
    value.includes("/video/") ||
    value.includes("video")
  ) : false);

  return (
    <div className="space-y-2">
      {label && <label className="label-luxury">{label}</label>}
      {value ? (
        <div className="relative group border border-ink-800 bg-ink-900 overflow-hidden aspect-video max-h-48 flex items-center justify-center">
          {isVideo ? (
            <video src={value} className="h-full w-full object-cover animate-fade-in" muted loop autoPlay playsInline />
          ) : (
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-ink-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
            <label className="btn-primary text-xs cursor-pointer py-1.5 px-3 flex items-center gap-1">
              Replace
              <input type="file" accept={accept} onChange={handleChange} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => {
                if (typeof onChange === "function") onChange("");
                if (typeof onUpload === "function") onUpload("");
                if (typeof onRemove === "function") onRemove();
              }}
              className="btn-outline text-xs border-red-500/50 hover:bg-red-500/10 text-red-400 py-1.5 px-3"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-none p-6 text-center transition-colors duration-300 ${
            dragActive
              ? "border-gold-400 bg-gold-400/5"
              : "border-ink-800 hover:border-ink-700 bg-ink-900/50"
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-ink-900 border border-ink-800">
              <Upload size={20} className={uploading ? "animate-bounce text-gold-400" : "text-ink-400"} />
            </div>
            <div className="text-sm">
              <span className="text-gold-400 hover:underline">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-ink-500">
              {uploading ? "Uploading, please wait..." : (accept.includes("video") ? "MP4, WEBM, MOV, OGG" : "JPG, PNG, WEBP, AVIF, SVG")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductGalleryUploadProps {
  bucket: string;
  images: string[];
  onChange: (urls: string[]) => void;
}

export function ProductGalleryUpload({
  bucket,
  images,
  onChange,
}: ProductGalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUploadFiles = async (files: FileList) => {
    try {
      setUploading(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
      onChange([...images, ...newUrls]);
    } catch (err: any) {
      alert("Error uploading images: " + err.message);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  const setFeatured = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [featured] = updated.splice(index, 1);
    updated.unshift(featured);
    onChange(updated);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="label-luxury">Product Gallery</label>
      
      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((img, idx) => (
            <div key={idx} className="group relative aspect-square border border-ink-800 bg-ink-900 overflow-hidden">
              <img src={img} alt="" className="h-full w-full object-cover" />
              
              {/* Badge for Featured */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-gold-400 text-ink-950 font-display text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 z-10">
                  Featured
                </span>
              )}
              
              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 bg-ink-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 p-2 text-center">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => setFeatured(idx)}
                    className="text-xs text-gold-400 hover:underline mb-1"
                  >
                    Set Featured
                  </button>
                )}
                <div className="flex gap-2">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "left")}
                      className="text-ink-300 hover:text-gold-400 bg-ink-900 border border-ink-800 p-1 flex items-center justify-center w-6 h-6"
                    >
                      <ArrowLeft size={12} />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "right")}
                      className="text-ink-300 hover:text-gold-400 bg-ink-900 border border-ink-800 p-1 flex items-center justify-center w-6 h-6"
                    >
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-xs text-red-400 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-none p-6 text-center transition-colors duration-300 ${
          dragActive
            ? "border-gold-400 bg-gold-400/5"
            : "border-ink-800 hover:border-ink-700 bg-ink-900/50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-ink-900 border border-ink-800">
            <Upload size={20} className={uploading ? "animate-bounce text-gold-400" : "text-ink-400"} />
          </div>
          <div className="text-sm">
            <span className="text-gold-400 hover:underline">Click to upload multiple</span> or drag and drop
          </div>
          <p className="text-xs text-ink-500">
            {uploading ? "Uploading images..." : "JPG, PNG, WEBP, AVIF, SVG (Single or Multiple)"}
          </p>
        </div>
      </div>
    </div>
  );
}
