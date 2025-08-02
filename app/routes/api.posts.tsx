import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/db/client";
import { posts } from "~/db/schema";
import { Post } from "~/types/post";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const allPosts: Post[] = await db.select().from(posts);
  console.log(allPosts);
  return json(allPosts);
};
