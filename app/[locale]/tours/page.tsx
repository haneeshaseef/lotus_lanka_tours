import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import TourCard from "@/components/public/TourCard";
import { getPublishedTours } from "@/lib/supabase/queries";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import type { TourCategory } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return { title: `${t("title")} – Lotus Lanka Tours` };
}

const CATEGORIES: { value: TourCategory | ""; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "cultural", label: "Cultural & Heritage" },
  { value: "wildlife", label: "Wildlife & Safari" },
  { value: "beach", label: "Beach & Coastal" },
  { value: "adventure", label: "Adventure & Trekking" },
  { value: "daytrip", label: "Day Trips" },
  { value: "multiday", label: "Multi-day Packages" },
];

const DIFFICULTIES = [
  { value: "", label: "Any Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "challenging", label: "Challenging" },
];

const DURATIONS = [
  { value: "", label: "Any Duration" },
  { value: "1", label: "1 Day" },
  { value: "2", label: "2 Days" },
  { value: "3", label: "3 Days" },
  { value: "4", label: "4–7 Days" },
  { value: "8", label: "8+ Days" },
];

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; duration?: string; search?: string; page?: string }>;
}

export default async function ToursPage({ params, searchParams }: PageProps) {
  await params;
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const { tours, count } = await getPublishedTours({
    category: sp.category,
    duration: sp.duration ? parseInt(sp.duration) : undefined,
    search: sp.search,
    page,
    limit: 12,
  }).catch(() => ({ tours: [], count: 0 }));

  const totalPages = Math.ceil(count / 12);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary-700 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">
              Explore Our Tours
            </h1>
            <p className="text-white/80 text-lg">Discover Sri Lanka&apos;s finest experiences</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Filter Tours</h3>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    {CATEGORIES.map((cat) => (
                      <label key={cat.value} className="flex items-center gap-2 mb-1.5 cursor-pointer group">
                        <Link
                          href={`/tours?${new URLSearchParams({
                            ...(cat.value ? { category: cat.value } : {}),
                            ...(sp.search ? { search: sp.search } : {}),
                          }).toString()}` as "/"}
                          className={`text-sm transition-colors ${
                            sp.category === cat.value || (!sp.category && !cat.value)
                              ? "text-primary-700 font-semibold"
                              : "text-gray-600 hover:text-primary-700"
                          }`}
                        >
                          {cat.label}
                        </Link>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    {DIFFICULTIES.map((d) => (
                      <label key={d.value} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <Link
                          href={`/tours?${new URLSearchParams({
                            ...(sp.category ? { category: sp.category } : {}),
                            ...(d.value ? { difficulty: d.value } : {}),
                            ...(sp.search ? { search: sp.search } : {}),
                          }).toString()}` as "/"}
                          className={`text-sm transition-colors ${
                            sp.duration === d.value
                              ? "text-primary-700 font-semibold"
                              : "text-gray-600 hover:text-primary-700"
                          }`}
                        >
                          {d.label}
                        </Link>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    {DURATIONS.map((d) => (
                      <label key={d.value} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <Link
                          href={`/tours?${new URLSearchParams({
                            ...(sp.category ? { category: sp.category } : {}),
                            ...(d.value ? { duration: d.value } : {}),
                            ...(sp.search ? { search: sp.search } : {}),
                          }).toString()}` as "/"}
                          className={`text-sm transition-colors ${
                            sp.duration === d.value
                              ? "text-primary-700 font-semibold"
                              : "text-gray-600 hover:text-primary-700"
                          }`}
                        >
                          {d.label}
                        </Link>
                      </label>
                    ))}
                  </div>

                  {(sp.category || sp.duration || sp.search) && (
                    <Link
                      href="/tours"
                      className="block text-center text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear Filters
                    </Link>
                  )}
                </form>
              </div>
            </aside>

            {/* Tours Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted">
                  {count} tour{count !== 1 ? "s" : ""} found
                </p>
              </div>

              {tours.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {page > 1 && (
                        <Link
                          href={`/tours?${new URLSearchParams({ ...sp, page: String(page - 1) }).toString()}` as "/"}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                        >
                          ← Previous
                        </Link>
                      )}
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <Link
                          key={i}
                          href={`/tours?${new URLSearchParams({ ...sp, page: String(i + 1) }).toString()}` as "/"}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            page === i + 1
                              ? "bg-primary-700 text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </Link>
                      ))}
                      {page < totalPages && (
                        <Link
                          href={`/tours?${new URLSearchParams({ ...sp, page: String(page + 1) }).toString()}` as "/"}
                          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Next →
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl">
                    🌴
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground mb-2">No tours found</h3>
                  <p className="text-muted text-sm mb-6">Try adjusting your filters to find the perfect tour.</p>
                  <Link
                    href="/tours"
                    className="px-6 py-2.5 rounded-full bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
