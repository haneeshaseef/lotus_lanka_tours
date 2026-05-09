import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, LocalizedText } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(amount: number, currency = "LKR"): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLocalizedText(
  field: LocalizedText | null | undefined,
  locale: Locale
): string {
  if (!field) return "";
  return field[locale] || field.en || "";
}

export function formatDate(dateStr: string, locale: Locale = "en"): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    si: "si-LK",
    ta: "ta-LK",
  };
  return new Date(dateStr).toLocaleDateString(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function generateExcerpt(html: string, maxLength = 150): string {
  const text = html.replace(/<[^>]+>/g, "");
  return truncateText(text, maxLength);
}
