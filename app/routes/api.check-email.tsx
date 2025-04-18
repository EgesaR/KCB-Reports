import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  if (!email) {
    return json({ exists: false, error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return json({ exists: false, error: "Email not found" }, { status: 404 });
  }

  return json({
    exists: true,
    user: {
      name: user.name,
      profilePicture: user.profilePicture || null,
    },
  });
}