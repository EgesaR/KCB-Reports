import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
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
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate input types
  if (typeof email !== "string" || typeof password !== "string") {
    return json<ActionData>(
      { formError: "Form not submitted correctly" },
      { status: 400 }
    );
  }

  const errors: ActionData["fieldErrors"] = {};

  // Email validation
  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Return early if validation errors
  if (Object.keys(errors).length > 0) {
    return json<ActionData>(
      { fieldErrors: errors, fields: { email, password } },
      { status: 400 }
    );
  }
  console.log({ email, password })
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  console.log({ user })
  if (!user) {
    return json<ActionData>(
      { formError: "Invalid email or password", fields: { email, password } },
      { status: 400 }
    );
  }
  console.log({ password, user:user.password})
  // Verify password
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return json<ActionData>(
      { formError: "Invalid email or password", fields: { email, password } },
      { status: 400 }
    );
  }

  // Create session and redirect on success
  return createUserSession(user.id, "/dashboard");
};

export default function SignInPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        {/* Form Error Message */}
        {actionData?.formError && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {actionData.formError}
          </div>
        )}

        <Form method="post" className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={actionData?.fields?.email}
              className={`w-full p-2 border rounded ${
                actionData?.fieldErrors?.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {actionData?.fieldErrors?.email && (
              <p className="mt-1 text-sm text-red-600">
                {actionData.fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={actionData?.fields?.password}
              className={`w-full p-2 border rounded ${
                actionData?.fieldErrors?.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {actionData?.fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600">
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
