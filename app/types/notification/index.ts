// ~/types/notification.ts

/**
 * Notification type variants with descriptions and display properties
 */
export const NOTIFICATION_TYPES = {
  GENERAL: {
    value: "GENERAL",
    label: "General",
    color: "bg-gray-100 text-gray-800",
  },
  ALERT: {
    value: "ALERT",
    label: "Alert",
    color: "bg-yellow-100 text-yellow-800",
  },
  WARNING: {
    value: "WARNING",
    label: "Warning",
    color: "bg-orange-100 text-orange-800",
  },
  INFO: {
    value: "INFO",
    label: "Info",
    color: "bg-blue-100 text-blue-800",
  },
  SUCCESS: {
    value: "SUCCESS",
    label: "Success",
    color: "bg-green-100 text-green-800",
  },
  ERROR: {
    value: "ERROR",
    label: "Error",
    color: "bg-red-100 text-red-800",
  },
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;

/**
 * Base notification interface with stricter typing
 */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: Date | string; // Accepts both Date object and ISO string
  read: boolean;
  archived: boolean;
  type: NotificationType;
  userId: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Enhanced preview version with utility properties
 */
export type NotificationPreview = Pick<
  AppNotification,
  "id" | "title" | "message" | "date" | "read" | "archived" | "type"
> & {
  isNew?: boolean;
  dateHumanized?: string; // Formatted date string
  typeInfo?: (typeof NOTIFICATION_TYPES)[NotificationType]; // Full type info
};

/**
 * Strictly typed DTO for creating notifications with validation
 */
export interface CreateNotificationDto
  extends Pick<AppNotification, "title" | "message" | "userId"> {
  /**
   * Notification type - defaults to "GENERAL" if not specified
   * @default "GENERAL"
   */
  type?: NotificationType;
  metadata?: Record<string, unknown>;
}

/**
 * Comprehensive response shape for notification actions
 */
export interface NotificationActionResponse<
  T = AppNotification | NotificationPreview
> {
  success: boolean;
  error?: {
    message: string;
    code?: string;
    field?: keyof CreateNotificationDto;
    details?: Record<string, unknown>;
  };
  notification?: T;
  count?: number;
  warnings?: string[];
  pagination?: {
    total: number;
    page: number;
    perPage: number;
  };
}

/**
 * Extended DTO for updating notifications with audit fields
 */
export interface UpdateNotificationDto {
  read?: boolean;
  archived?: boolean;
  metadata?: Record<string, unknown>;
  updatedBy?: string;
  updatedAt?: Date | string;
}

/**
 * Advanced filter options with pagination support
 */
export interface NotificationFilters {
  read?: boolean;
  archived?: boolean;
  type?: NotificationType | NotificationType[];
  afterDate?: Date | string;
  beforeDate?: Date | string;
  search?: string;
  userId?: string | string[];
  limit?: number;
  offset?: number;
  sortBy?: "date" | "read" | "type";
  sortOrder?: "asc" | "desc";
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  total: number;
  read: number;
  unread: number;
  byType: Record<NotificationType, number>;
}

/**
 * Helper type for the raw notification type values
 */
export type NotificationTypeValue =
  (typeof NOTIFICATION_TYPES)[NotificationType]["value"];

/**
 * Helper function to get notification type by value
 */
export function getNotificationTypeByValue(
  value: string
): (typeof NOTIFICATION_TYPES)[NotificationType] | undefined {
  return Object.values(NOTIFICATION_TYPES).find((type) => type.value === value);
}
