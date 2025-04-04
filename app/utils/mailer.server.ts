import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: SendMailOptions) {
  // Create a test account if you're using Ethereal.email for testing
  // const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // For testing with Ethereal.email (comment out the above and use this):
  /*
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  */

  const info = await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html: html || text,
  });

  console.log("Message sent: %s", info.messageId);
  // For testing with Ethereal:
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
