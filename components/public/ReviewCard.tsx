import { Star } from "lucide-react";
import type { Review } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
      <span className="absolute top-2 right-4 text-6xl font-serif text-primary-100 leading-none select-none">&ldquo;</span>
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-primary-700 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            {review.reviewer_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{review.reviewer_name}</p>
            {review.reviewer_country && (
              <p className="text-xs text-muted flex items-center gap-0.5">
                <span>🌍</span> {review.reviewer_country}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "fill-secondary text-secondary"
                  : "text-gray-200 fill-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed italic relative">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
      <p className="text-xs text-muted mt-3">{formatDate(review.created_at)}</p>
    </div>
  );
}
