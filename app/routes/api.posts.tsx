import {
  type ActionFunction,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

type PostData = {
  id?: string; // Optional since Prisma can generate IDs
  title: string;
  content: string;
  blogId: string;
};

export const loader: LoaderFunction = async () => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        blogId: true,
        blog: {
          select: {
            name: true, // Blog name
          },
        },
      },
    });

    return json(
      posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.content.substring(0, 150) + "...", // Short preview
        url: `/blogs/${post.blogId}/posts/${post.id}`, // Link to post
        author: post.blog.name, // Blog name as author
      }))
    );
  } catch (error: any) {
    console.error("❌ Error fetching posts:", error.message);
    return json({ error: "Failed to fetch posts" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.json();
    console.log("📥 Received Data:", formData);

    if (!formData || !formData.posts) {
      return json({ error: "Invalid data" }, { status: 400 });
    }

    // ✅ Use create() in a loop instead of createMany()
    const createdPosts = await Promise.all(
      formData.posts.map(({ id, title, content, blogId } : PostData) =>
        prisma.post.create({
          data: {
            id,
            title,
            content,
            blogId,
          },
        })
      )
    );

    return json({ message: "✅ Posts created", count: createdPosts.length });
  } catch (error) {
    console.error("❌ Prisma error:", error);
    return json({ error: "Failed to create posts" }, { status: 500 });
  }
};




