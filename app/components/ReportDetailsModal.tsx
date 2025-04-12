"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ReportItem } from "~/types/reports";
import StatusBadge from "./StatusBadge";
import { motion } from "framer-motion";

export default function ReportDetailsModal({ report }: { report: ReportItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Report Details
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
        onClick={() => setOpen(false)} // Add click handler to close dialog
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50 dark:bg-black/70" />
        <div className="fixed inset-0 flex justify-end">
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }} // Changed to tween for smooth slide without bounce
            className="w-96 h-full overflow-y-auto p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white shadow-2xl rounded-l-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside panel from closing dialog
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-6 pb-4 space-y-1 border-b border-gray-200 dark:border-gray-700">
              <Dialog.Title className="text-xl font-semibold">
                Report Details
              </Dialog.Title>
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

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

            {/* Actions */}
            <div className="flex space-x-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow">
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white shadow">
                <TrashIcon className="w-5 h-5" />
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
}
