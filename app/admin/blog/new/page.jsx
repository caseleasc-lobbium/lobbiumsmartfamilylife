import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-3xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-5 px-1">Neuer Artikel</h1>
      <BlogForm />
    </div>
  );
}
