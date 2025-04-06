// src/utils/gmailOAuth.ts
import { google, Auth } from "googleapis";

// 1. Type Definitions
export interface OAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
}

// 2. Initialize OAuth Client
export const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// 3. Generate Authorization URL
export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent",
  });
}

// 4. Token Exchange Handler
export async function handleCallback(code: string): Promise<OAuthTokens> {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens securely in production (DB, encrypted storage, etc.)
    console.log("Received tokens:", {
      access_token: tokens.access_token?.substring(0, 10) + "...",
      refresh_token: tokens.refresh_token?.substring(0, 10) + "...",
    });

    return tokens;
  } catch (error) {
    console.error("Token exchange failed:", error);
    throw new Error("Authentication failed");
  }
}

// 5. Get Authenticated Client
export function getAuthenticatedClient(
  tokens?: OAuthTokens
): Auth.OAuth2Client {
  if (tokens) {
    oauth2Client.setCredentials(tokens);
  }

  if (!oauth2Client.credentials.access_token) {
    throw new Error("Client not authenticated");
  }

  return oauth2Client;
}
