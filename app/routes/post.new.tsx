import { Field, Input, Label, Textarea } from "@headlessui/react";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { createPost } from "~/utils/post.server";
import Button from "~/components/Button";

// 🔄 **Loader to Fetch Blogs**
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const host = url.hostname;
  const apiUrl = `https://${host}/api/blogs`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch blogs");

    const blogs = await res.json();
    return json({ blogs });
  } catch (error) {
    return json({ blogs: [], error: "Failed to load blogs" });
  }
};

// 🛠️ **Action to Create a New Post**
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const blogId = formData.get("blogId");
  const author = formData.get("author");

  if (!title || !content || !blogId || !author) {
    return json({ error: "All fields are required!" }, { status: 400 });
  }

  try {
    await createPost({
      title: title.toString(),
      content: content.toString(),
      blogId: blogId.toString(),
      author: author.toString(),
    });
    return redirect("/posts");
  } catch (error: unknown) {
    return json({ error: "Failed to create post." }, { status: 500 });
  }
};

// 🖋 **New Post Form Component**
export default function NewPost() {
  const { blogs, error } = useLoaderData<{ blogs: any[]; error?: string }>();
  const actionData = useActionData<{ error?: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogId, setBlogId] = useState("");
  const [author, setAuthor] = useState(""); // ✅ Add author state

  return (
    <div className="p-6 pt-28 shadow-lg min-h-screen flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>

      {error && <p className="text-red-500">{error}</p>}
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}

      <Form method="post">
        {/* Title */}
        <Field>
          <Label>Title</Label>
          <Input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>

        {/* Content */}
        <Field>
          <Label>Content</Label>
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
          />
        </Field>

        {/* Author (NEW) */}
        <Field>
          <Label>Author</Label>
          <Input
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Field>

        {/* Blog Selection */}
        <Field>
          <Label>Select Blog</Label>
          <select
            name="blogId"
            value={blogId}
            onChange={(e) => setBlogId(e.target.value)}
            required
          >
            <option value="">Select a Blog</option>
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.name}
              </option>
            ))}
          </select>
        </Field>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-4"
          onClick={() => console.log("Creating post...")}
        >
          Create Post
        </Button>
      </Form>
    </div>
  );
}
