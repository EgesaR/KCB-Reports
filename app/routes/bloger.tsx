import { useState, useEffect, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface Blog {
  source: { name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const API_KEY = "e97ea8687df74e1188db5e4eb525c07c";
const API_URL = `https://newsapi.org/v2/everything?q=Apple&from=2025-02-15&sortBy=popularity&apiKey=${API_KEY}`;

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const categories = [
    "For You",
    "Research",
    "Training",
    "New",
    "Education",
    "Creative",
  ];

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setBlogs(data.articles))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchResults(
      query
        ? blogs.filter(
            (blog) =>
              blog.title.toLowerCase().includes(query) ||
              blog.author?.toLowerCase().includes(query)
          )
        : []
    );
  };

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-neutral-950 dark:text-neutral-400 px-2 pb-8 pt-16 sm:px-10 sm:pt-0">
      <div className="flex flex-row justify-between gap-4 mt-7 items-center">
        <h1 className="text-5xl font-semibold text-slate-600 dark:text-white">
          Blogs
        </h1>
        <SearchBox
          onSearch={handleSearch}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </div>
      <InterestTabs
        categories={categories}
        blogs={searchResults.length ? searchResults : blogs}
      />
    </div>
  );
};

const SearchBox = ({
  onSearch,
  isFocused,
  setIsFocused,
}: {
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  setIsFocused: (focus: boolean) => void;
}) => (
  <div className="bg-neutral-100 dark:bg-neutral-800 w-[25%] pt-1 rounded-lg">
    <div className="flex items-center h-10 gap-2 px-2 pb-1">
      <HiOutlineMagnifyingGlass className="size-6 text-[#555] dark:text-slate-300" />
      <input
        type="text"
        placeholder="Search blogs or authors"
        className="w-full bg-transparent text-[#333] placeholder:text-[#555] h-full px-2 border-0 outline-none focus:outline-none dark:text-neutral-300 dark:placeholder:text-neutral-400"
        autoComplete="off"
        onChange={onSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 700)}
      />
    </div>
  </div>
);

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

const BlogGrid = ({ blogs }: { blogs?: Blog[] }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No blogs found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {blogs.map((blog, idx) => (
        <BlogCard key={idx} blog={blog} />
      ))}
    </div>
  );
};


interface Blog {
  source: { name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  topics?: string[]; // Added topics field
}

const BlogCard = ({ blog }: { blog: Blog }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
    <img
      src={blog.urlToImage}
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

      {/* Display Topics */}
      {blog.topics && blog.topics.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {blog.topics.map((topic, idx) => (
            <span
              key={idx}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-2 block"
      >
        Read more
      </a>
    </div>
  </div>
);


export default Blogs;
