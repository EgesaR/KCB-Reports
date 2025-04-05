import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Create a transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error("Error verifying mail transporter:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

export async function sendMail(options: MailOptions) {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_FROM_EMAIL}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function verifyMailConnection() {
  try {
    await transporter.verify();
    console.log("Mail server connection verified");
    return true;
  } catch (error) {
    console.error("Error verifying mail connection:", error);
    throw new Error("Mail server connection failed");
  }
}
