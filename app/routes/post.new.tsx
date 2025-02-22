import { Field, Input, Label, Textarea } from "@headlessui/react";
import { ChevronLeftIcon, EyeIcon, PlusIcon } from "@heroicons/react/16/solid";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import Button from "~/components/Button";
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
  const DEFAULT_IMAGE_LIST = [
    {
      src: "https://images.unsplash.com/photo-1503410759647-41040b696833?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhbXN1bmclMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D",
    },
    {
      src: "https://images.unsplash.com/photo-1535392432937-a27c36ec07b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNhbXN1bmclMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D",
    },
    {
      src: "https://images.unsplash.com/photo-1527515234283-d93c5f8486a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNhbXN1bmclMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D",
    },
  ];
  const [imageList, setImageList] =
    useState<{ src: string }[]>(DEFAULT_IMAGE_LIST);

  return (
    <div className="p-6 pt-28 shadow-lg min-h-screen flex flex-col gap-8">
      <nav className="flex justify-between items-center text-neutral-200">
        <Link to="/posts">
          <ChevronLeftIcon className="size-6" />
        </Link>
        <div>
          <h1 className="text-2xl">Post</h1>
        </div>
        <EyeIcon className="size-6" />
      </nav>
      <main className="flex flex-col items-center">
        <section className="flex gap-6 items-center mt-4">
          {imageList?.map((image, index) => (
            <img
              src={image.src}
              alt={`image${index}`}
              className="h-32 w-32 rounded-lg hover:cursor-pointer"
            />
          ))}
          <motion.div
            whileHover={{
              scale: 0.95,
            }}
            transition={{
              ease: "easeInOut",
            }}
            className="h-32 w-32 rounded-lg border-dashed border-2 border-gray-400 grid place-content-center text-gray-400 hover:cursor-pointer"
          >
            <PlusIcon className="size-8" />
          </motion.div>
        </section>
        <section className="mt-4 w-full max-w-lg">
          <div className="w-full px-4">
            <Field>
              <Label className="text-sm/6 font-medium text-white">Title</Label>
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>
          </div>
        </section>
        <section className="mt-4 w-full max-w-lg">
          <div className="w-full px-4">
            <Field className="relative">
              <Label className="text-sm/6 font-medium text-white">
                Caption
              </Label>
              <Textarea
                className={clsx(
                  "mt-3 block w-full h-48 resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white ",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
                rows={3}
              />
              <div className="flex gap-4 absolute bottom-2 left-2">
                <div className="rounded-2xl bg-slate-100 dark:bg-white/20 py-1.5 px-4.5 border border-transparent text-sm text-slate-600 dark:text-slate-200 transition-all shadow-sm dark:hover:bg-white/5 dark:hover:text-gray-400">
                  Caption Ideas
                </div>
                <div className="rounded-2xl bg-slate-100 dark:bg-white/20 py-1.5 px-4.5 border border-transparent text-sm text-slate-600 dark:text-slate-200 transition-all shadow-sm dark:hover:bg-white/5 dark:hover:text-gray-400">
                  Hashing
                </div>
              </div>
            </Field>
          </div>
        </section>
        <section className="mt-4 flex justify-end w-[38%]">
          <Button btnType="default" className="flex gap-6 items-center justify-center w-48">
            <PlusIcon className="size-6" />
            Post
          </Button>
        </section>
      </main>
    </div>
  );
}

/*
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
*/
