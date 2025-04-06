import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export type ForgotPasswordActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    code?: string;
  };
  fields?: {
    email: string;
    password?: string;
    code?: string;
  };
  resetSent?: boolean;
  resetSuccess?: boolean;
  mode?: "reset" | "verify";
};

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"KCB Reports" <${
        process.env.EMAIL_FROM || "no-reply@yourdomain.com"
      }>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export const forgotPasswordAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const code = formData.get("code");
  const mode = formData.get("mode") || "reset";

  if (typeof email !== "string" || !email.includes("@")) {
    return json<ForgotPasswordActionData>(
      { formError: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  if (mode === "reset") {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return json<ForgotPasswordActionData>(
        { formError: "No account found with this email address" },
        { status: 400 }
      );
    }

    await prisma.passwordReset.upsert({
      where: { email },
      update: { code: resetCode, expiresAt },
      create: { email, code: resetCode, expiresAt },
    });

    try {
      await sendEmail(
        email,
        "Your Password Reset Code",
        `Your password reset code is: ${resetCode}\nThis code will expire in 1 hour.`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>We received a request to reset your password. Here's your verification code:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 4px; font-size: 24px; font-weight: bold; text-align: center; margin: 16px 0; color: #2563eb;">
            ${resetCode}
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
      );
    } catch (error: unknown) {
      console.error("Failed to send reset email:", error);
      return json<ForgotPasswordActionData>(
        {
          formError:
            error instanceof Error
              ? error.message
              : "Failed to send reset email",
          fields: { email },
          mode: "reset",
        },
        { status: 500 }
      );
    }

    return json<ForgotPasswordActionData>({
      resetSent: true,
      fields: { email },
      mode: "reset",
    });
  }

  if (mode === "verify") {
    if (typeof code !== "string" || typeof password !== "string") {
      return json<ForgotPasswordActionData>(
        { formError: "Verification code and new password are required" },
        { status: 400 }
      );
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { email, code },
    });

    if (!resetRecord || new Date() > resetRecord.expiresAt) {
      return json<ForgotPasswordActionData>(
        {
          formError: "Invalid or expired verification code",
          fields: { email, code },
          mode: "verify",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json<ForgotPasswordActionData>(
        {
          fieldErrors: { password: "Password must be at least 8 characters" },
          fields: { email, code },
          mode: "verify",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.delete({ where: { email } });

    return json<ForgotPasswordActionData>({
      resetSuccess: true,
      mode: "verify",
    });
  }

  return json<ForgotPasswordActionData>(
    { formError: "Invalid request" },
    { status: 400 }
  );
};

export const forgotPasswordHandler = {
  action: forgotPasswordAction,
};
