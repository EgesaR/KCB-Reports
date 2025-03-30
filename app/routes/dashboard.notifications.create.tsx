// app/routes/dashboard.notifications.create.tsx
import { prisma } from "~/utils/prisma.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();

    const notificationData = {
      title: String(formData.get("title")),
      message: String(formData.get("message")),
      type: String(formData.get("type") || "GENERAL"),
      userId,
      date: new Date(),
      read: false,
      archived: false,
      // Remove createdAt and updatedAt if they don't exist in your model
    };

    if (!notificationData.title || !notificationData.message) {
      return json({ error: "Title and message are required" }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: notificationData,
    });

    return json({ notification: newNotification }, { status: 201 });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return json({ error: "Failed to create notification" }, { status: 500 });
  }
};
