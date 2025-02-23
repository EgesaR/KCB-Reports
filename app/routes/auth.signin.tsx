// app/routes/auth/signin.tsx
import { useActionData, Form } from "@remix-run/react";
import AuthPage from "./auth";

interface ActionData {
  error?: string;
}

export default function SigninPage() {
  const actionData = useActionData<ActionData>();

  return (
    <AuthPage>
      <div className="mt-24 bg-white">
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
        <Form method="post" action="/api/signin">
          <div>
            <label>
              Email: <input type="email" name="email" required />
            </label>
          </div>
          <div>
            <label>
              Password: <input type="password" name="password" required />
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Sign In
          </button>
        </Form>
      </div>
    </AuthPage>
  );
}
