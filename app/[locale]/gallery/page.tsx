"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Media } from "@/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [media, setMedia] = useState<Media[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then(setMedia)
      .catch(() => setMedia([]));
  }, []);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setLightbox((i) => (i !== null && i < media.length - 1 ? i + 1 : i));

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        <div className="bg-primary-700 py-16 px-4 text-center">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">{t("title")}</h1>
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {media.length === 0 ? (
            <div className="text-center py-24 text-muted">
              <p className="text-4xl mb-4">🖼️</p>
              <p>Gallery coming soon!</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {media.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(i)}
                  className="break-inside-avoid relative overflow-hidden rounded-xl cursor-pointer group"
                >
                  <Image
                    src={item.url}
                    alt={item.filename}
                    width={400}
                    height={300}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightbox !== null && media[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center lightbox-overlay"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <Image
              src={media[lightbox].url}
              alt={media[lightbox].filename}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </>
  );
}
