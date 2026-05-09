"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock, Users, TrendingUp, Heart, ArrowRight } from "lucide-react";
import { cn, getLocalizedText, formatPrice } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import type { Tour, Locale } from "@/types";
import { useState } from "react";

export default function TourCard({ tour }: { tour: Tour }) {
  const t = useTranslations("tours");
  const locale = useLocale() as Locale;
  const config = CATEGORY_CONFIG[tour.category];
  const title = getLocalizedText(tour.title, locale);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.cover_image_url || "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <span
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm",
            config.className
          )}
        >
          {config.label}
        </span>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
            wishlisted
              ? "bg-red-500 text-white scale-110"
              : "bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white"
          )}
          aria-label="Wishlist"
        >
          <Heart className={cn("w-4 h-4", wishlisted ? "fill-white" : "")} />
        </button>
        {tour.is_featured && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-white shadow-md">
            ✦ Featured
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-playfair text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration_days} {tour.duration_days === 1 ? t("day") : t("days")}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {tour.max_group_size} {t("maxGuests")}
          </span>
          {tour.difficulty && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {t(tour.difficulty)}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            {tour.price_per_person && (
              <div>
                <span className="text-xs text-muted">{t("from")}</span>
                <p className="text-2xl font-bold text-primary-700 leading-tight">
                  {formatPrice(tour.price_per_person)}
                </p>
                <span className="text-xs text-muted">{t("perPerson")}</span>
              </div>
            )}
          </div>
          <Link
            href={`/tours/${tour.slug}` as "/"}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium transition-all duration-200 hover:gap-2.5 shadow-sm hover:shadow-md"
          >
            {t("viewDetails")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
