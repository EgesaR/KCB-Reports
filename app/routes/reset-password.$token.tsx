import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { validateResetToken, updatePassword } from "~/models/user.server";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = await validateResetToken(params.token);
  if (!user) throw new Response("Invalid or expired token", { status: 400 });
  return json({ email: user.email });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await validateResetToken(params.token);
  if (!user) throw new Response("Invalid or expired token", { status: 400 });

  const formData = await request.formData();
  const password = formData.get("password") as string;

  await updatePassword(user.id, password);
  return json({ success: true });
};

export default function ResetPassword() {
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
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
      </Form>
    </div>
  );
}
