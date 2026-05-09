import { getDashboardStats } from "@/lib/supabase/queries";
import { MessageSquare, Map, Star, ClipboardList, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getDashboardStats().catch(() => ({
    totalTours: 0, publishedTours: 0, totalInquiries: 0, newInquiries: 0,
    totalCustomRequests: 0, newCustomRequests: 0, pendingReviews: 0, totalReviews: 0,
    recentInquiries: [], topTours: [],
  }));

  const cards = [
    {
      title: "Total Tours",
      value: stats.totalTours,
      sub: `${stats.publishedTours} published`,
      icon: Map,
      color: "bg-blue-50 text-blue-700",
      href: "/admin/tours",
    },
    {
      title: "Inquiries",
      value: stats.totalInquiries,
      sub: `${stats.newInquiries} new`,
      icon: MessageSquare,
      color: "bg-green-50 text-green-700",
      href: "/admin/inquiries",
    },
    {
      title: "Custom Requests",
      value: stats.totalCustomRequests,
      sub: `${stats.newCustomRequests} new`,
      icon: ClipboardList,
      color: "bg-orange-50 text-orange-700",
      href: "/admin/custom-requests",
    },
    {
      title: "Reviews",
      value: stats.totalReviews,
      sub: `${stats.pendingReviews} pending`,
      icon: Star,
      color: "bg-purple-50 text-purple-700",
      href: "/admin/reviews",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.color} bg-opacity-20 flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentInquiries.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No inquiries yet</p>
            ) : (
              stats.recentInquiries.map((inquiry: { id: string; name: string; email: string; tour_name_text?: string; created_at: string; status: string }) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{inquiry.name}</p>
                    <p className="text-xs text-gray-500">{inquiry.tour_name_text ?? "General"}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inquiry.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : inquiry.status === "replied"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Tours */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Tours</h2>
            <Link href="/admin/tours" className="text-sm text-primary-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.topTours.length === 0 ? (
              <p className="p-5 text-sm text-gray-400 text-center">No tours yet</p>
            ) : (
              stats.topTours.map((tour: { id: string; title: { en: string; si?: string; ta?: string } | string; inquiry_count?: number; category: string }) => (
                <div key={tour.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {typeof tour.title === "string" ? tour.title : tour.title.en}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{tour.category}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary-700">
                    {tour.inquiry_count ?? 0} inquiries
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
