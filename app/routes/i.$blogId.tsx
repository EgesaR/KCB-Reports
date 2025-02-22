import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  categories: { name: string }[];
};


export const loader: LoaderFunction = async ({ params }) => {
  const blog = await prisma.blog.findUnique({
    where: { id: params.blogId },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          publishedAt: true,
          categories: { select: { name: true } }, // Fetch categories
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!blog) {
    throw new Response("Blog not found", { status: 404 });
  }

  return json(blog);
};

export default function BlogDetail() {
  const blog = useLoaderData<typeof loader>();

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Blog Header */}
      <div className="relative bg-purple-600 text-white pt-56 pb-8 px-8 flex flex-col justify-center">
        <img
          src={blog.imageUrl}
          alt={blog.name}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="relative z-10 text-neutral-100">
          <h1 className="text-6xl font-bold">{blog.name}</h1>
          <p className="text-2xl mt-2">{blog.description}</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
          {blog.posts.map((post : BlogPost) => (
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
      </div>
    </div>
  );
}
