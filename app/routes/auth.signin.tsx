import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import bcrypt from "bcryptjs";
import { createUserSession } from "~/utils/session.server";
import { mailerSend } from "~/utils/mailersend.server";
import { motion } from "framer-motion";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    code?: string;
  };
  fields?: {
    email: string;
    password?: string;
    code?: string;
  };
  resetSent?: boolean;
  resetSuccess?: boolean;
  mode?: "login" | "reset" | "verify";
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const code = formData.get("code");
  const mode = formData.get("mode") || "login";

  if (typeof email !== "string" || !email.includes("@")) {
    return json<ActionData>(
      { formError: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  if (mode === "reset") {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return json<ActionData>(
        { formError: "No account found with this email address" },
        { status: 400 }
      );
    }

    await prisma.passwordReset.upsert({
      where: { email },
      update: { code: resetCode, expiresAt },
      create: { email, code: resetCode, expiresAt },
    });

    try {
      await mailerSend.sendMail({
        to: email,
        subject: "Your Password Reset Code",
        text: `Your password reset code is: ${resetCode}\nThis code will expire in 1 hour.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>We received a request to reset your password. Here's your verification code:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 4px; font-size: 24px; font-weight: bold; text-align: center; margin: 16px 0; color: #2563eb;">
              ${resetCode}
            </div>
            <p>This code will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error: unknown) {
      console.error("Failed to send reset email:", error);
      return json<ActionData>(
        {
          formError:
            error instanceof Error
              ? error.message
              : "Failed to send reset email",
          fields: { email },
          mode: "reset",
        },
        { status: 500 }
      );
    }

    return json<ActionData>({
      resetSent: true,
      fields: { email },
      mode: "reset",
    });
  }

  if (mode === "verify") {
    if (typeof code !== "string" || typeof password !== "string") {
      return json<ActionData>(
        { formError: "Verification code and new password are required" },
        { status: 400 }
      );
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { email, code },
    });

    if (!resetRecord || new Date() > resetRecord.expiresAt) {
      return json<ActionData>(
        {
          formError: "Invalid or expired verification code",
          fields: { email, code },
          mode: "verify",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json<ActionData>(
        {
          fieldErrors: { password: "Password must be at least 8 characters" },
          fields: { email, code },
          mode: "verify",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.delete({ where: { email } });

    return json<ActionData>({
      resetSuccess: true,
      mode: "login",
    });
  }

  if (mode === "login") {
    if (typeof password !== "string" || password.length < 8) {
      return json<ActionData>(
        { formError: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return json<ActionData>(
        {
          formError: "Invalid email or password",
          fields: { email, password },
          mode: "login",
        },
        { status: 400 }
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return json<ActionData>(
        {
          formError: "Invalid email or password",
          fields: { email, password },
          mode: "login",
        },
        { status: 400 }
      );
    }

    return createUserSession(user.id, "/dashboard");
  }

  return json<ActionData>({ formError: "Invalid request" }, { status: 400 });
};

export default function SignInPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const currentMode = actionData?.mode || "login";

  return (
    <div className="w-full h-screen flex bg-gray-50">
      {/* Left side with image */}
      <motion.div
        className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=900"
          alt="Aurora"
          className="min-w-full min-h-full rounded-lg shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            {currentMode === "login" && "Welcome Back"}
            {currentMode === "reset" && "Reset Password"}
            {currentMode === "verify" && "Verify Code"}
          </h1>

          {/* Success message after password reset */}
          {actionData?.resetSuccess && (
            <motion.div
              className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Password updated successfully! You can now sign in with your new
              password.
            </motion.div>
          )}

          {/* Form Error Message */}
          {actionData?.formError && (
            <motion.div
              className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {actionData.formError}
            </motion.div>
          )}

          {/* Reset code sent confirmation */}
          {actionData?.resetSent && (
            <motion.div
              className="mb-6 p-4 text-sm text-blue-700 bg-blue-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              We've sent a verification code to your email. Please check your
              inbox and spam folder.
            </motion.div>
          )}

          <Form method="post" className="space-y-6">
            <input type="hidden" name="mode" value={currentMode} />

            {/* Email Field - always shown */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={actionData?.fields?.email}
                className={`w-full p-3 border rounded-lg ${
                  actionData?.fieldErrors?.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
                required
                disabled={currentMode === "verify"}
              />
              {actionData?.fieldErrors?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Verification Code Field - shown in verify mode */}
            {currentMode === "verify" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="code"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  defaultValue={actionData?.fields?.code}
                  className={`w-full p-3 border rounded-lg ${
                    actionData?.fieldErrors?.code
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                  required
                />
                {actionData?.fieldErrors?.code && (
                  <p className="mt-2 text-sm text-red-600">
                    {actionData.fieldErrors.code}
                  </p>
                )}
              </motion.div>
            )}

            {/* Password Field - shown in login and verify modes */}
            {(currentMode === "login" || currentMode === "verify") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: currentMode === "verify" ? 0.1 : 0,
                }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  {currentMode === "verify" ? "New Password" : "Password"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  defaultValue={actionData?.fields?.password}
                  className={`w-full p-3 border rounded-lg ${
                    actionData?.fieldErrors?.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                  required
                  minLength={8}
                />
                {actionData?.fieldErrors?.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {actionData.fieldErrors.password}
                  </p>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {currentMode === "login" && "Sign In"}
                  {currentMode === "reset" && "Send Reset Code"}
                  {currentMode === "verify" && "Update Password"}
                </>
              )}
            </motion.button>

            {/* Forgot password link */}
            {currentMode === "login" && (
              <div className="text-center mt-4">
                <Form method="post">
                  <input type="hidden" name="mode" value="reset" />
                  <input
                    type="hidden"
                    name="email"
                    value={actionData?.fields?.email || ""}
                  />
                  <button
                    type="submit"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password?
                  </button>
                </Form>
              </div>
            )}

            {/* Back to login link */}
            {(currentMode === "reset" || currentMode === "verify") && (
              <div className="text-center mt-4">
                <Form method="post">
                  <input type="hidden" name="mode" value="login" />
                  <button
                    type="submit"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Back to Sign In
                  </button>
                </Form>
              </div>
            )}
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
