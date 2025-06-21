import { v7 as uuid } from "uuid";
import React, { useRef, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { reports, Report, sharedItems } from "~/data/reports";
import useLongPress from "~/hooks/use-long-press";
import { FiTrash2 } from "react-icons/fi";

// Variants for the parent <ul> and child <li> elements
const listVariants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const itemVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
  },
};

// Variants for MenuItems animation
const menuVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const RecentList = () => {
  const [recents, setRecents] = useState<Report[]>([]);
  const [selectedRecents, setSelectedRecents] = useState<Report[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });

  // Define the context type for useLongPress
  interface LongPressContext {
    id: string;
  }

  // Use the long-press hook with the specific context type
  const { action, handlers } = useLongPress<HTMLLIElement, LongPressContext>({
    onClick: (event, { id }) => {
      if (selectionMode) {
        event.preventDefault(); // Prevent navigation when in selection mode
        selectRecent(id);
        console.log(`Clicked report with ID: ${id}`);
      }
      // Otherwise, allow Link navigation
    },
    onLongPress: (event, { id }) => {
      // No event.preventDefault() to avoid error
      setSelectionMode(true); // Enable selection mode on long press
      selectRecent(id);
      console.log(`Long-pressed report with ID: ${id}`);
    },
  });

  const addRecent = () => {
    const newId = uuid();
    const newRecent = {
      id: newId,
      name: "End of Term",
      shared: sharedItems.slice(0, 8),
      status: "Completed",
      lastUpdated: new Date("2025-06-10").toLocaleDateString(),
      body: { content: "Content for the end of term report." },
      type: "term-report",
      url: "/reports/end-of-term",
      toJSON: () => ({
        id: newId,
        name: "End of Term",
        status: "Completed",
      }),
    };

    setRecents((prev) => [...prev, newRecent]);
  };

  const selectRecent = (id: string) => {
    const report = recents.find((r) => r.id === id);
    if (report) {
      setSelectedRecents((prev) => {
        if (prev.includes(report)) {
          return prev.filter((i) => i.id !== id);
        } else {
          return [...prev, report];
        }
      });
    }
  };

  const removeRecent = () => {
    setRecents((prev) =>
      prev.filter((report) => !selectedRecents.includes(report))
    );
    setSelectedRecents([]);
    setSelectAll(false);
    setSelectionMode(false); // Exit selection mode
  };

  const removeSingleRecent = (id: string) => {
    setRecents((prev) => prev.filter((report) => report.id !== id));
    setSelectedRecents((prev) => prev.filter((report) => report.id !== id));
    setSelectAll(false);
    setSelectionMode(false); // Exit selection mode
  };

  const clearAllRecents = () => {
    setRecents([]);
    setSelectedRecents([]);
    setSelectAll(false);
    setSelectionMode(false); // Exit selection mode
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRecents([]);
      setSelectAll(false);
      setSelectionMode(false); // Exit selection mode
    } else {
      setSelectedRecents(recents);
      setSelectAll(true);
      setSelectionMode(true); // Ensure selection mode is active
    }
  };

  useEffect(() => {
    setRecents(reports);
  }, []);

  useEffect(() => {
    // Update selectAll state based on selectedRecents
    setSelectAll(
      recents.length > 0 && selectedRecents.length === recents.length
    );
    // Exit selection mode if no items are selected
    if (selectedRecents.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedRecents, recents]);

  return (
    <section className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Recent Reports
          </h3>
          {selectionMode && recents.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              ({selectedRecents.length} selected)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={addRecent}
          >
            Add
          </button>
          {recents.length > 0 && (
            <button
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={clearAllRecents}
            >
              Clear All
            </button>
          )}
          {selectionMode && selectedRecents.length > 1 && (
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              onClick={removeRecent}
              disabled={!selectedRecents.length}
            >
              Remove Selected
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex w-full border-b border-gray-400 dark:border-neutral-600 py-2">
          {selectionMode && recents.length > 0 && (
            <div className="w-10 px-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="size-4 rounded border-gray-300"
                aria-label="Select all reports"
              />
            </div>
          )}
          <div className="flex-1 px-3 font-medium text-gray-600 dark:text-neutral-400">
            Name
          </div>
          <div className="flex-1 px-3 font-medium text-gray-600 dark:text-neutral-400">
            Shared
          </div>
          <div className="flex-1 px-3 font-medium text-gray-600 dark:text-neutral-400">
            Status
          </div>
          <div className="flex-1 px-3 font-medium text-gray-600 dark:text-neutral-400">
            Last Updated
          </div>
        </div>
        <motion.ul
          ref={ref}
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="py-2 mt-2"
          role="list"
          layout
        >
          <AnimatePresence>
            {recents.length === 0 && (
              <motion.li
                key="empty"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                className="text-center font-semibold py-4"
              >
                There is nothing today.
              </motion.li>
            )}
            {[...recents].reverse().map((report) => (
              <motion.li
                key={report.id}
                variants={{
                  ...itemVariants,
                  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
                }}
                layout
                className={`flex w-full text-sm py-3 px-3 last:border-0 border-b items-center hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                  selectedRecents.includes(report)
                    ? "bg-blue-100 dark:bg-neutral-700 hover:bg-blue-200 hover:dark:bg-neutral-800 border-zinc-200 dark:border-neutral-600"
                    : "border-zinc-200 dark:border-neutral-700"
                }`}
                {...handlers({ id: report.id })}
              >
                {selectionMode && (
                  <div className="w-10 px-3">
                    <input
                      type="checkbox"
                      checked={selectedRecents.includes(report)}
                      onChange={() => selectRecent(report.id)}
                      className="size-4 rounded border-gray-300"
                      aria-label={`Select ${report.name}`}
                    />
                  </div>
                )}
                <Link
                  to={report.url}
                  className="flex w-full items-center focus:outline-none relative"
                  prefetch="intent"
                  aria-label={`View details for ${report.name}`}
                  onClick={(e) => {
                    if (selectionMode) {
                      e.preventDefault(); // Prevent navigation in selection mode
                    }
                  }}
                >
                  <div
                    className={`flex-1 px-3 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    {report.name}
                  </div>
                  <div className="flex-1 px-3">
                    <div className="flex -space-x-2">
                      {report.shared
                        .filter((item) => item.src)
                        .map((item, index) => (
                          <img
                            key={index}
                            className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
                            src={item.src}
                            alt={item.alt}
                          />
                        ))}
                      {report.shared.some((item) => item.name) && (
                        <Menu
                          as="div"
                          className="[--placement:top-left] outline-0 border-0 ring-0 relative inline-flex"
                        >
                          <MenuButton
                            className="inline-flex items-center justify-center size-8 rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-2xs hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:border-neutral-800"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Show ${
                              report.shared.filter((item) => item.name).length
                            } more shared users`}
                          >
                            <span className="font-medium">
                              {report.shared.filter((item) => item.name).length}
                              +
                            </span>
                          </MenuButton>
                          <AnimatePresence>
                            <MenuItems
                              as={motion.div}
                              variants={menuVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              className="w-48 z-10 mb-2 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:divide-neutral-700"
                              anchor="top start"
                            >
                              {report.shared
                                .filter((item) => item.name)
                                .map((item, index) => (
                                  <MenuItem key={index}>
                                    <a
                                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-neutral-700"
                                      href={item.href}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {item.name}
                                    </a>
                                  </MenuItem>
                                ))}
                            </MenuItems>
                          </AnimatePresence>
                        </Menu>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex-1 px-3 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    {report.status}
                  </div>
                  <div
                    className={`flex-1 px-3 pl-6 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    {report.lastUpdated}
                  </div>
                  <div
                    className={`flex-1 px-3 absolute right-0 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    {selectionMode &&
                      selectedRecents.length === 1 &&
                      selectedRecents.includes(report) && (
                        <motion.button
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ease: "easeInOut" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSingleRecent(report.id);
                          }}
                          className="rounded bg-red-300/20 px-1.5 py-2 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                        >
                          <FiTrash2 size={20} />
                        </motion.button>
                      )}
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
};

export default RecentList;
