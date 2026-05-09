import { createClient } from "./server";
import type { Tour, BlogPost, Review, Media, Inquiry, CustomTourRequest } from "@/types";

// ── Tours ──────────────────────────────────────────────────────────────
export async function getPublishedTours(params?: {
  category?: string;
  duration?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ tours: Tour[]; count: number }> {
  const supabase = await createClient();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("tours")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (params?.category) query = query.eq("category", params.category);
  if (params?.duration) query = query.eq("duration_days", params.duration);
  if (params?.search) {
    query = query.or(
      `title->>'en'.ilike.%${params.search}%,description->>'en'.ilike.%${params.search}%`
    );
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { tours: (data as Tour[]) ?? [], count: count ?? 0 };
}

export async function getFeaturedTours(): Promise<Tour[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;
  return (data as Tour[]) ?? [];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as Tour;
}

export async function getRelatedTours(
  category: string,
  excludeId: string
): Promise<Tour[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", excludeId)
    .limit(3);
  if (error) throw error;
  return (data as Tour[]) ?? [];
}

// Admin
export async function getAllTours(): Promise<Tour[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Tour[]) ?? [];
}

export async function getTourById(id: string): Promise<Tour | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Tour;
}

// ── Blog Posts ─────────────────────────────────────────────────────────
export async function getPublishedBlogPosts(params?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: BlogPost[]; count: number }> {
  const supabase = await createClient();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (params?.category) query = query.eq("category", params.category);
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: (data as BlogPost[]) ?? [], count: count ?? 0 };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as BlogPost;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BlogPost[]) ?? [];
}

// ── Reviews ────────────────────────────────────────────────────────────
export async function getApprovedReviews(tourId?: string): Promise<Review[]> {
  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (tourId) query = query.eq("tour_id", tourId);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Review[]) ?? [];
}

export async function getAllReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Review[]) ?? [];
}

// ── Media ──────────────────────────────────────────────────────────────
export async function getAllMedia(): Promise<Media[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) throw error;
  return (data as Media[]) ?? [];
}

// ── Inquiries ──────────────────────────────────────────────────────────
export async function getAllInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Inquiry[]) ?? [];
}

// ── Custom Tour Requests ───────────────────────────────────────────────
export async function getAllCustomRequests(): Promise<CustomTourRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custom_tour_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as CustomTourRequest[]) ?? [];
}

// ── Analytics ──────────────────────────────────────────────────────────
export async function getInquiryStats(days = 30) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("inquiries")
    .select("created_at, tour_id, status")
    .gte("created_at", since.toISOString());

  if (error) throw error;
  return data ?? [];
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [tours, published, allInquiries, newInquiries, allCustom, newCustom, allReviews, pendingReviews, recentInquiriesRes, topToursRes] =
    await Promise.all([
      supabase.from("tours").select("id", { count: "exact", head: true }),
      supabase.from("tours").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("inquiries").select("id", { count: "exact", head: true }),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
      supabase.from("custom_tour_requests").select("id", { count: "exact", head: true }),
      supabase.from("custom_tour_requests").select("id", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("inquiries").select("id, name, email, tour_name_text, status, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("tours").select("id, title, category").eq("is_published", true).limit(5),
    ]);

  return {
    totalTours: tours.count ?? 0,
    publishedTours: published.count ?? 0,
    totalInquiries: allInquiries.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
    totalCustomRequests: allCustom.count ?? 0,
    newCustomRequests: newCustom.count ?? 0,
    totalReviews: allReviews.count ?? 0,
    pendingReviews: pendingReviews.count ?? 0,
    recentInquiries: recentInquiriesRes.data ?? [],
    topTours: topToursRes.data ?? [],
  };
}
