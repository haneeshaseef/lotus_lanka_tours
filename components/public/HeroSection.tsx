"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "cultural", label: "Cultural & Heritage" },
  { value: "wildlife", label: "Wildlife & Safari" },
  { value: "beach", label: "Beach & Coastal" },
  { value: "adventure", label: "Adventure & Trekking" },
  { value: "daytrip", label: "Day Trips" },
  { value: "multiday", label: "Multi-day Packages" },
];

export default function HeroSection() {
  const t = useTranslations("hero");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    router.push(`/tours${params.toString() ? `?${params}` : ""}` as "/");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1586094685419-a8a7bb527a68?w=1920')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-16 animate-fade-in">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-secondary-200 text-sm font-medium mb-6 backdrop-blur-sm shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
          Discover the Pearl of the Indian Ocean
        </span>
        <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          {t("headline")}
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subheadline")}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            href="/tours"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-primary-700 hover:bg-primary-600 text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl"
          >
            {t("exploreTours")}
          </Link>
          <Link
            href="/build-your-tour"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base transition-all backdrop-blur-sm"
          >
            {t("planTrip")}
          </Link>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-5"
        >
          <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            {/* Text input */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-11 pr-4 py-4 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 my-3" />
            <div className="sm:hidden h-px bg-gray-100 mx-4" />

            {/* Category select */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none h-full w-full sm:w-44 pl-4 pr-9 py-4 bg-transparent text-gray-700 text-sm outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-4 bg-primary-700 hover:bg-primary-600 text-white font-semibold text-sm transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t("searchBtn")}</span>
            </button>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-white/60 text-xs">Popular:</span>
            {["Cultural Tours", "Wildlife Safari", "Beach Escapes", "Day Trips"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearch(tag)}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white/80 hover:text-white text-xs transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Stats strip — in flow, below search */}
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { value: "500+", label: "Tours Completed" },
            { value: "4.9★", label: "Average Rating" },
            { value: "98%", label: "Happy Travelers" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center shadow-lg"
            >
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  );
}
