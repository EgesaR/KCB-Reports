import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

type PostData = {
  id?: string; // Optional since Prisma can generate IDs
  title: string;
  content: string;
  blogId: string;
};

// 🔄 Fetch blogs & posts
export const loader: LoaderFunction = async () => {
  try {
    // Fetch all blogs for selection
    const blogs = await prisma.blog.findMany({
      select: { id: true, name: true },
    });

    // Fetch all posts with blog names
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        blogId: true,
        blog: {
          select: { name: true },
        },
      },
    });

    return json({
      blogs,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.content.substring(0, 150) + "...", // Short preview
        url: `/blogs/${post.blogId}/posts/${post.id}`, // Link to post
        author: post.blog.name, // Blog name as author
      })),
    });
  } catch (error: any) {
    console.error("❌ Error fetching data:", error.message);
    return json({ error: "Failed to fetch data" }, { status: 500 });
  }
};

// 📝 Handle post creation
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Extract values
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const blogId = formData.get("blogId") as string;

    if (!title || !content || !blogId) {
      return json({ error: "All fields are required!" }, { status: 400 });
    }

    // ✅ Ensure blogId exists before creating a post
    const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blogExists) {
      return json({ error: "Selected blog does not exist!" }, { status: 400 });
    }

    // ✅ Create a new post
    const newPost = await prisma.post.create({
      data: { title, content, blogId },
    });

    return redirect(`/posts/${newPost.id}`);
  } catch (error) {
    console.error("❌ Prisma error:", error);
    return json({ error: "Failed to create post" }, { status: 500 });
  }
};
