import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

// 🛠 Load post data
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json(post);
};

// 📌 Display post content
export default function PostPage() {
  const post = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4">{post.content}</p>
    </div>
  );
}
