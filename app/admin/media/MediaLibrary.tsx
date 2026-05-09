"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import type { Media } from "@/types";

export default function MediaLibrary({ initialMedia }: { initialMedia: Media[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));

    const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { uploaded } = await res.json();
      setMedia((prev) => [...uploaded, ...prev]);
      router.refresh();
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary-300 transition-colors mb-6"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {uploading ? "Uploading…" : "Drop images here or click to upload"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP – max 10 MB each</p>
      </div>

      {/* Grid */}
      {media.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-12">No media uploaded yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {media.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
              <div className="aspect-square relative">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item.url)}
                  title="Copy URL"
                  className="p-2 rounded-lg bg-white/90 hover:bg-white text-gray-700 transition-colors"
                >
                  {copied === item.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                  className="p-2 rounded-lg bg-white/90 hover:bg-white text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 truncate px-2 py-1.5">{item.filename}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
