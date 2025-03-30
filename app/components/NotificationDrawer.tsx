"use client";
import React, { useState, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ArchiveBoxIcon,
  CheckIcon,
  TrashIcon,
  ArrowPathIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string | Date;
  read: boolean;
  archived: boolean;
  userId: string;
  metadata?: Record<string, unknown> | null;
}

interface UpdateNotificationPayload {
  intent: "mark-as-read" | "archive" | "delete" | "create-test-data";
  ids: string[];
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

// Utility type guards with better type safety
function isNotification(obj: unknown): obj is Notification {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof obj.id === "string"
  );
}

function isNotificationsResponse(obj: unknown): obj is NotificationsResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "notifications" in obj &&
    Array.isArray(obj.notifications) &&
    obj.notifications.every(isNotification)
  );
}

const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch("/notifications");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();

    if (!isNotificationsResponse(data)) {
      console.error("Invalid API response format:", data);
      throw new Error("Received malformed notifications data");
    }

    return data.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title || "No title",
      message: notification.message || "",
      type: notification.type || "general",
      date: notification.date ? new Date(notification.date) : new Date(),
      read: Boolean(notification.read),
      archived: Boolean(notification.archived),
      userId: notification.userId || "",
      metadata: notification.metadata || null,
    }));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch notifications");
  }
};

const updateNotifications = async (
  payload: UpdateNotificationPayload
): Promise<void> => {
  try {
    const response = await fetch("/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update notifications:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update notifications");
  }
};

interface NotificationDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const tabs = [
  {
    id: "inbox",
    label: "Inbox",
    filter: (n: Notification) => !n.archived && !n.read,
  },
  {
    id: "all",
    label: "All",
    filter: (n: Notification) => !n.archived,
  },
  {
    id: "archive",
    label: "Archive",
    filter: (n: Notification) => n.archived,
  },
] as const;

const NotificationSkeleton = () => (
  <motion.div
    className="space-y-4 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse"
      />
    ))}
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    className="flex flex-col items-center justify-center p-6 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <BellIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
    </motion.div>
    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
      No notifications found
    </p>
  </motion.div>
);

const NotificationItem = React.memo(
  ({
    notification,
    onSelect,
    isSelected,
  }: {
    notification: Notification;
    onSelect: (id: string) => void;
    isSelected: boolean;
  }) => {
    const formattedDate = useMemo(() => {
      const date = new Date(notification.date);
      return date.toLocaleString();
    }, [notification.date]);

    return (
      <motion.li
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
          isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
        onClick={() => onSelect(notification.id)}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${
              !notification.read && !notification.archived
                ? "bg-blue-500"
                : "bg-transparent"
            }`}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <p className="text-sm font-medium truncate dark:text-gray-100">
                {notification.title}
              </p>
              <time
                className="text-xs text-gray-500 dark:text-gray-400"
                dateTime={new Date(notification.date).toISOString()}
              >
                {formattedDate}
              </time>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>
      </motion.li>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("inbox");
  const [selected, setSelected] = useState<string[]>([]);

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: isOpen,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setSelected([]);
    },
  });

  const currentTab = useMemo(
    () => tabs.find((t) => t.id === activeTab),
    [activeTab]
  );

  const filteredNotifications = useMemo(
    () => (currentTab ? notifications.filter(currentTab.filter) : []),
    [notifications, currentTab]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read && !n.archived).length,
    [notifications]
  );

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAction = (
    intent: UpdateNotificationPayload["intent"],
    ids: string[] = selected
  ) => {
    if (ids.length === 0) return;
    mutate({ intent, ids });
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <motion.div
                    className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-4">
                      <Dialog.Title className="text-lg font-medium dark:text-gray-100">
                        Notifications
                        {isPending && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            Updating...
                          </span>
                        )}
                      </Dialog.Title>
                      <div className="flex gap-2">
                        <button
                          onClick={() => refetch()}
                          disabled={isLoading || isPending}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          aria-label="Refresh notifications"
                        >
                          <ArrowPathIcon
                            className={`h-5 w-5 ${
                              isLoading ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          aria-label="Close notifications"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2 text-sm text-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                      >
                        {(error as Error).message}
                        <button
                          onClick={() => refetch()}
                          className="ml-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          Retry
                        </button>
                      </motion.div>
                    )}

                    <div className="px-4 pt-2">
                      <div className="flex space-x-1">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            disabled={isLoading || isPending}
                            className={`relative rounded-full px-3 py-1.5 text-sm transition-colors ${
                              activeTab === tab.id
                                ? "text-white bg-blue-500 dark:bg-blue-600"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
                            }`}
                            aria-current={
                              activeTab === tab.id ? "page" : undefined
                            }
                          >
                            {tab.label}
                            {tab.id === "inbox" && unreadCount > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full"
                              >
                                {unreadCount}
                              </motion.span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <NotificationSkeleton />
                        ) : error ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 text-center"
                          >
                            <p className="text-red-500 dark:text-red-400">
                              Failed to load notifications
                            </p>
                          </motion.div>
                        ) : filteredNotifications.length === 0 ? (
                          <EmptyState />
                        ) : (
                          <motion.ul
                            className="divide-y divide-gray-200 dark:divide-gray-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <AnimatePresence>
                              {filteredNotifications.map((notification) => (
                                <NotificationItem
                                  key={notification.id}
                                  notification={notification}
                                  onSelect={handleSelect}
                                  isSelected={selected.includes(
                                    notification.id
                                  )}
                                />
                              ))}
                            </AnimatePresence>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {selected.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                      >
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleAction("mark-as-read")}
                            disabled={isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50"
                          >
                            <CheckIcon className="h-4 w-4" />
                            Mark as read
                          </button>
                          <button
                            onClick={() => handleAction("archive")}
                            disabled={isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 disabled:opacity-50"
                          >
                            <ArchiveBoxIcon className="h-4 w-4" />
                            Archive
                          </button>
                          <button
                            onClick={() => handleAction("delete")}
                            disabled={isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
