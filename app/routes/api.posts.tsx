import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { v4 as uuidv4 } from "uuid"; // Unique slug generation
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { useState } from "react";

// 🔄 Fetch blogs & posts
export const loader: LoaderFunction = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      select: { id: true, name: true },
    });

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        introduction: true,
        content: true,
        author: true,
        publishedAt: true,
        status: true,
        blogId: true,
        blog: { select: { name: true } },
        categories: { select: { name: true } }, // ✅ Fix: Include categories
      },
    });

    return json({
      blogs,
      posts: posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        author: post.author,
        description:
          post.introduction || post.content.substring(0, 150) + "...",
        url: `/blogs/${post.blogId}/posts/${post.slug}`,
        publishedAt: post.publishedAt,
        status: post.status,
        categories: post.categories.map((cat) => cat.name),
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return json({ error: "Failed to fetch data" }, { status: 500 });
  }
};

// 📝 Handle post creation
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const blogId = formData.get("blogId") as string;
    const status = (formData.get("status") as string) || "published";
    const categories = (formData.get("categories") as string)?.split(",") || [];

    // Validate required fields
    if (!title || !content || !blogId || !author) {
      return json(
        { error: "All required fields must be filled!" },
        { status: 400 }
      );
    }

    // Check if blog exists
    const blogExists = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blogExists) {
      return json({ error: "Selected blog does not exist!" }, { status: 400 });
    }

    // Generate unique slug
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      uuidv4().slice(0, 6);

    // Create a new post
    const newPost = await prisma.post.create({
      data: {
        slug,
        title,
        content,
        author,
        blogId,
        status,
        introduction: (formData.get("introduction") as string) || null,
        conclusion: (formData.get("conclusion") as string) || null,
        authorBio: (formData.get("authorBio") as string) || null,
        tableOfContents: formData.get("tableOfContents")
          ? JSON.parse(formData.get("tableOfContents") as string)
          : null,
        readingTime: Math.ceil(content.split(" ").length / 200), // Approximate reading time
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: { name }, // ✅ Make sure "name" is unique in schema
            create: { name },
          })),
        },
      },
    });
    console.log("newPost:",newPost);
    
    return redirect(`/posts/${newPost.slug}`);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return json({ error: "Failed to create post" }, { status: 500 });
  }
};

// ✨ New Post Form Component
export default function NewPost() {
  const { blogs } = useLoaderData<{ blogs: { id: string; name: string }[] }>();
  const actionData = useActionData<{ error?: string }>();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-all ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="mb-6 px-4 py-2 rounded-md transition-all bg-blue-600 hover:bg-blue-700 text-white"
      >
        Toggle Theme
      </button>

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}

        <Form method="post" className="flex flex-col gap-4">
          {/* Title */}
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              type="text"
              name="title"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          {/* Content */}
          <label className="block">
            <span className="text-sm font-medium">Content</span>
            <textarea
              name="content"
              required
              rows={4}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </label>

          {/* Author */}
          <label className="block">
            <span className="text-sm font-medium">Author</span>
            <input
              type="text"
              name="author"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>

          {/* Blog Selection */}
          <label className="block">
            <span className="text-sm font-medium">Select Blog</span>
            <select
              name="blogId"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Choose a Blog</option>
              {blogs.map((blog) => (
                <option key={blog.id} value={blog.id}>
                  {blog.name}
                </option>
              ))}
            </select>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
          >
            Create Post
          </button>
        </Form>
      </div>
    </div>
  );
}
