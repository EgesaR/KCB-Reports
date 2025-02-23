import { type ActionFunction, json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";

const validRoles = ["ADMIN", "PARENT", "TEACHER"] as const;
type Role = (typeof validRoles)[number];

interface ActionData {
  error?: string;
}

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const roles = formData.getAll("roles");

  // Validate input types
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password.trim() ||
    roles.length === 0
  ) {
    return json<ActionData>(
      { error: "Invalid form submission. All fields are required." },
      { status: 400 }
    );
  }

  // Validate roles
  const selectedRoles = roles.filter((role): role is Role =>
    validRoles.includes(role as Role)
  );
  if (selectedRoles.length === 0) {
    return json<ActionData>(
      { error: "At least one valid role must be selected." },
      { status: 400 }
    );
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: selectedRoles.map((role) => ({ role })),
        },
      },
    });

    // 🔥 Automatically log in user after creation
    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    console.error("User creation error:", error);
    return json<ActionData>(
      { error: "Error creating user. The email might already be in use." },
      { status: 500 }
    );
  }
};
