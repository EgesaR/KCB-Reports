import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";
import logger from "~/utils/logger.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password: string;
  };
  success?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  logger.info("Form submission received:", { email, password });

  // Initialize errors
  const errors: ActionData["fieldErrors"] = {};

  // Validate email
  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
    logger.error({ email }, "Email validation failed");
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
    logger.error({ password }, "Password validation failed");
  }

  // Return validation errors if any
  if (Object.keys(errors).length > 0) {
    return json<ActionData>(
      {
        fieldErrors: errors,
        fields: { email: email || "", password: password || "" },
      },
      { status: 400 }
    );
  }

  // Type check
  if (typeof email !== "string" || typeof password !== "string") {
    return json<ActionData>(
      { formError: "Invalid form submission" },
      { status: 400 }
    );
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return json<ActionData>(
      { formError: "Incorrect email or password" },
      { status: 400 }
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return json<ActionData>(
      { formError: "Incorrect email or password" },
      { status: 400 }
    );
  }

  // Create session and redirect
  return createUserSession(user.id, "/dashboard");
};
