import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import CustomRequestStatusSelect from "./CustomRequestStatusSelect";

export default async function AdminCustomRequestsPage() {
  const supabase = await createAdminClient();
  const { data: requests } = await supabase
    .from("custom_tour_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Custom Tour Requests</h2>
        <p className="text-sm text-gray-500">{requests?.length ?? 0} total</p>
      </div>

      <div className="space-y-3">
        {!requests?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
            No custom tour requests yet
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{req.name}</p>
                  <p className="text-sm text-gray-500">{req.email} {req.phone && `· ${req.phone}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">{formatDate(req.created_at)}</p>
                  <CustomRequestStatusSelect id={req.id} status={req.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Destinations</p>
                  <p className="text-gray-700 text-xs">{(req.destinations as string[])?.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                  <p className="text-gray-700">{req.duration_days ? `${req.duration_days} days` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                  <p className="text-gray-700">{req.travel_date ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Guests</p>
                  <p className="text-gray-700">{req.guests ?? 1}</p>
                </div>
              </div>
              {req.interests && (req.interests as string[]).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(req.interests as string[]).map((i: string) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-xs">{i}</span>
                  ))}
                </div>
              )}
              {req.special_requests && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{req.special_requests}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
