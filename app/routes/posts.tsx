import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server"; // Utility for DB access

export const loader = async () => {
  const posts = await prisma.post.findMany();
  return json(posts);
};

export default function Posts() {
  const posts = useLoaderData<typeof loader>() ?? [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Blog Posts</h1>
      {posts.length === 0 && <p>No posts yet!</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border p-2 my-2 rounded-md">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

