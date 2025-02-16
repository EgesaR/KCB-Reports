import { loader } from "~/routes/api.blogs";
import BlogList from "~/components/BlogList";
import CreateBlog from "~/components/CreateBlog";

export { loader };

const BlogsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      <CreateBlog />
      <h2 className="text-2xl font-semibold mt-10 mb-4">Latest Blogs</h2>
      <BlogList />
    </div>
  );
};

export default BlogsPage;
