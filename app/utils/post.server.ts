import { prisma } from "~/utils/prisma.server";
import { nanoid } from "nanoid";
import type { Post, PostStatus } from "~/types/blog";

interface CreatePostInput {
  title: string;
  content: string;
  blogId: string;
  author: string;
  status?: PostStatus;
  imageUrl?: string | null;
  categories?: string[];
}

export async function createPost(data: CreatePostInput): Promise<Post> {
  const { categories = [], ...postData } = data;

  const wordCount = data.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return prisma.post.create({
    data: {
      ...postData,
      slug: `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(
        6
      )}`,
      readingTime,
      categories: {
        connectOrCreate: await Promise.all(
          categories.map(async (name) => {
            const categoryName = name.trim();
            const category = await prisma.category.upsert({
              where: { name: categoryName },
              create: { name: categoryName },
              update: {},
            });
            return {
              where: {
                postId_categoryId: {
                  postId: "", // Will be set by Prisma
                  categoryId: category.id,
                },
              },
              create: {
                categoryId: category.id,
              },
            };
          })
        ),
      },
    },
    include: {
      categories: {
        select: {
          name: true,
        },
      },
    },
  }) as Promise<Post>;
}
