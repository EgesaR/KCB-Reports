import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

type PostDetail = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  blog: { id: string; name: string };
  categories: { name: string }[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    select: {
      id: true,
      title: true,
      content: true,
      publishedAt: true,
      blog: { select: { name: true, id: true } },
      categories: { select: { name: true } },
    },
  });

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json(post);
};

export default function PostDetail() {
  const post = useLoaderData<PostDetail>(); // ✅ FIXED TYPE ERROR

  return (
    <div></div>
  );
}

/*
<div className="max-w-3xl mx-auto p-8">
      <h1 className="text-5xl font-bold">{post.title}</h1>
      <p className="text-gray-500 text-sm mt-2">
        Published on {new Date(post.publishedAt).toDateString()}
      </p>
      <div className="mt-4">
        {post.categories.map((cat) => (
          <span
            key={cat.name}
            className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2"
          >
            {cat.name}
          </span>
        ))}
      </div>
      <div className="mt-6 text-lg leading-relaxed">{post.content}</div>

      <div className="mt-10">
        <a
          href={`/blogs/${post.blog.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to {post.blog.name}
        </a>
      </div>
    </div>
*/