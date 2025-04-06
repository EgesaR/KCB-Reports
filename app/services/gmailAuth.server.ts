import { google, type Auth } from "googleapis";
import { createCookieSessionStorage } from "@remix-run/node";
import { encrypt, decrypt } from "~/utils/encryption";

// Session storage for tokens (replace with DB in production)
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "gmail_auth",
    secrets: [process.env.ENCRYPTION_SECRET!],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

export async function getAuthUrl(userId: string): Promise<string> {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent",
    state: userId, // For security validation
  });
}

export async function handleCallback(
  code: string,
  state: string
): Promise<OAuthTokens> {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Verify state matches expected user
    if (state !== "expected-user-id") {
      throw new Error("Invalid state parameter");
    }

    // Store tokens securely
    const session = await sessionStorage.getSession();
    session.set("tokens", encrypt(JSON.stringify(tokens)));

    return tokens;
  } catch (error) {
    console.error("OAuth callback failed:", error);
    throw new Error("Authentication failed");
  }
}

export async function getAuthenticatedClient(
  request: Request
): Promise<Auth.OAuth2Client> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const encryptedTokens = session.get("tokens");

  if (!encryptedTokens) {
    throw new Error("Not authenticated");
  }

  const tokens = JSON.parse(decrypt(encryptedTokens)) as OAuthTokens;
  oauth2Client.setCredentials(tokens);

  // Refresh token if expired
  if (tokens.expiry_date && Date.now() > tokens.expiry_date) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await sessionStorage.commitSession(session);
    return oauth2Client;
  }

  return oauth2Client;
}
