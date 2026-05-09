"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["new", "in-progress", "quoted", "closed"];

export default function CustomRequestStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrent(newStatus);
    setLoading(true);
    await fetch(`/api/admin/custom-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  const colorMap: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
    quoted: "bg-purple-50 text-purple-700 border-purple-200",
    closed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer outline-none transition-colors disabled:opacity-50 ${colorMap[current] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
