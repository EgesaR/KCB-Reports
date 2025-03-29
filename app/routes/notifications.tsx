import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "message" | "alert" | "system";
  avatar?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // In a real app, fetch from database
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Message",
        message: "You have a new message from Sarah",
        date: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        type: "message",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "2",
        title: "System Update",
        message: "New features available",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        type: "system",
      },
      {
        id: "3",
        title: "Reminder",
        message: "Meeting starts in 15 minutes",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        type: "alert",
      },
    ];

    return json({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Notification load error:", error);
    return json({ error: "Failed to load notifications" }, { status: 500 });
  }
};
