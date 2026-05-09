import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogForm from "../../BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Post</h2>
      <BlogForm post={post} />
    </div>
  );
}
