"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import type { Tour } from "@/types";

const CATEGORIES = ["cultural", "wildlife", "beach", "adventure", "daytrip", "multiday"] as const;
const DIFFICULTIES = ["easy", "moderate", "challenging"] as const;

interface Props {
  tour?: Tour;
}

export default function TourForm({ tour }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title_en: (tour?.title as { en?: string } | undefined)?.en ?? "",
    title_si: (tour?.title as { si?: string } | undefined)?.si ?? "",
    title_ta: (tour?.title as { ta?: string } | undefined)?.ta ?? "",
    description_en: (tour?.description as { en?: string } | undefined)?.en ?? "",
    description_si: (tour?.description as { si?: string } | undefined)?.si ?? "",
    description_ta: (tour?.description as { ta?: string } | undefined)?.ta ?? "",
    slug: tour?.slug ?? "",
    category: tour?.category ?? "cultural",
    duration_days: tour?.duration_days ?? 1,
    max_group_size: tour?.max_group_size ?? 12,
    difficulty: tour?.difficulty ?? "moderate",
    price_per_person: tour?.price_per_person ?? "",
    price_private: tour?.price_private ?? "",
    cover_image_url: tour?.cover_image_url ?? "",
    includes: (tour?.includes ?? []).join("\n"),
    excludes: (tour?.excludes ?? []).join("\n"),
    is_published: tour?.is_published ?? false,
    is_featured: tour?.is_featured ?? false,
  });

  const autoSlug = () => {
    if (!form.slug && form.title_en) {
      setForm((f) => ({ ...f, slug: slugify(f.title_en) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      title: { en: form.title_en, si: form.title_si, ta: form.title_ta },
      description: { en: form.description_en, si: form.description_si, ta: form.description_ta },
      slug: form.slug,
      category: form.category,
      duration_days: Number(form.duration_days),
      max_group_size: Number(form.max_group_size),
      difficulty: form.difficulty,
      price_per_person: form.price_per_person ? Number(form.price_per_person) : null,
      price_private: form.price_private ? Number(form.price_private) : null,
      cover_image_url: form.cover_image_url || null,
      includes: form.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      excludes: form.excludes.split("\n").map((s) => s.trim()).filter(Boolean),
      is_published: form.is_published,
      is_featured: form.is_featured,
    };

    const url = tour ? `/api/admin/tours/${tour.id}` : "/api/admin/tours";
    const method = tour ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/admin/tours");
    router.refresh();
  };

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Titles */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tour Title</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
            <input
              required
              type="text"
              value={form.title_en}
              onBlur={autoSlug}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            />
          </div>
          {field("Title (Sinhala)", "title_si")}
          {field("Title (Tamil)", "title_ta")}
          {field("Slug *", "slug")}
        </div>
      </section>

      {/* Descriptions */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
        {(["description_en", "description_si", "description_ta"] as const).map((key, i) => (
          <div key={key} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {["English", "Sinhala", "Tamil"][i]}
            </label>
            <textarea
              rows={4}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-y"
            />
          </div>
        ))}
      </section>

      {/* Details */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tour Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as typeof form.difficulty })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          {field("Duration (days)", "duration_days", "number")}
          {field("Max Group Size", "max_group_size", "number")}
          {field("Price Per Person (LKR)", "price_per_person", "number")}
          {field("Private Price (LKR)", "price_private", "number")}
        </div>
        <div className="mt-4">
          {field("Cover Image URL", "cover_image_url")}
        </div>
      </section>

      {/* Includes/Excludes */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Inclusions & Exclusions</h3>
        <p className="text-xs text-gray-400 mb-3">One item per line</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Included ✓</label>
            <textarea
              rows={6}
              value={form.includes}
              onChange={(e) => setForm({ ...form, includes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-y"
              placeholder="Hotel pick up&#10;Licensed guide&#10;Entrance fees"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excluded ✗</label>
            <textarea
              rows={6}
              value={form.excludes}
              onChange={(e) => setForm({ ...form, excludes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-y"
              placeholder="Meals&#10;Personal expenses&#10;Tips"
            />
          </div>
        </div>
      </section>

      {/* Publish settings */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Publish Settings</h3>
        <div className="space-y-3">
          {[
            { key: "is_published" as const, label: "Published (visible to public)" },
            { key: "is_featured" as const, label: "Featured (shown on homepage)" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-300"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Saving…" : tour ? "Update Tour" : "Create Tour"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
