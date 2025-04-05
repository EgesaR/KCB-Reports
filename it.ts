// mailersend-api.server.ts
import axios from "axios";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      {
        from: {
          email: process.env.MAILERSEND_FROM_EMAIL,
          name: process.env.MAILERSEND_FROM_NAME,
        },
        to: [
          {
            email: options.to,
          },
        ],
        subject: options.subject,
        text: options.text,
        html: options.html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.status === 202;
  } catch (error) {
    console.error(
      "MailerSend API error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email via API");
  }
}
