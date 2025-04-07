import { prisma } from "~/utils/prisma.server";
import type { Notification, NotificationType } from "~/types/blog";

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  return prisma.notification.create({
    data: {
      title: input.title,
      message: input.message,
      type: input.type,
      userId: input.userId,
      metadata: input.metadata
        ? JSON.parse(JSON.stringify(input.metadata))
        : null,
    },
  }) as Promise<Notification>;
}
