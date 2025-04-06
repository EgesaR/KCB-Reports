import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import axios from "axios";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const code = formData.get("code") as string;

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

// Add a default export (even if empty) to ensure the file is treated as a route module
export default function AuthCallback() {
  return null;
}
