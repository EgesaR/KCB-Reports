// app/services/email.server.ts
import { sendMail } from "~/utils/mailer.server";
import { createResetToken } from "~/services/auth.server";

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const resetToken = await createResetToken(email);
  const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

  await sendMail({
    to: email,
    subject: "Password Reset Request",
    text: `Please reset your password using this link: ${resetUrl}`,
    html: `
      <h1>Password Reset</h1>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
