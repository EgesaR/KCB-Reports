import { Form, useActionData } from "@remix-run/react";
import Alert from "~/components/Alert";

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
  success?: boolean; // Indicates successful authentication
};

export default function SignInPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded p-8 w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

        {/* Display success alert */}
        {actionData?.success && (
          <Alert type="success" message="You have successfully signed in!" />
        )}

        {/* Display general form error */}
        {actionData?.formError && (
          <Alert type="danger" message={actionData.formError} />
        )}

        <Form method="post" action="authenticate">
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={actionData?.fields?.email || ""}
                className={`w-full border rounded p-2 focus:outline-0 ${
                  actionData?.fieldErrors?.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {actionData?.fieldErrors?.email && (
                <span className="text-sm text-red-500">
                  {actionData.fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue={actionData?.fields?.password || ""}
                className={`w-full border rounded p-2 focus:outline-0 ${
                  actionData?.fieldErrors?.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {actionData?.fieldErrors?.password && (
                <span className="text-sm text-red-500">
                  {actionData.fieldErrors.password}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
