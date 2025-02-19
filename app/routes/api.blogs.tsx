import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

// 🚀 Loader: Fetch all blogs
export const loader: LoaderFunction = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        name: true, // Matches "title" in frontend
        description: true,
        imageUrl: true, // Matches "urlToImage" in frontend
        selfLink: true, // Matches "url" in frontend
        publishedAt: true,
        updatedAt: true,
      },
    });

    // Transform backend response to match frontend expectations
    const formattedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.name, // Adjusting naming for UI compatibility
      description: blog.description,
      url: blog.selfLink,
      urlToImage: blog.imageUrl,
      author: "Unknown", // Prisma doesn't track authors, use default
      publishedAt: blog.publishedAt.toISOString(),
    }));

    return json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
};

// 🚀 Action: Create a new blog
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl");
    const selfLink = formData.get("selfLink");
    const publishedAt = formData.get("publishedAt");

    if (!name || !description || !imageUrl || !selfLink || !publishedAt) {
      return json({ error: "All fields are required" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        name: String(name),
        description: String(description),
        imageUrl: String(imageUrl),
        selfLink: String(selfLink),
        publishedAt: new Date(String(publishedAt)),
        updatedAt: new Date(),
      },
    });

    return json({
      id: blog.id,
      title: blog.name,
      description: blog.description,
      url: blog.selfLink,
      urlToImage: blog.imageUrl,
      author: "Unknown",
      publishedAt: blog.publishedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return json({ error: "Failed to create blog" }, { status: 500 });
  }
};
