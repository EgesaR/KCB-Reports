import { ActionFunction, json, redirect } from "@remix-run/node";
import { db } from "~/db/client";
import { users } from "~/db/schema";
import bcrypt from "bcrypt";
import { getSession, commitSession } from "~/session.server";
import { hashPassword } from "~/utlis/hashPassword";
import { eq } from "drizzle-orm";

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  // Check if any of the fields are missing
  if (!email || !password || !name) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  // Check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute();

  if (existingUser.length > 0) {
    return json({ error: "Email already in use" }, { status: 400 });
  }

  // Hash the password before storing it
  const hashedPassword = await hashPassword(password);

  // Create a new user in the database
  const newUser = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name,
    })
    .returning();

  // Create a session for the new user
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", newUser[0]?.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function SignupPage() {
  return (
    <form method="post">
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
