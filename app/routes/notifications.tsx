// app/routes/notifications._index.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { getUserId } from "~/utils/session.server";

// Type Definitions
const NOTIFICATION_TYPES = [
  "INFO",
  "WARNING",
  "ERROR",
  "TEST",
  "GENERAL",
  "ALERT",
  "SUCCESS",
] as const;

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  archived: boolean;
  type: NotificationType;
  userId: string;
}

export interface LoaderData {
  notifications: Notification[];
  unreadCount: number;
}

export interface ActionData {
  success?: boolean;
  error?: string;
}

// Loader Implementation
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<Response> => {
  const userId = await getUserId(request);
  if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 100,
      }),
      prisma.notification.count({
        where: {
          userId,
          read: false,
          archived: false,
        },
      }),
    ]);

    return json<LoaderData>({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return json<ActionData>(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
};

// Action Implementation
export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response> => {
  const userId = await getUserId(request);
  if (!userId) return json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const intent = formData.get("intent");

  // Handle test data creation
  if (intent === "create-test-data") {
    try {
      await prisma.notification.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          title: `Test Notification ${i + 1}`,
          message: `This is a test notification (#${i + 1})`,
          date: new Date(Date.now() - i * 60000),
          userId,
          read: false,
          archived: false,
          type: "TEST",
        })),
      });
      return json<ActionData>({ success: true });
    } catch (error) {
      return json<ActionData>(
        { error: "Failed to create test data" },
        { status: 500 }
      );
    }
  }

  // Handle batch operations
  const idsString = formData.get("ids");
  if (!idsString || typeof idsString !== "string") {
    return json<ActionData>(
      { error: "Invalid notification IDs" },
      { status: 400 }
    );
  }

  let ids: string[];
  try {
    ids = JSON.parse(idsString);
    if (!Array.isArray(ids)) throw new Error("Invalid IDs format");
  } catch (error) {
    return json<ActionData>({ error: "Invalid IDs format" }, { status: 400 });
  }

  try {
    const baseCondition = {
      id: { in: ids },
      userId,
    };

    switch (intent) {
      case "mark-as-read":
        await prisma.notification.updateMany({
          where: baseCondition,
          data: { read: true },
        });
        break;
      case "archive":
        await prisma.notification.updateMany({
          where: baseCondition,
          data: { archived: true },
        });
        break;
      case "delete":
        await prisma.notification.deleteMany({
          where: baseCondition,
        });
        break;
      default:
        return json<ActionData>(
          { error: "Invalid action type" },
          { status: 400 }
        );
    }

    return json<ActionData>({ success: true });
  } catch (error) {
    return json<ActionData>(
      { error: "Failed to process notifications" },
      { status: 500 }
    );
  }
};
