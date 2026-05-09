"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tourId: string;
}

export default function ReviewForm({ tourId }: Props) {
  const t = useTranslations("tours");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tour_id: tourId, reviewer_name: name, reviewer_country: country, rating, comment }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle className="w-12 h-12 text-primary-700 mb-3" />
        <p className="text-sm text-gray-600">{t("reviewPending")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-playfair text-xl font-bold text-foreground">{t("leaveReview")}</h4>

      {/* Star rating */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform duration-150 hover:scale-125 focus:outline-none"
          >
            <Star
              className={cn(
                "w-8 h-8 transition-colors duration-150",
                (hover || rating) >= star
                  ? "fill-secondary text-secondary drop-shadow-sm"
                  : "text-gray-200 fill-gray-200"
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted">
          {hover > 0 ? ["Poor", "Fair", "Good", "Great", "Excellent"][hover - 1] : ["Poor", "Fair", "Good", "Great", "Excellent"][rating - 1]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("reviewerName")} *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("reviewerCountry")}</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("comment")} *</label>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 disabled:hover:scale-100"
      >
        {submitting ? "Submitting..." : t("submitReview")}
      </button>
    </form>
  );
}
