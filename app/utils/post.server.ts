// app/utils/post.server.ts
import { prisma } from "~/utils/prisma.server";
import { nanoid } from "nanoid";
import type { Post, CreatePostInput, PostStatus } from "~/types/blog";

export async function createPost(data: CreatePostInput): Promise<Post> {
  const wordCount = data.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const categoryConnections = await Promise.all(
    (data.categories || []).map(async (name) => {
      const trimmedName = name.trim();
      const category = await prisma.category.upsert({
        where: { name: trimmedName },
        create: { name: trimmedName },
        update: {},
      });
      return {
        categoryId: category.id,
        name: trimmedName,
      };
    })
  );

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      blogId: data.blogId,
      author: data.author,
      status: data.status || "DRAFT",
      imageUrl: data.imageUrl || null,
      slug: `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(
        6
      )}`,
      readingTime,
      categories: {
        create: categoryConnections.map((conn) => ({
          category: { connect: { id: conn.categoryId } },
          name: conn.name,
        })),
      },
    },
    include: {
      categories: {
        select: {
          name: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      blog: {
        select: {
          id: true,
          name: true,
          title: true,
          author: true,
          description: true,
          imageUrl: true,
          publishedAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    categories: post.categories.map((c) => ({
      name: c.category?.name || c.name || "",
      id: c.category?.id,
    })),
    blog: post.blog
      ? {
          id: post.blog.id,
          name: post.blog.name,
          title: post.blog.title,
          author: post.blog.author,
          description: post.blog.description,
          imageUrl: post.blog.imageUrl,
          urlToImage: post.blog.imageUrl,
          publishedAt: post.blog.publishedAt.toISOString(),
          updatedAt: post.blog.updatedAt.toISOString(),
        }
      : undefined,
  };
}
