import { prisma } from "~/utils/prisma.server";
import { nanoid } from "nanoid"; // For generating a unique slug

export async function createPost(
  title: string,
  content: string,
  blogId: string,
  author: string
) {
  // Ensure blogId exists before creating a post
  const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blogExists) {
    throw new Error("Selected blog does not exist!");
  }

  return await prisma.post.create({
    data: {
      title,
      content,
      blogId,
      author,
      slug: nanoid(10), // Generate a unique slug
      publishedAt: new Date(), // Default to now
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "published", // Default status
    },
  });
}

// Fetch all posts
export async function getPosts() {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      blogId: true,
    },
  });
}
