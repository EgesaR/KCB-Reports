import { ActionFunction, json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loader = async () => {
  try {
    const blogs = await prisma.blog//.findMany({
      //orderBy: { publishedAt: "desc" }, // Changed publishedAt → published
    //});
    console.log("Loading blogs")
    console.log("Blogs: ", blogs)
    return json(blogs ?? []);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return json([]);
  } finally {
    await prisma.$disconnect();
  }
};


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const imageUrl = formData.get("imageUrl");
  const selfLink = formData.get("selfLink");
  const publishedAtStr = formData.get("publishedAt");

  // Validate input types
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof imageUrl !== "string" ||
    typeof selfLink !== "string" ||
    typeof publishedAtStr !== "string"
  ) {
    return json({ error: "Invalid input types" }, { status: 400 });
  }

  const publishedAt = new Date(publishedAtStr); // Changed `published` → `publishedAt`
  const updatedAt = new Date();

  try {
    const blog = await prisma.blog.create({
      data: {
        name,
        description,
        imageUrl,
        selfLink,
        publishedAt, // Matches `publishedAt` in schema
        updatedAt, // Renamed `updated`
      },
    });

    return json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return json({ error: "Failed to create blog" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close DB connection
  }
};
