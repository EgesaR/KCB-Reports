import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

// Define the expected blog shape for the frontend
interface BlogResponse {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  author: string;
  publishedAt: string;
}

// 🚀 Loader: Fetch all blogs
export const loader: LoaderFunction = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        name: true, // Maps to "title" in frontend
        description: true,
        imageUrl: true, // Maps to "urlToImage" in frontend
        selfLink: true, // Maps to "url" in frontend
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: "desc", // Latest blogs first
      },
    });

    console.log("API Response:", blogs); // Debugging log

    // Transform backend response to match frontend expectations
    const formattedBlogs: BlogResponse[] = blogs.map((blog) => ({
      id: blog.id,
      title: blog.name,
      description: blog.description,
      url: blog.selfLink || "", // Default to empty string if null
      urlToImage: blog.imageUrl || "", // Default to empty string if null
      author: "Unknown", // Static default, no author field in schema
      publishedAt: blog.publishedAt.toISOString(), // ISO string for frontend
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
    // Handle both JSON and form data requests
    let data: {
      name?: string | null;
      description?: string | null;
      imageUrl?: string | null;
      selfLink?: string | null;
      publishedAt?: string | null;
    };

    if (request.headers.get("Content-Type")?.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = {
        name: formData.get("name") as string | null,
        description: formData.get("description") as string | null,
        imageUrl: formData.get("imageUrl") as string | null,
        selfLink: formData.get("selfLink") as string | null,
        publishedAt: formData.get("publishedAt") as string | null,
      };
    }

    const { name, description, imageUrl, selfLink, publishedAt } = data;

    // 🔴 Validation
    if (!name || !description) {
      return json({ error: "Name and description are required" }, { status: 400 });
    }

    // Default publishedAt to now if not provided
    const publishDate = publishedAt ? new Date(String(publishedAt)) : new Date();
    if (isNaN(publishDate.getTime())) {
      return json({ error: "Invalid publishedAt date" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        name: String(name),
        description: String(description),
        imageUrl: imageUrl ? String(imageUrl) : null, // Optional field
        selfLink: selfLink ? String(selfLink) : null, // Optional field
        publishedAt: publishDate,
        updatedAt: new Date(),
      },
    });

    // Format response for frontend
    const response: BlogResponse = {
      id: blog.id,
      title: blog.name,
      description: blog.description,
      url: blog.selfLink || "",
      urlToImage: blog.imageUrl || "",
      author: "Unknown",
      publishedAt: blog.publishedAt.toISOString(),
    };

    return json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return json({ error: "Failed to create blog" }, { status: 500 });
  }
};