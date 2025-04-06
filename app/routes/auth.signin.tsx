import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { loginHandlers, type LoginActionData } from "~/utils/auth.signin.server";
import { motion } from "framer-motion";

export const loader = loginHandlers.loader;
export const action = loginHandlers.action;

export default function SignInPage() {
  const actionData = useActionData<LoginActionData>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

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
            Welcome Back
          </h1>

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

          <Form method="post" className="space-y-6">
            {/* Email Field */}
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
              />
              {actionData?.fieldErrors?.email && (
                <p className="mt-2 text-sm text-red-600">
                  {actionData.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Password
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
            </div>

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
                "Sign In"
              )}
            </motion.button>

            {/* Forgot password link */}
            <div className="text-center mt-4">
              <Link
                to="/auth/forgot_password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
