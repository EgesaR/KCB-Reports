import { json, redirect, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

// Define the shape of action data
type ActionData = {
  error?: string;
};

export async function loader() {
  const blogs = await prisma.blog.findMany();
  return json({ blogs });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const blogId = formData.get("blogId")?.toString().trim(); // Blog selection

  if (!title || !content || !blogId) {
    return json({ error: "All fields are required!" }, { status: 400 });
  }

  try {
    await prisma.post.create({
      data: { title, content, blogId },
    });
    return redirect("/posts");
  } catch (error) {
    console.error("Error creating post:", error);
    return json({ error: "Something went wrong!" }, { status: 500 });
  }
};

export default function NewPost() {
  const actionData = useActionData<ActionData>(); // ✅ Type safety
  const { blogs } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Create a New Post</h1>
      <Form method="post" className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Content"
          className="w-full border p-2 rounded"
        />

        {/* Dropdown to select a blog */}
        <select name="blogId" className="w-full border p-2 rounded">
          <option value="">Select a Blog</option>
          {blogs.map((blog) => (
            <option key={blog.id} value={blog.id}>
              {blog.name}
            </option>
          ))}
        </select>

        {/* Error message */}
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
