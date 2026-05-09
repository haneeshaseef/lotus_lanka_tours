import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import InquiryStatusSelect from "./InquiryStatusSelect";

export default async function AdminInquiriesPage() {
  const supabase = await createAdminClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Inquiries</h2>
        <p className="text-sm text-gray-500">{inquiries?.length ?? 0} total</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Contact</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Tour</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Travel Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {!inquiries?.length ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No inquiries yet</td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-gray-900">{inq.name}</p>
                    <p className="text-xs text-gray-500">{inq.email}</p>
                    {inq.phone && <p className="text-xs text-gray-400">{inq.phone}</p>}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{inq.tour_name_text ?? "General"}</p>
                    {inq.guests && <p className="text-xs text-gray-400">{inq.guests} guests</p>}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-600">{inq.travel_date ?? "—"}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-400">{formatDate(inq.created_at)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <InquiryStatusSelect id={inq.id} status={inq.status} />
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
