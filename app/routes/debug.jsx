import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

// Custom JSON serializer to handle BigInt
function serializeBigInt(obj) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}

const prisma = new PrismaClient();

export const loader = async () => {
  try {
    const blogs = await prisma.blog.findMany();
    const connectionTest = await prisma.$queryRaw`SELECT 1 AS connected`;
    return new Response(
      serializeBigInt({ blogs, connected: connectionTest[0].connected }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
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
