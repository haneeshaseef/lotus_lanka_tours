import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import BlogCard from "@/components/public/BlogCard";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/supabase/queries";
import { getLocalizedText, formatDate, estimateReadTime } from "@/lib/utils";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  const title = getLocalizedText(post.title, locale as Locale);
  const desc = post.meta_description ? getLocalizedText(post.meta_description, locale as Locale) : "";
  return {
    title: `${title} – Lotus Lanka Tours Blog`,
    description: desc,
    openGraph: { images: post.cover_image_url ? [post.cover_image_url] : [] },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const l = locale as Locale;
  const title = getLocalizedText(post.title, l);
  const content = getLocalizedText(post.content, l);
  const readTime = estimateReadTime(content);

  const { posts: related } = await getPublishedBlogPosts({ category: post.category ?? undefined, limit: 3 })
    .then(({ posts }) => ({ posts: posts.filter((p) => p.id !== post.id).slice(0, 3) }))
    .catch(() => ({ posts: [] }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: post.cover_image_url,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.created_at,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${slug}`,
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lotuslankatours.com";
  const shareUrl = `${siteUrl}/${locale}/blog/${slug}`;

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-16 min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-64 lg:h-96">
          <Image
            src={post.cover_image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
            <div className="max-w-3xl mx-auto">
              {post.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-secondary-DEFAULT text-white text-xs font-semibold mb-3">
                  {post.category}
                </span>
              )}
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-white leading-tight">{title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted mb-8 pb-8 border-b border-gray-200">
            <span>By <strong>{post.author}</strong></span>
            <span>·</span>
            <span>{formatDate(post.created_at, l)}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-playfair prose-a:text-primary-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Share this article:</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
              >
                𝕏 / Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="font-playfair text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
