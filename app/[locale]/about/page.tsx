import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: `${t("title")} – Lotus Lanka Tours` };
}

const TEAM = [
  { name: "Ravi Perera", role: "Founder & CEO", emoji: "👨‍💼" },
  { name: "Anoma Silva", role: "Head of Operations", emoji: "👩‍💼" },
  { name: "Kasun Fernando", role: "Lead Tour Guide", emoji: "🧭" },
  { name: "Dilani Jayawardena", role: "Customer Relations", emoji: "🌸" },
];

const VALUES = [
  { icon: "🌿", title: "Sustainability", desc: "We operate with deep respect for Sri Lanka's natural environment and local communities." },
  { icon: "🤝", title: "Authenticity", desc: "Every experience we curate is genuine, rooted in local culture and traditions." },
  { icon: "⭐", title: "Excellence", desc: "We set the highest standards for quality, safety, and customer satisfaction." },
  { icon: "❤️", title: "Passion", desc: "Our love for Sri Lanka drives everything we do — from planning to on-ground support." },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <div
          className="relative py-32 px-4 text-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-primary-700/80" />
          <div className="relative z-10">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">
              About Lotus Lanka Tours
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Passionate about Sri Lanka, dedicated to you
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <div className="w-16 h-1 bg-secondary-DEFAULT mx-auto" />
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Founded in 2010, Lotus Lanka Tours was born from a simple yet powerful vision — to share the extraordinary beauty and cultural richness of Sri Lanka with the world, while ensuring that tourism benefits local communities.
              </p>
              <p>
                What began as a small family operation in Colombo has grown into one of Sri Lanka&apos;s most trusted boutique travel companies, serving thousands of travellers from over 50 countries annually.
              </p>
              <p>
                Our team of passionate, licensed local guides brings unparalleled knowledge and authentic insights to every journey. We believe that the best way to experience Sri Lanka is through the eyes of those who call it home.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-accent/30 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed italic">
              &ldquo;To create transformative travel experiences that connect people with the soul of Sri Lanka, while preserving its natural heritage for generations to come.&rdquo;
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-3">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-3">Meet the Team</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-4xl mx-auto mb-3">
                    {member.emoji}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                  <p className="text-xs text-muted mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-2xl font-bold mb-8">Certifications &amp; Awards</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {["🏆 Sri Lanka Tourism Board Licensed", "🌿 Eco-Certified Operator", "⭐ TripAdvisor Certificate of Excellence", "🌍 Responsible Tourism Award 2023"].map((cert) => (
                <span key={cert} className="px-5 py-2.5 rounded-full bg-accent border border-primary-200 text-primary-700 text-sm font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
