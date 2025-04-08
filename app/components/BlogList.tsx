import type { Blog } from "~/types/blog";

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <article key={blog.id} className="border p-4 rounded-lg">
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-auto mb-2"
            />
          )}
          <h2 className="text-xl font-bold">{blog.title}</h2>
          <p className="text-gray-600">
            By {blog.author} - {new Date(blog.publishedAt).toLocaleDateString()}
          </p>
          <p className="mt-2">{blog.description}</p>
        </article>
      ))}
    </div>
  );
}
