import { google } from "googleapis";

export async function setupGmailOAuth() {
  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI = "https://developers.google.com/oauthplayground",
  } = process.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET) {
    throw new Error("Missing Gmail OAuth2 configuration");
  }

  const oauth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI
  );

  // Generate authorization URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent",
  });

  console.log("Authorize this app by visiting:", authUrl);

  return oauth2Client;
}

export async function getTokens(oauth2Client: any, code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens obtained successfully");
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    console.log("Token expiry:", tokens.expiry_date);
    return tokens;
  } catch (error) {
    console.error("Error getting tokens:", error);
    throw new Error("Failed to obtain tokens");
  }
}
