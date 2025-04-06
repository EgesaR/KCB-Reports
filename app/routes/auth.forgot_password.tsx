import { Form, useActionData, useNavigation } from "@remix-run/react";
import { motion } from "framer-motion";
import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import axios from "axios";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;
  const mode = formData.get("mode") as string;
  const password = formData.get("password") as string;

  // Handle forgot password flow
  if (mode === "reset" || mode === "verify") {
    // Your existing forgot password logic here
    // Return appropriate responses based on mode
    if (mode === "reset") {
      return json({
        mode: "verify",
        resetSent: true,
        fields: { email },
      });
    } else if (mode === "verify") {
      // Verify code and update password
      return json({
        resetSuccess: true,
        mode: "verify",
      });
    }
  }

  // Handle OAuth token exchange
  try {
    const tokenEndpoint = process.env.OAUTH_TOKEN_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!tokenEndpoint || !clientId || !clientSecret || !redirectUri) {
      console.error(
        "Missing required environment variables for token exchange."
      );
      return json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );

    const tokens = response.data;
    console.log({ tokens });
    console.log("Refresh token:", tokens.refresh_token);

    return redirect("/dashboard");
  } catch (error: any) {
    console.error("Token exchange error:", error);
    let errorMessage = "Failed to exchange authorization code for tokens";
    if (
      error.response &&
      error.response.data &&
      error.response.data.error_description
    ) {
      errorMessage += `: ${error.response.data.error_description}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    return json({ error: errorMessage }, { status: 500 });
  }
};

export default function ForgotPasswordPage() {
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const currentMode = actionData?.mode || "reset";

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
          {actionData?.error && (
            <motion.div
              className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {actionData.error}
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

            {/* Password Field - shown in verify mode */}
            {currentMode === "verify" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  New Password
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
                  {currentMode === "reset" && "Send Reset Code"}
                  {currentMode === "verify" && "Update Password"}
                </>
              )}
            </motion.button>

            {/* Back to login link */}
            <div className="text-center mt-4">
              <a
                href="/signin"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Sign In
              </a>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
