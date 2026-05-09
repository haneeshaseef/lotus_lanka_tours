"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface Props {
  post?: BlogPost;
}

export default function BlogForm({ post }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title_en: (post?.title as { en?: string } | undefined)?.en ?? "",
    title_si: (post?.title as { si?: string } | undefined)?.si ?? "",
    title_ta: (post?.title as { ta?: string } | undefined)?.ta ?? "",
    content_en: (post?.content as { en?: string } | undefined)?.en ?? "",
    content_si: (post?.content as { si?: string } | undefined)?.si ?? "",
    content_ta: (post?.content as { ta?: string } | undefined)?.ta ?? "",
    slug: post?.slug ?? "",
    author: post?.author ?? "Lotus Lanka Team",
    category: post?.category ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    is_published: post?.is_published ?? false,
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
      content: { en: form.content_en, si: form.content_si, ta: form.content_ta },
      slug: form.slug,
      author: form.author,
      category: form.category || null,
      cover_image_url: form.cover_image_url || null,
      is_published: form.is_published,
    };

    const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
    const method = post ? "PATCH" : "POST";

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

    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Title & Slug</h3>
        <div className="space-y-3">
          {(["title_en", "title_si", "title_ta"] as const).map((key, i) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title ({["English", "Sinhala", "Tamil"][i]}) {i === 0 && "*"}
              </label>
              <input
                required={i === 0}
                type="text"
                value={form[key]}
                onBlur={i === 0 ? autoSlug : undefined}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Content (HTML)</h3>
        <p className="text-xs text-gray-400 mb-3">Enter HTML content. Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; tags.</p>
        {(["content_en", "content_si", "content_ta"] as const).map((key, i) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {["English", "Sinhala", "Tamil"][i]} Content {i === 0 && "*"}
            </label>
            <textarea
              required={i === 0}
              rows={8}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-y font-mono text-xs"
            />
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Meta</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "author" as const, label: "Author" },
            { key: "category" as const, label: "Category" },
            { key: "cover_image_url" as const, label: "Cover Image URL" },
          ].map(({ key, label }) => (
            <div key={key} className={key === "cover_image_url" ? "col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
              />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-3 cursor-pointer mt-4">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-300"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
      </section>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Saving…" : post ? "Update Post" : "Create Post"}
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
