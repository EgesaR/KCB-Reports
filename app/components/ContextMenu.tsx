"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HiDotsVertical } from "react-icons/hi";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ReportItem } from "~/types/reports";
import StatusBadge from "./StatusBadge";
import { FiInfo } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiFileExcel2Line, RiFileWord2Line } from "react-icons/ri";

const ContextMenu = ({ report }: { report: ReportItem }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        {/* Trigger Button */}
        <MenuButton
          onContextMenu={(e) => e.preventDefault()}
          className="flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none hover:bg-gray-200/40 dark:hover:bg-gray-700/40"
        >
          <HiDotsVertical size={16} />
        </MenuButton>

        {/* Dropdown Menu */}
        <MenuItems
          anchor="bottom"
          className="absolute right-0 mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:divide-neutral-700 dark:ring-neutral-700"
        >
          {/* First Section */}
          <div className="px-1 py-1">
            {/* New Export and Download with Submenu */}
            <Menu as="div" className="relative">
              <MenuItem>
                {({ active }) => (
                  <MenuButton
                    className={clsx(
                      active ? "bg-gray-100 dark:bg-neutral-700" : "",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-neutral-300"
                    )}
                  >
                    <MdOutlineFileDownload className="mr-2 h-4 w-4 text-gray-500 dark:text-neutral-400" />
                    Export and Download
                  </MenuButton>
                )}
              </MenuItem>
              <MenuItems
                anchor="right start"
                className="absolute left-full top-0 mt-0 w-56 rounded-md ml-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:ring-neutral-700"
              >
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={clsx(
                          active ? "bg-gray-100 dark:bg-neutral-700" : "",
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-neutral-300"
                        )}
                        onClick={() => console.log("Export to Excel")} // Placeholder for export logic
                      >
                        <RiFileExcel2Line className="mr-2 h-4 w-4 text-gray-500 dark:text-neutral-400" />
                        Export to Excel
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={clsx(
                          active ? "bg-gray-100 dark:bg-neutral-700" : "",
                          "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-neutral-300"
                        )}
                        onClick={() => console.log("Export to Word")} // Placeholder for export logic
                      >
                        <RiFileWord2Line className="mr-2 h-4 w-4 text-gray-500 dark:text-neutral-400" />
                        Export to Word
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => setModalOpen(true)}
                  className={clsx(
                    active ? "bg-gray-100 dark:bg-neutral-700" : "",
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-neutral-300"
                  )}
                >
                  <FiInfo className="mr-2 h-4 w-4 text-gray-500 dark:text-neutral-400" />
                  View Report Details
                </button>
              )}
            </MenuItem>
          </div>

          {/* Second Section */}
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-gray-100 dark:bg-neutral-700" : "",
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-neutral-300"
                  )}
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-neutral-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 010 14H3z"
                    />
                  </svg>
                  Mark as Unread
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      {/* Report Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
        as="div"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50 dark:bg-black/70" />
        <div className="fixed inset-0 flex justify-end">
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-96 h-full overflow-y-auto p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white shadow-2xl rounded-l-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-6 pb-4 space-y-1 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-xl font-semibold">
                Report Details
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {report.lastUpdated}
              </p>
            </div>

            {/* Sections */}
            <section className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Exam Information</h3>
              <div className="space-y-2">
                {[
                  ["Status", <StatusBadge status={report.status} />],
                  ["Students", report.students],
                  ["Average Score", report.metadata.averageScore],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <dt className="text-sm text-gray-600 dark:text-gray-300">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Performance</h3>
              <div className="space-y-2">
                {[
                  ["Highest Subject", report.metadata.highestSubject],
                  ["Lowest Subject", report.metadata.lowestSubject],
                  ["Grade", report.metadata.grade],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <dt className="text-sm text-gray-600 dark:text-gray-300">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
};

export default ContextMenu;