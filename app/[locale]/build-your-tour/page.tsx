import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import TourBuilderForm from "@/components/public/TourBuilderForm";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "buildTour" });
  return { title: `${t("title")} – Lotus Lanka Tours` };
}

export default async function BuildYourTourPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        <div
          className="relative py-20 px-4 text-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-primary-700/75" />
          <div className="relative z-10">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">
              Build Your Own Tour
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Tell us your dream and we&apos;ll make it a reality
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-16">
          <TourBuilderForm />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
