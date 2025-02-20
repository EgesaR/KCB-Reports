import { prisma } from "~/utils/prisma.server";

// Fetch all blogs
export async function getBlogs() {
  return await prisma.blog.findMany({
    select: { id: true, name: true },
  });
}

// Create a new post
export async function createPost(
  title: string,
  content: string,
  blogId: string
) {
  // Ensure blogId exists before creating a post
  const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blogExists) {
    throw new Error("Selected blog does not exist!");
  }

  return await prisma.post.create({
    data: { title, content, blogId },
  });
}
