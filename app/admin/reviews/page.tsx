import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";
import ReviewApproveButton from "./ReviewApproveButton";

export default async function AdminReviewsPage() {
  const supabase = await createAdminClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });

  const pending = reviews?.filter((r) => !r.is_approved).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        <p className="text-sm text-gray-500">{pending} pending approval</p>
      </div>

      <div className="space-y-3">
        {!reviews?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
            No reviews yet
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm shrink-0">
                    {review.reviewer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{review.reviewer_name}</p>
                    <p className="text-xs text-gray-400">
                      {review.reviewer_country && `${review.reviewer_country} · `}
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-secondary-DEFAULT text-secondary-DEFAULT" : "fill-gray-100 text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                )}
                <p className="text-xs text-primary-600 mt-2">
                  Tour: {typeof review.tours?.title === "string" ? review.tours.title : (review.tours?.title as { en?: string })?.en ?? "—"}
                </p>
              </div>
              <ReviewApproveButton id={review.id} isApproved={review.is_approved} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
