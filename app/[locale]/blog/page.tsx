import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import BlogCard from "@/components/public/BlogCard";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: `${t("title")} – Lotus Lanka Tours` };
}

const BLOG_CATEGORIES = ["All", "Travel Tips", "Destinations", "Culture", "Wildlife", "Food & Dining", "Honeymoon"];

export default async function BlogPage({ params, searchParams }: PageProps) {
  await params;
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const { posts, count } = await getPublishedBlogPosts({
    category: sp.category,
    page,
    limit: 12,
  }).catch(() => ({ posts: [], count: 0 }));

  const totalPages = Math.ceil(count / 12);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background">
        <div className="bg-primary-700 py-16 px-4 text-center">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-3">
            Travel Stories &amp; Tips
          </h1>
          <p className="text-white/80 text-lg">Inspiration for your Sri Lanka adventure</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = (cat === "All" && !sp.category) || sp.category === cat;
              return (
                <Link
                  key={cat}
                  href={`/blog${cat !== "All" ? `?category=${encodeURIComponent(cat)}` : ""}` as "/"}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-700 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/blog?${new URLSearchParams({ ...sp, page: String(page - 1) }).toString()}` as "/"}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                    >
                      ← Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link
                      key={i}
                      href={`/blog?${new URLSearchParams({ ...sp, page: String(i + 1) }).toString()}` as "/"}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        page === i + 1
                          ? "bg-primary-700 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/blog?${new URLSearchParams({ ...sp, page: String(page + 1) }).toString()}` as "/"}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">📝</p>
              <h3 className="font-playfair text-xl font-bold mb-2">No articles found</h3>
              <Link href="/blog" className="text-primary-700 text-sm hover:underline">View all posts</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
