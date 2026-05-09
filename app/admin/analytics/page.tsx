import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { getLocalizedText } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const supabase = await createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { data: inquiryByStatus },
    { data: recentInquiries },
    { data: topTours },
    { data: inquiryTrend },
  ] = await Promise.all([
    supabase.from("inquiries").select("status"),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("tours").select("id, title, category, is_published, is_featured"),
    supabase.from("inquiries")
      .select("created_at, status")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  const statusCounts: Record<string, number> = {};
  inquiryByStatus?.forEach((i: { status: string }) => {
    statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1;
  });

  const dailyCounts: Record<string, number> = {};
  inquiryTrend?.forEach((i: { created_at: string }) => {
    const day = i.created_at.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
  });
  const trendDays = Object.entries(dailyCounts).slice(-14);
  const maxCount = Math.max(...trendDays.map(([, c]) => c), 1);

  return (
    <div className="space-y-8">
      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-5">
        {["new", "replied", "closed"].map((status) => (
          <div key={status} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{statusCounts[status] ?? 0}</p>
            <p className="text-sm text-gray-500 capitalize mt-1">{status} inquiries</p>
          </div>
        ))}
      </div>

      {/* Inquiry trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Inquiries — Last 14 Days</h2>
        <div className="flex items-end gap-1 h-40">
          {trendDays.length === 0 ? (
            <p className="text-gray-400 text-sm">No data</p>
          ) : (
            trendDays.map(([day, count]) => (
              <div key={day} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full bg-primary-200 rounded-t-sm"
                  style={{ height: `${(count / maxCount) * 120}px` }}
                  title={`${day}: ${count}`}
                />
                <p className="text-xs text-gray-400 -rotate-45 origin-top-left transform w-6 truncate">
                  {day.slice(5)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tours overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Tours</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {topTours?.map((tour: { id: string; title: unknown; category: string; is_published: boolean; is_featured: boolean }) => (
            <div key={tour.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getLocalizedText(tour.title as Parameters<typeof getLocalizedText>[0], "en")}
                </p>
                <p className="text-xs text-gray-400 capitalize">{tour.category}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${tour.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {tour.is_published ? "Live" : "Draft"}
                </span>
                {tour.is_featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {recentInquiries?.map((inq: { id: string; name: string; email: string; tour_name_text?: string; status: string; created_at: string }) => (
            <div key={inq.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{inq.name}</p>
                <p className="text-xs text-gray-400">{inq.tour_name_text ?? "General"} · {formatDate(inq.created_at)}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                inq.status === "new" ? "bg-blue-100 text-blue-700" :
                inq.status === "replied" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {inq.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
