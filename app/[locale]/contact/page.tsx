import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import InquiryForm from "@/components/public/InquiryForm";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: `${t("title")} – Lotus Lanka Tours` };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;

  const googleMapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.1213!2d79.8612!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNiJOIDc5wrA1MSc0MC4zIkU!5e0!3m2!1sen!2slk!4v1234567890";

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94XXXXXXXXX";

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        <div className="bg-primary-700 py-16 px-4 text-center">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/80 text-lg">
            We&apos;d love to help plan your perfect Sri Lanka adventure
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inquiry Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="font-playfair text-2xl font-bold mb-6">Send an Inquiry</h2>
              <InquiryForm />
            </div>

            {/* Contact Info + Map */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-playfair text-2xl font-bold mb-6">Contact Details</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-0.5">Address</p>
                      <p className="text-sm text-muted">32 Galle Road, Colombo 03, Sri Lanka</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-0.5">Phone</p>
                      <a href="tel:+94112345678" className="text-sm text-primary-700 hover:underline">
                        +94 11 234 5678
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-0.5">Email</p>
                      <a href="mailto:hello@lotuslankatours.com" className="text-sm text-primary-700 hover:underline">
                        hello@lotuslankatours.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-green-600 font-bold text-sm">W</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm mb-0.5">WhatsApp</p>
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        Chat with us on WhatsApp
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lotus Lanka Tours Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
