import { type ActionFunction, json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid credentials." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Incorrect email or password." }, { status: 400 });
  }

  return createUserSession(user.id, "/dashboard");
};
