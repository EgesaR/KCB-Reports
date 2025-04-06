import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "./session.server";

// Type definitions can be exported for use in your components
export type LoginActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password?: string;
  };
};

const loginLoader: LoaderFunction = async ({ request }) => {
  return json({});
};

const loginAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.includes("@")) {
    return json<LoginActionData>(
      { formError: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length < 8) {
    return json<LoginActionData>(
      { formError: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return json<LoginActionData>(
      {
        formError: "Invalid email or password",
        fields: { email, password },
      },
      { status: 400 }
    );
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return json<LoginActionData>(
      {
        formError: "Invalid email or password",
        fields: { email, password },
      },
      { status: 400 }
    );
  }

  return createUserSession(user.id, "/dashboard");
};

export const loginHandlers = {
  loader: loginLoader,
  action: loginAction,
};