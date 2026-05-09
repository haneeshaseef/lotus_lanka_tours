export type Locale = "en" | "si" | "ta";

export interface LocalizedText {
  en: string;
  si: string;
  ta: string;
}

export interface ItineraryDay {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
}

export type TourCategory =
  | "cultural"
  | "wildlife"
  | "beach"
  | "adventure"
  | "daytrip"
  | "multiday";

export type TourDifficulty = "easy" | "moderate" | "challenging";

export interface Tour {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  category: TourCategory;
  duration_days: number;
  max_group_size: number;
  difficulty: TourDifficulty | null;
  price_per_person: number | null;
  price_private: number | null;
  cover_image_url: string | null;
  gallery_images: string[];
  itinerary: ItineraryDay[];
  includes: string[];
  excludes: string[];
  is_published: boolean;
  is_featured: boolean;
  meta_title: LocalizedText | null;
  meta_description: LocalizedText | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tour_id: string | null;
  tour_name_text: string | null;
  travel_date: string | null;
  guests: number;
  message: string | null;
  status: "new" | "contacted" | "confirmed" | "closed";
  locale: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedText;
  content: LocalizedText;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  author: string;
  is_published: boolean;
  meta_title: LocalizedText | null;
  meta_description: LocalizedText | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  tour_id: string | null;
  reviewer_name: string;
  reviewer_country: string | null;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  bucket: string;
  size_bytes: number | null;
  uploaded_at: string;
}

export interface CustomTourRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destinations: string[];
  duration_days: number | null;
  travel_date: string | null;
  guests: number;
  interests: string[];
  budget_lkr: number | null;
  special_requests: string | null;
  status: "new" | "contacted" | "confirmed" | "closed";
  created_at: string;
}

export interface CategoryBadgeConfig {
  label: string;
  className: string;
}

export const CATEGORY_CONFIG: Record<TourCategory, CategoryBadgeConfig> = {
  cultural: {
    label: "Cultural & Heritage",
    className: "bg-amber-100 text-amber-800",
  },
  wildlife: {
    label: "Wildlife & Safari",
    className: "bg-green-100 text-green-800",
  },
  beach: {
    label: "Beach & Coastal",
    className: "bg-blue-100 text-blue-800",
  },
  adventure: {
    label: "Adventure & Trekking",
    className: "bg-orange-100 text-orange-800",
  },
  daytrip: {
    label: "Day Trips",
    className: "bg-purple-100 text-purple-800",
  },
  multiday: {
    label: "Multi-day Packages",
    className: "bg-rose-100 text-rose-800",
  },
};
