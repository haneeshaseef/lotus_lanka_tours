import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lotuslankatours.com";
const LOCALES = ["en", "si", "ta"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: tours }, { data: posts }] = await Promise.all([
    supabase.from("tours").select("slug, updated_at").eq("is_published", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
  ]);

  const staticRoutes = ["/", "/tours", "/blog", "/gallery", "/about", "/contact", "/build-your-tour"];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.8,
    }))
  );

  const tourEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    (tours ?? []).map((tour) => ({
      url: `${SITE_URL}/${locale}/tours/${tour.slug}`,
      lastModified: new Date(tour.updated_at ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.9,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    (posts ?? []).map((post) => ({
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at ?? Date.now()),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...tourEntries, ...blogEntries];
}
