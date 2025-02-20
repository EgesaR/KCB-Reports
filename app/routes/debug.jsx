import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loader = async () => {
  try {
    const blogs = await prisma.blog.findMany();
    // Use a simple query to confirm connection (TiDB supports SELECT 1)
    const connectionTest = await prisma.$queryRaw`SELECT 1 AS connected`;
    return json({ blogs, connected: connectionTest[0].connected });
  } catch (error) {
    return json({ error: error.message, connected: false });
  }
};

export default function Debug() {
  const { blogs, connected, error } = useLoaderData();
  return (
    <div className="bg-white h-40 w-full mt-20">
      <h1>Debug Info</h1>
      <p>Database Connected: {connected ? "Yes" : "No"}</p>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <pre>{JSON.stringify(blogs, null, 2)}</pre>
      )}
    </div>
  );
}
