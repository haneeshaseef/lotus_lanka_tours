import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { getLocalizedText, formatDate, estimateReadTime, generateExcerpt } from "@/lib/utils";
import type { BlogPost, Locale } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const locale = useLocale() as Locale;
  const title = getLocalizedText(post.title, locale);
  const content = getLocalizedText(post.content, locale);
  const excerpt = generateExcerpt(content, 140);
  const readTime = estimateReadTime(content);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.cover_image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {post.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-700/90 text-white backdrop-blur-sm shadow-sm">
            {post.category}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(post.created_at, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        <h3 className="font-playfair text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{excerpt}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
              {post.author?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-muted">{post.author}</span>
          </div>
          <Link
            href={`/blog/${post.slug}` as "/"}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-600 transition-all duration-200 hover:gap-2"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
