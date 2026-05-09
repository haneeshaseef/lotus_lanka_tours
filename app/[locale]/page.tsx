import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/public/HeroSection";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import TourCard from "@/components/public/TourCard";
import ReviewCard from "@/components/public/ReviewCard";
import { Link } from "@/i18n/navigation";
import { getFeaturedTours, getApprovedReviews, getAllMedia } from "@/lib/supabase/queries";
import { CATEGORY_CONFIG } from "@/types";
import { ArrowRight, Shield, Compass, HeadphonesIcon, Leaf } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: "Lotus Lanka Tours – " + t("headline"),
    description: t("subheadline"),
  };
}

const CATEGORY_ICONS: Record<string, string> = {
  cultural: "🏛️",
  wildlife: "🐘",
  beach: "🌊",
  adventure: "🏔️",
  daytrip: "🌅",
  multiday: "✈️",
};

const PILLARS = [
  { icon: Shield, key: "guides" as const },
  { icon: Compass, key: "tailor" as const },
  { icon: HeadphonesIcon, key: "support" as const },
  { icon: Leaf, key: "eco" as const },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  const [featuredTours, reviews, media] = await Promise.all([
    getFeaturedTours().catch(() => []),
    getApprovedReviews().catch(() => []),
    getAllMedia().catch(() => []),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Featured Tours */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedHeadings />
            {featuredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted">
                <p>No featured tours yet. Check back soon!</p>
              </div>
            )}
            <div className="text-center mt-10">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white font-semibold text-sm transition-all"
              >
                View All Tours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 bg-accent/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoriesHeadings />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <Link
                  key={key}
                  href={`/tours?category=${key}` as "/"}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white hover:bg-primary-700 border border-gray-100 hover:border-primary-700 shadow-sm hover:shadow-lg transition-all text-center"
                >
                  <span className="text-3xl">{CATEGORY_ICONS[key]}</span>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-white leading-tight">
                    {config.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WhyUsHeadings />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PILLARS.map(({ icon: Icon, key }) => (
                <PillarCard key={key} icon={Icon} pillarKey={key} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {reviews.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <TestimonialsHeadings />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Build Your Tour Banner */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-primary-700/80" />
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
            <BuildBannerContent />
          </div>
        </section>

        {/* Gallery Strip */}
        {media.length > 0 && (
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <GalleryHeadings />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {media.slice(0, 6).map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/gallery" className="text-sm font-medium text-primary-700 hover:text-primary-600 transition-colors">
                  View Full Gallery →
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

// Client components for translations
function FeaturedHeadings() {
  const t = useTranslations("home");
  return (
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">{t("featuredTours")}</h2>
      <p className="text-muted max-w-xl mx-auto">{t("featuredSubtitle")}</p>
    </div>
  );
}

function CategoriesHeadings() {
  const t = useTranslations("home");
  return (
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">{t("categories")}</h2>
      <p className="text-muted max-w-xl mx-auto">{t("categoriesSubtitle")}</p>
    </div>
  );
}

function WhyUsHeadings() {
  const t = useTranslations("home");
  return (
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">{t("whyUs")}</h2>
      <p className="text-muted max-w-xl mx-auto">{t("whyUsSubtitle")}</p>
    </div>
  );
}

function PillarCard({ icon: Icon, pillarKey }: { icon: typeof Shield; pillarKey: "guides" | "tailor" | "support" | "eco" }) {
  const t = useTranslations("pillars");
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-accent/50 border border-primary-100">
      <div className="w-14 h-14 rounded-full bg-primary-700 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{t(`${pillarKey}`)}</h3>
      <p className="text-sm text-muted">{t(`${pillarKey}Desc`)}</p>
    </div>
  );
}

function TestimonialsHeadings() {
  const t = useTranslations("home");
  return (
    <div className="text-center mb-12">
      <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">{t("testimonials")}</h2>
      <p className="text-muted max-w-xl mx-auto">{t("testimonialsSubtitle")}</p>
    </div>
  );
}

function BuildBannerContent() {
  const t = useTranslations("home");
  return (
    <>
      <h2 className="font-playfair text-4xl font-bold text-white mb-4">{t("buildBanner")}</h2>
      <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t("buildBannerDesc")}</p>
      <Link
        href="/build-your-tour"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary-DEFAULT hover:bg-secondary-600 text-white font-bold text-base transition-all shadow-xl"
      >
        {t("buildBannerCta")} <ArrowRight className="w-4 h-4" />
      </Link>
    </>
  );
}

function GalleryHeadings() {
  const t = useTranslations("home");
  return (
    <div className="text-center mb-10">
      <h2 className="font-playfair text-4xl font-bold text-foreground mb-3">{t("gallery")}</h2>
    </div>
  );
}
