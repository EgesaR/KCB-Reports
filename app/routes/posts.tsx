import { json, LoaderFunction } from "@remix-run/node";
import { useFetcher, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { useEffect } from "react";

// 📄 Load all posts
export const loader: LoaderFunction = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      blog: { select: { name: true } },
    },
  });

  return json(posts);
};

export default function Posts() {
  const fetcher =
    useFetcher<{ id: string; title: string; blog: { name: string } }[]>();

  // 🔄 Fetch posts on mount if no data is available
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/posts"); // Fetch data from the same loader endpoint
    }
  }, [fetcher]);

  const posts = fetcher.data || [];

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>

      {/* 🔄 Manual Refresh Button */}
      <button
        onClick={() => fetcher.load("/posts")}
        className="text-blue-500 mb-4"
      >
        Refresh Posts
      </button>

      <Link to="/post/new" className="text-blue-500 block mb-4">
        Create New Post
      </Link>

      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-2 border rounded">
            <Link to={`/posts/${post.id}`} className="text-xl text-blue-500">
              {post.title}
            </Link>
            <p className="text-gray-500">Blog: {post.blog.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
