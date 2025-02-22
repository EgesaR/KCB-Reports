import { json, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { blogId } = params;
    if (!blogId) {
      return json({ error: "Blog ID is required" }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        selfLink: true,
        publishedAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedAt: true,
            categories: { select: { name: true } },
          },
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    if (!blog) {
      return json({ error: "Blog not found" }, { status: 404 });
    }

    const formattedBlog = {
      id: blog.id,
      title: blog.name,
      description: blog.description,
      url: blog.selfLink || "",
      urlToImage: blog.imageUrl || "",
      author: "Unknown",
      publishedAt: blog.publishedAt.toISOString(),
      posts: blog.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        publishedAt: post.publishedAt.toISOString(),
        categories: post.categories.map((cat) => cat.name),
      })),
    };

    return json(formattedBlog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return json({ error: "Failed to fetch blog" }, { status: 500 });
  }
};
