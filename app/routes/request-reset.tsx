import { ActionFunctionArgs, json } from "@remix-run/node";
import { sendPasswordResetEmail } from "~/services/email.server";
import { Form } from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    await sendPasswordResetEmail(email, request);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
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
