import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Post</h2>
      <BlogForm />
    </div>
  );
}
