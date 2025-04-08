// app/utils/mailer.server.ts
import axios from "axios";
import type { EmailOptions } from "~/types/blog";

export async function sendMail(options: EmailOptions): Promise<boolean> {
  if (!process.env.MAILERSEND_API_KEY) {
    throw new Error("MailerSend API key is not configured");
  }

  try {
    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      {
        from: {
          email: process.env.MAILERSEND_FROM_EMAIL,
          name: process.env.MAILERSEND_FROM_NAME,
        },
        to: [{ email: options.to }],
        subject: options.subject,
        text: options.text,
        html: options.html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.status === 202;
  } catch (error) {
    console.error("MailerSend API error:", error);
    throw new Error("Failed to send email");
  }
}

export async function verifyMailConnection(): Promise<boolean> {
  if (!process.env.MAILERSEND_API_KEY) {
    return false;
  }

  try {
    const response = await axios.get(
      "https://api.mailersend.com/v1/verify",
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
        },
        timeout: 5000,
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("MailerSend connection verification failed:", error);
    return false;
  }
}