// app/utils/mailer.server.ts
import nodemailer from "nodemailer";

// Configure your email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Your App" <noreply@example.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
}
