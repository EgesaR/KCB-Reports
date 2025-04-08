import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sendPasswordResetEmail } from "~/services/email.server";
import { Form } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email !== "string") {
    return json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    await sendPasswordResetEmail(email);
    return json({ success: true });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send reset email",
      },
      { status: 500 }
    );
  }
};

export default function RequestReset() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </Form>
    </div>
  );
}
