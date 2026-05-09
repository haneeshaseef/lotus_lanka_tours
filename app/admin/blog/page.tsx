import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { getLocalizedText, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export default async function AdminBlogPage() {
  const supabase = await createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500">{posts?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Title</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Author</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {!posts?.length ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  No posts yet. <Link href="/admin/blog/new" className="text-primary-700 hover:underline">Create one</Link>
                </td>
              </tr>
            ) : (
              posts.map((post: BlogPost) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-gray-900">{getLocalizedText(post.title, "en")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{post.author}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1 w-fit text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors inline-flex"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
