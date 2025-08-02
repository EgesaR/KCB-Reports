import { ActionFunction, json, redirect } from "@remix-run/node";
import { db } from "~/db/client";
import { users } from "~/db/schema";
import bcrypt from "bcrypt";
import { getSession, commitSession } from "~/session.server"; // Import session helpers
import { eq } from "drizzle-orm";

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email");
  const password = formData.get("password");

  // Check if email and password are provided
  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  // Validate user and password
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute();

  if (!user || !(await bcrypt.compare(password, user[0]?.password))) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set the user session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user[0]?.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function LoginPage() {
  return (
    <form method="post" className="flex flex-col gap-2">
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" className="border-0 border-b border-blue-400 focus:outline-0 focus:border-blue-600" required />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" className="border-0 border-b border-blue-400 focus:outline-0 focus:border-blue-600" required />
      <button type="submit">Login</button>
    </form>
  );
}
