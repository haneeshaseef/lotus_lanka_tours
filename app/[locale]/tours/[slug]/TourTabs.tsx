"use client";

import { useState } from "react";
import { cn, getLocalizedText } from "@/lib/utils";
import ReviewCard from "@/components/public/ReviewCard";
import ReviewForm from "@/components/public/ReviewForm";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import type { Tour, Review, Locale } from "@/types";

interface Props {
  tour: Tour;
  locale: Locale;
  description: string;
  reviews: Review[];
  t: {
    overview: string;
    itinerary: string;
    includes: string;
    reviewsTab: string;
    included: string;
    excluded: string;
    dayLabel: string;
  };
}

export default function TourTabs({ tour, locale, description, reviews, t }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "includes" | "reviews">("overview");
  const [openDay, setOpenDay] = useState<number | null>(0);

  const tabs = [
    { key: "overview" as const, label: t.overview },
    { key: "itinerary" as const, label: t.itinerary },
    { key: "includes" as const, label: t.includes },
    { key: "reviews" as const, label: `${t.reviewsTab} (${reviews.length})` },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-primary-700 text-primary-700"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="prose max-w-none text-gray-600 leading-relaxed tab-content">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      {/* Itinerary */}
      {activeTab === "itinerary" && (
        <div className="space-y-3 tab-content">
          {tour.itinerary.length === 0 ? (
            <p className="text-muted text-sm">No itinerary available.</p>
          ) : (
            tour.itinerary.map((day, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenDay(openDay === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-sm font-bold flex items-center justify-center shrink-0">
                      {day.day}
                    </span>
                    <span className="font-medium text-foreground">
                      {t.dayLabel} {day.day}: {getLocalizedText(day.title, locale)}
                    </span>
                  </div>
                  {openDay === i ? (
                    <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                  )}
                </button>
                {openDay === i && (
                  <div className="px-5 pb-5 pt-2 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {getLocalizedText(day.description, locale)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Includes/Excludes */}
      {activeTab === "includes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 tab-content">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> {t.included}
            </h3>
            <ul className="space-y-2">
              {tour.includes.length > 0 ? (
                tour.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-muted text-sm">—</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" /> {t.excluded}
            </h3>
            <ul className="space-y-2">
              {tour.excludes.length > 0 ? (
                tour.excludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-muted text-sm">—</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-6 tab-content">
          {reviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
          <ReviewForm tourId={tour.id} />
        </div>
      )}
    </div>
  );
}
