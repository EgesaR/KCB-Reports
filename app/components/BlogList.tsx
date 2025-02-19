import type { Blog } from "~/types";

interface BlogListProps {
  blogs?: Blog[]; // ✅ Make blogs optional
}

const BlogList: React.FC<BlogListProps> = ({ blogs = [] }) => {
  // ✅ Default to empty array
  if (blogs.length === 0) {
    return <p className="text-gray-500">No blogs found.</p>; // ✅ Handle empty state
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white p-4 rounded-lg shadow">
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.name}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <h2 className="text-xl font-semibold">{blog.name}</h2>
          <p>{blog.description}</p>
          <a href={blog.selfLink} className="text-blue-500 hover:underline">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
