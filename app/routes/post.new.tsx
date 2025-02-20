import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getBlogs } from "~/utils/post.server";

// 🔄 Fetch available blogs
export const loader = async () => {
  const blogs = await getBlogs();
  return json(blogs);
};

// 🖋 New Post Form Component
export default function NewPost() {
  const blogs = useLoaderData<{ id: string; name: string }[]>();
  const actionData = useActionData<{ error?: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogId, setBlogId] = useState("");

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <Form method="post" action="/api/posts" className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          className="p-2 border rounded"
          rows={5}
          required
        />
        {/* Blog Selection */}
        <select
          name="blogId"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
          className="p-2 border rounded"
          required
        >
          <option value="">Select a Blog</option>
          {blogs.map((blog) => (
            <option key={blog.id} value={blog.id}>
              {blog.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </Form>
    </div>
  );
}
