import { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import wordsToColors from "~/lib/colorGen";
import { loader } from "~/routes/api.blogs.$blogId";

// Define a type for your blog data
export interface BlogData {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  posts: Posts[]
  // add other properties if needed
}

export interface Posts {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  categories: { name: string } [];
}

// Dynamic meta function: data is the loader's return value
export const meta: MetaFunction = ({ data }) => {
  // Use a fallback title in case data is not available
  const title = (data as BlogData)?.title || "Default Blog Title";
  return [
    {
      title: title,
      description: "Welcome to KCB Reports!",
    },
  ];
};

export { loader };

// Component: Renders the blog details on the page
export default function BlogDetail() {
  const blog = useLoaderData<BlogData>();
  console.log("Blog: ", blog)
  return (
    <div>
      <div className="relative bg-purple-600 text-white pt-[20rem] pb-8 px-8 flex flex-col justify-center">
        <img
          src={blog.urlToImage}
          alt={blog.title}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative z-10 text-neutral-100">
          <h1 className="text-7xl font-semibold">{blog.title}</h1>
          <h2 className="text-3xl font-semibold mt-2">{blog.description}</h2>
        </div>
      </div>
      {/* Posts Section */}
      <section className="mt-10 px-4">
        <h2 className="text-3xl font-bold mb-8 text-neutral-100">All blog posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blog.posts.map((post: Posts) => (
            <Link
              key={post.id}
              to={`/blogs/${blog.id}/posts/${post.id}`}
              className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Published on {new Date(post.publishedAt).toDateString()}
                </div>
                <div className="mt-2">
                  {post.categories.map((cat) => (
                    <span
                      key={cat.name}
                      className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/*<div>
      <h1>{blog.title}</h1>
      <img src={blog.urlToImage} alt={blog.title} />
      <p>{blog.description}</p>
      <a href={blog.url}>Visit blog</a>
      <p>Published at: {blog.publishedAt}</p>
    </div>*/
