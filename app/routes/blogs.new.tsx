import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/api.blogs";
import BlogList from "~/components/BlogList";
import CreateBlog from "~/components/CreateBlog";
import type { Blog } from "~/types";

export { loader };

const BlogsPage = () => {
  const blogs = useLoaderData<Blog[]>(); // ✅ Fetch blogs correctly

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      <CreateBlog />
      <h2 className="text-2xl font-semibold mt-10 mb-4">Latest Blogs</h2>
      <BlogList blogs={blogs} /> {/* ✅ Pass blogs data */}
    </div>
  );
};

export default BlogsPage;
