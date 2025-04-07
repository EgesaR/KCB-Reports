import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { Form } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const blogId = formData.get("blogId") as string;
  const author = formData.get("author") as string;
  const status = formData.get("status") as string;

  if (!title || !content || !blogId || !author) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  await prisma.post.create({
    data: {
      slug,
      title,
      content,
      blogId,
      author,
      status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      categories: {
        connectOrCreate: [],
      },
    },
  });

  return redirect("/posts");
};

export default function NewPost() {
  return <Form method="post">{/* Form fields */}</Form>;
}
