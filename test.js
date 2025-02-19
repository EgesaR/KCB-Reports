import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function test() {
  try {
    const blog = await prisma.blog.create({
      data: {
        name: "Test Blog",
        description: "This is a test blog.",
        imageUrl: "https://example.com/image.jpg",
        selfLink: "https://example.com/blog/test",
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(blog);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
test();
