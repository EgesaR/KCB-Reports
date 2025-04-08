// app/routes/verify-mail.tsx
import { json } from "@remix-run/node";
import { verifyMailConnection } from "~/utils/mailer.server";

export const loader = async () => {
  try {
    const isReady = await verifyMailConnection();
    return json({ status: isReady ? "success" : "error" });
  } catch (error) {
    return json(
      { status: "error", message: "Mail server connection failed" },
      { status: 500 }
    );
  }
};
