import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";
import logger from "~/utils/logger.server"; // Import the Pino logger

// Define the shape of the action data
type ActionData = {
  formError?: string; // General form error (e.g., authentication failure)
  fieldErrors?: {
    email?: string; // Email-specific error
    password?: string; // Password-specific error
  };
  fields?: {
    email: string; // Submitted email value
    password: string; // Submitted password value
  };
};

export const action: ActionFunction = async ({ request }) => {
  // Parse form data from the request
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  logger.info("Form submission received:", { email, password }); // Log form data

  // Initialize errors object
  const errors: ActionData["fieldErrors"] = {};

  // Validate email
  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
    logger.error({ email }, "Email validation failed"); // Log email error
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
    logger.error({ password }, "Password validation failed"); // Log password error
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    logger.error({ errors }, "Validation errors"); // Log all validation errors
    return json<ActionData>(
      {
        fieldErrors: errors,
        fields: { email: email || "", password: password || "" },
      },
      { status: 400 }
    );
  }

  // Ensure email and password are defined and of type string
  if (typeof email !== "string" || typeof password !== "string") {
    const errorMessage = "Invalid credentials.";
    logger.error({ email, password }, errorMessage); // Log invalid credentials error
    return json<ActionData>({ formError: errorMessage }, { status: 400 });
  }

  // Look up the user in the database
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const errorMessage = "Incorrect email or password.";
    logger.error({ email }, errorMessage); // Log user not found error
    return json<ActionData>({ formError: errorMessage }, { status: 400 });
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const errorMessage = "Incorrect email or password.";
    logger.error({ email }, errorMessage); // Log invalid password error
    return json<ActionData>({ formError: errorMessage }, { status: 400 });
  }

  // Log successful authentication
  logger.info({ email, userId: user.id }, "Authentication successful");

  // Create a user session and redirect to the dashboard
  return createUserSession(user.id, "/dashboard");
};
