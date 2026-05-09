import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  tour_id: z.string().uuid().optional(),
  tour_name_text: z.string().optional(),
  travel_date: z.string().optional(),
  guests: z.number().min(1).max(50).default(1),
  message: z.string().optional(),
  locale: z.string().default("en"),
});

export type InquiryFormData = z.input<typeof inquirySchema>;

export const reviewSchema = z.object({
  tour_id: z.string().uuid(),
  reviewer_name: z.string().min(2, "Name must be at least 2 characters"),
  reviewer_country: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const customTourStep1Schema = z.object({
  destinations: z.array(z.string()).min(1, "Select at least one destination"),
  travel_date: z.string().optional(),
  duration_days: z.number().min(1).max(21).default(7),
  guests: z.number().min(1).max(50).default(2),
});

export const customTourStep2Schema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  budget_tier: z.enum(["budget", "mid-range", "luxury"]).optional(),
  budget_lkr: z.number().optional(),
});

export const customTourStep3Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  special_requests: z.string().optional(),
});

export const customTourSchema = customTourStep1Schema
  .merge(customTourStep2Schema)
  .merge(customTourStep3Schema);

export type CustomTourFormData = z.infer<typeof customTourSchema>;

// Admin schemas
export const tourFormSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title_en: z.string().min(1, "English title is required"),
  title_si: z.string().optional().default(""),
  title_ta: z.string().optional().default(""),
  description_en: z.string().min(1, "English description is required"),
  description_si: z.string().optional().default(""),
  description_ta: z.string().optional().default(""),
  category: z.enum(["cultural", "wildlife", "beach", "adventure", "daytrip", "multiday"]),
  duration_days: z.number().min(1),
  max_group_size: z.number().min(1),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  price_per_person: z.number().optional(),
  price_private: z.number().optional(),
  cover_image_url: z.string().optional(),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  meta_title_en: z.string().optional(),
  meta_title_si: z.string().optional(),
  meta_title_ta: z.string().optional(),
  meta_description_en: z.string().optional(),
  meta_description_si: z.string().optional(),
  meta_description_ta: z.string().optional(),
});

export type TourFormData = z.infer<typeof tourFormSchema>;

export const blogFormSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title_en: z.string().min(1, "English title is required"),
  title_si: z.string().optional().default(""),
  title_ta: z.string().optional().default(""),
  content_en: z.string().min(1, "English content is required"),
  content_si: z.string().optional().default(""),
  content_ta: z.string().optional().default(""),
  cover_image_url: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().default("Lotus Lanka Tours"),
  is_published: z.boolean().default(false),
  meta_title_en: z.string().optional(),
  meta_description_en: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
