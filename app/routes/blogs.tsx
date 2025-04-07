import { loader } from "~/routes/api.blogs";
import { Link, useLoaderData } from "@remix-run/react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { motion } from "framer-motion";
import SearchBox from "~/components/SearchBox";
import type { Blog } from "~/types/blog";

export { loader };

const Blogs = () => {
  const blogs = useLoaderData<Blog[]>();

  // Ensure blogs is an array before slicing
  const filteredBlogs = Array.isArray(blogs) ? blogs.slice(0, 12) : [];

  return (
    <div className="min-h-screen w-full text-black dark:text-neutral-400 px-2 pb-8 pt-28 sm:px-10 sm:pt-0">
      <div className="flex flex-row justify-between gap-4 mt-24 items-center">
        <h1 className="text-5xl font-semibold text-slate-600 dark:text-white">
          Blogs
        </h1>
        <SearchBox blogs={blogs} />
      </div>
      <InterestTabs
        categories={[
          "For You",
          "Research",
          "Training",
          "New",
          "Education",
          "Creative",
        ]}
        blogs={filteredBlogs}
      />
    </div>
  );
};

const InterestTabs = ({
  categories,
  blogs,
}: {
  categories: string[];
  blogs: Blog[];
}) => (
  <TabGroup className="text-slate-600 dark:text-slate-200 mt-4">
    <TabList className="mb-4 flex-nowrap overflow-x-auto flex noScrollBar">
      {categories.map((category, idx) => (
        <Tab
          key={idx}
          className="px-4 py-2 mr-2 transition duration-300 ease-in-out"
        >
          {category}
        </Tab>
      ))}
    </TabList>
    <TabPanels>
      {categories.map((category, idx) => (
        <TabPanel key={idx}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <BlogGrid blogs={blogs} />
          </motion.div>
        </TabPanel>
      ))}
    </TabPanels>
  </TabGroup>
);

const BlogGrid = ({ blogs }: { blogs: Blog[] }) => {
  if (!Array.isArray(blogs) || blogs.length === 0)
    return <p>No blogs available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

const BlogCard = ({ blog }: { blog: Blog }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
    <img
      src={blog.urlToImage || "/default-image.jpg"} // Use a fallback image
      alt={blog.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-700 dark:text-white">
        {blog.title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        by {blog.author || "Unknown"} -{" "}
        {new Date(blog.publishedAt).toDateString()}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
        {blog.description}
      </p>
      <Link
        to={`${blog.id}`}
        className="text-blue-500 hover:underline mt-2 block"
      >
        Read more
      </Link>
    </div>
  </div>
);

export default Blogs;
