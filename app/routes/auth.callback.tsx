import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { google } from "googleapis";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return json({ error: `OAuth error: ${error}` }, { status: 400 });
  }

  if (!code) {
    return json({ error: "Authorization code not found" }, { status: 400 });
  }

  return json({ code });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code") as string;

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );


    const { tokens } = await oauth2Client.getToken(code);
    console.log({ tokens })
    // Store tokens securely (in database or session)
    console.log("Refresh token:", tokens.refresh_token);

    return redirect("/dashboard"); // Redirect after successful auth
  } catch (error) {
    console.error("Token exchange error:", error);
    return json(
      { error: "Failed to exchange authorization code for tokens" },
      { status: 500 }
    );
  }
};

export default function AuthCallback() {
  const { code, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        <h2 className="text-xl font-bold">Authorization Failed</h2>
        <p>{error}</p>
        <a href="/" className="text-blue-600 hover:underline">
          Return to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {code}
      <h1 className="text-2xl font-bold mb-4">Completing Authorization</h1>
      <Form method="post" className="space-y-4">
        <input type="hidden" name="code" value={code} />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Complete Authorization
        </button>
      </Form>
    </div>
  );
}
