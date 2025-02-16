import { useLoaderData } from "@remix-run/react";
import type { Blog } from "~/types"; // Ensure you have a Blog type defined

const BlogList = () => {
  const blogs = useLoaderData<Blog[]>() || []; // Ensure blogs is always an array

  if (!Array.isArray(blogs)) {
    console.error("Expected blogs to be an array but got:", blogs);
    return <p>Error loading blogs</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white p-4 rounded-lg shadow">
          <img
            src={blog.imageUrl}
            alt={blog.name}
            className="w-full h-48 object-cover rounded"
          />
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
