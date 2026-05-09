import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, Star } from "lucide-react";
import { getLocalizedText } from "@/lib/utils";
import type { Tour } from "@/types";
import AdminTourActions from "./AdminTourActions";

export default async function AdminToursPage() {
  const supabase = await createAdminClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tours</h2>
          <p className="text-sm text-gray-500">{tours?.length ?? 0} total tours</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> New Tour
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Tour</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Duration</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tours?.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  No tours yet. <Link href="/admin/tours/new" className="text-primary-700 hover:underline">Create one</Link>
                </td>
              </tr>
            ) : (
              tours?.map((tour: Tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-gray-900">
                      {getLocalizedText(tour.title, "en")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{tour.slug}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="capitalize text-sm text-gray-600">{tour.category}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{tour.duration_days}d</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        tour.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {tour.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {tour.is_published ? "Live" : "Draft"}
                      </span>
                      {tour.is_featured && (
                        <Star className="w-3.5 h-3.5 text-secondary-DEFAULT fill-secondary-DEFAULT" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tours/${tour.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <AdminTourActions tourId={tour.id} isPublished={tour.is_published} isFeatured={tour.is_featured} />
                    </div>
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
