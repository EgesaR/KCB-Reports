import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sendMail } from "~/utils/mailer.server";

type ActionData = {
  success?: boolean;
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const to = formData.get("to");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (
    typeof to !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return json<ActionData>({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    await sendMail({
      to,
      subject,
      text: message,
    });
    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return json<ActionData>({ error: "Failed to send email" }, { status: 500 });
  }
};
