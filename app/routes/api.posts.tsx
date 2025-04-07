import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createPost } from "~/utils/post.server";
import { prisma } from "~/utils/prisma.server";

export const loader: LoaderFunction = async () => {
  const posts = await prisma.post.findMany({
    include: {
      categories: { select: { name: true } },
      blog: { select: { name: true } },
    },
  });
  return json({ posts });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  try {
    const post = await createPost({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      blogId: formData.get("blogId") as string,
      author: formData.get("author") as string,
      categories: (formData.get("categories") as string)?.split(",") || [],
    });

    return redirect(`/posts/${post.slug}`);
  } catch (error) {
    return json({ error: "Failed to create post" }, { status: 500 });
  }
};

// Component remains the same
