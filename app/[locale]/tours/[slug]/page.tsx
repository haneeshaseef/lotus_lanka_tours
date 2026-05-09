import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import InquiryForm from "@/components/public/InquiryForm";
import TourCard from "@/components/public/TourCard";
import TourTabs from "./TourTabs";
import { getTourBySlug, getApprovedReviews, getRelatedTours } from "@/lib/supabase/queries";
import { getLocalizedText, formatPrice } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import { Clock, Users, TrendingUp, Star } from "lucide-react";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return { title: "Tour Not Found" };
  const title = getLocalizedText(tour.title, locale as Locale);
  const desc = tour.meta_description ? getLocalizedText(tour.meta_description, locale as Locale) : "";
  return {
    title: `${title} – Lotus Lanka Tours`,
    description: desc,
    openGraph: { images: tour.cover_image_url ? [tour.cover_image_url] : [] },
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const [reviews, related] = await Promise.all([
    getApprovedReviews(tour.id).catch(() => []),
    getRelatedTours(tour.category, tour.id).catch(() => []),
  ]);

  const l = locale as Locale;
  const title = getLocalizedText(tour.title, l);
  const description = getLocalizedText(tour.description, l);
  const config = CATEGORY_CONFIG[tour.category];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94XXXXXXXXX";
  const waMsg = encodeURIComponent(`Hi, I'm interested in the tour: ${title}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: title,
    description: description,
    image: tour.cover_image_url,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tours/${slug}`,
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-16 min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-80 lg:h-[500px]">
          <Image
            src={tour.cover_image_url || "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
              <nav className="text-white/70 text-sm mb-3">
                <span>Home</span> / <span>Tours</span> / <span className="text-white">{title}</span>
              </nav>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${config.className}`}>
                {config.label}
              </span>
              <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-white">{title}</h1>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left column */}
            <div className="flex-1 min-w-0">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Clock, label: t("duration_label"), value: `${tour.duration_days} ${t("days")}` },
                  { icon: Users, label: t("groupSize"), value: `${tour.max_group_size} ${t("maxGuests")}` },
                  { icon: TrendingUp, label: t("difficulty_label"), value: tour.difficulty ?? "—" },
                  {
                    icon: Star,
                    label: "Rating",
                    value: reviews.length ? `${avgRating.toFixed(1)} (${reviews.length})` : "No reviews yet",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <Icon className="w-5 h-5 text-primary-700 mb-1" />
                    <p className="text-xs text-muted">{label}</p>
                    <p className="font-semibold text-sm text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <TourTabs
                tour={tour}
                locale={l}
                description={description}
                reviews={reviews}
                t={{
                  overview: t("overview"),
                  itinerary: t("itinerary"),
                  includes: t("includes"),
                  reviewsTab: t("reviews"),
                  included: t("included"),
                  excluded: t("excluded"),
                  dayLabel: t("dayLabel"),
                }}
              />

              {/* Related Tours */}
              {related.length > 0 && (
                <section className="mt-16">
                  <h2 className="font-playfair text-2xl font-bold mb-6">{t("relatedTours")}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {related.map((r) => (
                      <TourCard key={r.id} tour={r} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                  {tour.price_per_person && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs text-muted mb-1">{t("pricePerPerson")}</p>
                      <p className="font-playfair text-3xl font-bold text-primary-700">
                        {formatPrice(tour.price_per_person)}
                      </p>
                    </div>
                  )}
                  {tour.price_private && (
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-1">{t("privatePrice")}</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatPrice(tour.price_private)}
                      </p>
                    </div>
                  )}
                  <h3 className="font-semibold text-base mb-4">{t("inquiryFormTitle")}</h3>
                  <InquiryForm
                    tourId={tour.id}
                    tourName={title}
                  />
                  <a
                    href={`https://wa.me/${waNumber}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
                  >
                    <span>💬</span> {t("whatsapp")}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

