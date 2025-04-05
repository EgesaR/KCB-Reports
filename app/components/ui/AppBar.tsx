"use client";

import React, { useState } from "react";
import {
  IoMenu,
  IoSearch,
  IoPersonOutline,
  IoCreateOutline,
  IoMailOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { RiSettingsFill, RiSettingsLine } from "react-icons/ri";
import { BsBell } from "react-icons/bs";
import { useDashboardContext } from "~/context/DashboardContext";
import { useLocation, useNavigate } from "@remix-run/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Dialog Component
function LogoutDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-90 backdrop"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Confirm Logout
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <IoCloseOutline className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AppBarProps {
  unreadCount: number;
  onNotificationClick: () => void;
  user: {
    id: string;
    email: string;
    name: string;
    profileUrl: string;
  } | null;
}

export const AppBar = ({ unreadCount, onNotificationClick }: AppBarProps) => {
  const { isMobile } = useDashboardContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      // Call your logout API endpoint
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        navigate("/auth/signin");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-between px-2 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          {isMobile && (
            <>
              <button
                className="sm:hidden rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                type="button"
              >
                <IoMenu />
              </button>
              <label className="text-xl font-bold dark:text-white">
                KCB Reports
              </label>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            type="button"
          >
            <IoSearch />
          </button>
          <button
            className="relative rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            type="button"
            onClick={onNotificationClick}
            aria-label={`Notifications ${
              unreadCount > 0 ? `(${unreadCount} unread)` : ""
            }`}
          >
            <BsBell />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
              </span>
            )}
          </button>
          <button
            className="rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            type="button"
            onClick={() => navigate("/dashboard/settings")}
          >
            {location.pathname === "/dashboard/settings" ? (
              <RiSettingsFill />
            ) : (
              <RiSettingsLine />
            )}
          </button>

          {/* Improved Headless UI Menu with React Icons */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 cursor-pointer">
              <FaUserCircle className="text-[21px] text-slate-600 dark:text-slate-200" />
              <div className="flex flex-col">
                <label className="text-sm leading-none text-slate-700 dark:text-slate-200">
                  Egesa Raymond
                </label>
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Admin Account
                </label>
              </div>
              <FaChevronDown className="text-xs text-slate-600 dark:text-slate-200" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-600">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 gap-2`}
                      >
                        <IoPersonOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        My Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 gap-2`}
                      >
                        <IoCreateOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        Edit Profile
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 gap-2`}
                      >
                        <IoMailOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        Inbox
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 gap-2`}
                      >
                        <IoHelpCircleOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        Help
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowLogoutDialog(true)}
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100 gap-2`}
                      >
                        <IoLogOutOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
