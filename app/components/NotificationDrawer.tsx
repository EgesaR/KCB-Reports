"use client";

import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ArchiveBoxIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import type { Notification } from "~/routes/notifications";

interface NotificationDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onMarkAsRead?: (id: string) => void;
  onArchive?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
}

const tabs = [
  { id: "inbox", label: "Inbox" },
  { id: "all", label: "All" },
  { id: "archive", label: "Archive" },
];

const NotificationItem = ({
  notification,
  isSelected,
  onClick,
}: {
  notification: Notification;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.li
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className={`px-4 py-3 transition-colors ${
      isSelected
        ? "bg-blue-100 dark:bg-blue-900/30"
        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
    }`}
  >
    <div className="flex items-start cursor-pointer" onClick={onClick}>
      <div
        className={`flex-shrink-0 mr-3 border-2 rounded-full ${
          isSelected ? "border-blue-500" : "border-transparent"
        }`}
      >
        {notification.avatar && (
          <img
            className="h-10 w-10 rounded-full"
            src={notification.avatar}
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {notification.title}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-400 dark:text-gray-500">
          <span>
            {new Date(notification.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="mx-1">•</span>
          <span>
            {new Date(notification.date).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      {isSelected && (
        <div className="ml-2 text-blue-500">
          <CheckIcon className="h-5 w-5" />
        </div>
      )}
      {!notification.read && !isSelected && (
        <div className="ml-4 flex-shrink-0">
          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  </motion.li>
);

const NotificationSkeleton = () => (
  <div className="mx-auto w-full rounded-md border border-blue-300 p-4">
    <div className="flex animate-pulse space-x-4">
      <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="col-span-1 h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-2 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
);

export const NotificationDrawer = ({
  isOpen,
  setIsOpen,
  onMarkAsRead,
  onArchive,
  onDelete,
}: NotificationDrawerProps) => {
  const fetcher = useFetcher<{
    notifications: Notification[];
    unreadCount: number;
  }>();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isOpen && fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/notifications");
    }
  }, [isOpen, fetcher]);

  const handleMarkAsRead = (id: string) => {
    setIsPending(true);
    onMarkAsRead?.(id);
    setIsPending(false);
  };

  const handleArchive = () => {
    if (!fetcher.data?.notifications) return;

    const unreadIds = fetcher.data.notifications
      .filter((n) => !n.read)
      .map((n) => n.id);

    if (unreadIds.length > 0) {
      setIsPending(true);
      onArchive?.(unreadIds);
      setIsPending(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!fetcher.data?.notifications) return;

    const allIds = fetcher.data.notifications.map((n) => n.id);
    if (selectedNotifications.length === allIds.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(allIds);
    }
  };

  const handleMarkSelectedAsRead = () => {
    if (selectedNotifications.length === 0) return;

    setIsPending(true);
    selectedNotifications.forEach((id) => onMarkAsRead?.(id));
    setSelectedNotifications([]);
    setIsPending(false);
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;

    setIsPending(true);
    onDelete?.(selectedNotifications);
    setSelectedNotifications([]);
    setIsPending(false);
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                    transition={{
                      type: "spring",
                      damping: 30,
                      stiffness: 400,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-4">
                      <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                        Notifications
                        {isPending && (
                          <span className="ml-2 text-xs text-gray-500">
                            Updating...
                          </span>
                        )}
                      </Dialog.Title>
                      <div className="flex items-center gap-2">
                        {selectedNotifications.length > 0 ? (
                          <button
                            onClick={handleDeleteSelected}
                            disabled={isPending}
                            className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={handleArchive}
                            className="-mx-2 rounded px-2 py-1 text-gray-500 hover:text-gray-400 active:bg-gray-700 active:text-gray-300"
                            disabled={
                              isPending ||
                              !fetcher.data?.notifications?.some((n) => !n.read)
                            }
                          >
                            <ArchiveBoxIcon className="size-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          onClick={() => setIsOpen(false)}
                          disabled={isPending}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-4 pt-2">
                      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                              activeTab === tab.id
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            } relative px-3 py-2 text-sm font-medium transition-colors`}
                          >
                            {tab.label}
                            {activeTab === tab.id && (
                              <motion.span
                                layoutId="notificationTabIndicator"
                                className="absolute inset-0 z-10"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.6,
                                }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selection Actions */}
                    {selectedNotifications.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedNotifications.length} selected
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSelectAll}
                              className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              {selectedNotifications.length ===
                              fetcher.data?.notifications?.length
                                ? "Deselect all"
                                : "Select all"}
                            </button>
                            <button
                              onClick={handleMarkSelectedAsRead}
                              disabled={isPending}
                              className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              Mark as read
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative flex-1 overflow-y-auto">
                      {fetcher.state === "loading" ? (
                        <div className="p-4 space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <NotificationSkeleton key={i} />
                          ))}
                        </div>
                      ) : fetcher.data?.notifications.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                          <div className="h-12 w-12 text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="mt-4 text-sm text-gray-500">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        <AnimatePresence initial={false}>
                          <motion.ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {fetcher.data?.notifications.map((notification) => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                isSelected={selectedNotifications.includes(
                                  notification.id
                                )}
                                onClick={() => toggleSelect(notification.id)}
                              />
                            ))}
                          </motion.ul>
                        </AnimatePresence>
                      )}
                    </div>
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
