// test2.js
import { google } from "googleapis";
import express from "express";
import { URLSearchParams } from 'url';

const app = express();
const port = 5000; // Make sure this matches the port your Glitch app uses

const CLIENT_ID = "1051887930726-9q0mc7719efceosn00on9ej21tel61dk.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://nsd5xj-5173.csb.app/auth/callback"; // Ensure this exactly matches your Google Cloud Console

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Route to initiate the Google OAuth 2.0 flow
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Request a refresh token
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent", // Force consent screen to ensure refresh token is always obtained on first authorization
  });
  console.log("Authorize this app by visiting:", authUrl);
  res.redirect(authUrl);
});

// Callback route to handle the authorization code from Google
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens); // Optional: Set credentials for immediate use
      console.log({token})
      console.log("Access token:", tokens.access_token);
      console.log("Refresh token:", tokens.refresh_token);

      // **Important:** Store the refresh token securely (e.g., in a database)
      // associated with the user who authorized the application.
      // You will use this refresh token to obtain new access tokens when the current one expires.

      res.send("Authorization successful! Check your console for the refresh token.");
    } catch (error) {
      console.error("Error getting tokens:", error);
      res.status(500).send(`Error getting tokens: ${error.message}`);
    }
  } else {
    res.status(400).send("Authorization code not provided.");
  }
});

// Example of how to use the refresh token to get a new access token (not directly part of the initial flow)
async function refreshToken() {
  try {
    // **Important:** Retrieve the stored refresh token for the user
    const storedRefreshToken = "YOUR_STORED_REFRESH_TOKEN"; // Replace with your actual stored refresh token

    oauth2Client.setCredentials({
      refresh_token: storedRefreshToken,
    });

    const { token } = await oauth2Client.getAccessToken();
    if (token) {
      console.log("New access token:", token);
      return token;
    } else {
      console.error("Failed to refresh access token.");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

// Example usage of the Gmail API (requires a valid access token)
async function sendGmail(accessToken) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client }); // Use the authenticated client

    const raw = makeBody(
      'to@example.com',
      'me@example.com',
      'Test Email from Google API',
      'This is a test email sent using the Gmail API with a refreshed access token.'
    );

    const { data } = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw,
      },
    });
    console.log('Email sent:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

function makeBody(to, from, subject, message) {
  const str = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    message
  ].join('\n');
  const buf = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return buf;
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/auth/google to authorize the app.`);
});

// You can still export these if needed for other parts of your application
export { oauth2Client };