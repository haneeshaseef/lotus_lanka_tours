"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";

export default function ReviewApproveButton({ id, isApproved }: { id: string; isApproved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    setLoading(true);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  };

  const del = async () => {
    if (!confirm("Delete this review?")) return;
    setLoading(true);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => patch({ is_approved: !isApproved })}
        disabled={loading}
        title={isApproved ? "Unapprove" : "Approve"}
        className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
          isApproved
            ? "bg-green-50 text-green-700 hover:bg-green-100"
            : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
        }`}
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={() => patch({ is_approved: false })}
        disabled={loading || !isApproved}
        title="Reject"
        className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
      >
        <X className="w-4 h-4" />
      </button>
      <button
        onClick={del}
        disabled={loading}
        title="Delete"
        className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
