"use client";

import { useState } from "react";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  tourId: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export default function AdminTourActions({ tourId, isPublished, isFeatured }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    setLoading(true);
    await fetch(`/api/admin/tours/${tourId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  };

  const del = async () => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/tours/${tourId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => patch({ is_published: !isPublished })}
        disabled={loading}
        title={isPublished ? "Unpublish" : "Publish"}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
      >
        {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        onClick={() => patch({ is_featured: !isFeatured })}
        disabled={loading}
        title={isFeatured ? "Unfeature" : "Feature"}
        className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 ${
          isFeatured ? "text-secondary-DEFAULT" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Star className={`w-4 h-4 ${isFeatured ? "fill-secondary-DEFAULT" : ""}`} />
      </button>
      <button
        onClick={del}
        disabled={loading}
        title="Delete"
        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
