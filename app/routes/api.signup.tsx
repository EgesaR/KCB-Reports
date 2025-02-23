import { json, redirect, type ActionFunction } from "@remix-run/node";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // Ensure all values are strings
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    return json({ error: "All fields are required." }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 🔥 Log in user immediately after signup
    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    return json({ error: "User already exists." }, { status: 400 });
  }
};
