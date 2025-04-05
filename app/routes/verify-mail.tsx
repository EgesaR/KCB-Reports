import { json } from "@remix-run/node";
import { verifyMailConnection } from "~/utils/mailer.server";

export const loader = async () => {
  try {
    await verifyMailConnection();
    return json({ status: "success", message: "Mail server is ready" });
  } catch (error) {
    return json(
      { status: "error", message: "Mail server connection failed" },
      { status: 500 }
    );
  }
};
