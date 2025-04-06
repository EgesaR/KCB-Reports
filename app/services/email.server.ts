import { sendEmail } from "./gmailAuth.server";
import { createResetToken } from "~/models/user.server";

export async function sendPasswordResetEmail(email: string, request: Request) {
  const user = await createResetToken(email);
  if (!user) throw new Error("User not found");

  const resetUrl = `${process.env.APP_URL}/reset-password/${user.resetToken}`;

  await sendEmail(request, {
    to: email,
    subject: "Password Reset Request",
    body: `
      <h1>Password Reset</h1>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
