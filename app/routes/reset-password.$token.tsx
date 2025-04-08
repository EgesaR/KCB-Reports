import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { validateResetToken, updatePassword } from "~/services/auth.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.token) throw new Response("Token required", { status: 400 });

  const user = await validateResetToken(params.token);
  if (!user) throw new Response("Invalid token", { status: 400 });

  return json({ email: user.email });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (!params.token) throw new Response("Token required", { status: 400 });

  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return json({ error: "Passwords don't match" }, { status: 400 });
  }

  await updatePassword(params.token, password);
  return redirect("/login?reset=success");
};

export default function ResetPasswordPage() {
  const { email } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password for {email}</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1">
            New Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            minLength={8}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            minLength={8}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
      </Form>
    </div>
  );
}
