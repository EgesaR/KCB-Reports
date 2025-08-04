// app/routes/reports.tsx
import type { MetaFunction } from "@remix-run/react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { v7 as uuid } from "uuid";
import { useRef, useState, useEffect } from "react";
import { reports, type Report, sharedItems } from "~/data/reports";
import useLongPress from "~/hooks/use-long-press";
import { FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

// Types
interface SharedAvatar {
  src: string;
  alt: string;
}

interface SharedUser {
  name: string;
  href: string;
}

type SharedItem = SharedAvatar | SharedUser;

// Animation Variants
const listVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  hidden: { opacity: 0 },
};

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, x: -24, transition: { duration: 0.3 } },
};

const indicatorVariants = {
  initial: { width: 0, left: "0%" },
  animate: { width: 4, left: "0%" },
  exit: { width: 0, left: "-10%" },
};

const trashBinVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// Loader
export async function loader() {
  return { reports } as { reports: Report[] };
}

// Meta Function
export const meta: MetaFunction<typeof loader> = () => {
  return [
    { title: "KCB Reports - Reports" },
    { name: "description", content: "View all reports in KCB Reports" },
  ];
};

// Component
export default function Reports() {
  const { reports: initialReports } = useLoaderData<{ reports: Report[] }>();
  const [recents, setRecents] = useState<Report[]>(initialReports);
  const [selectedRecents, setSelectedRecents] = useState<Report[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(listRef, { amount: 0.2, once: true });
  const navigate = useNavigate();

  //console.log("DATABASE_URL", import.meta.env.VITE_DATABASE_URL);
  // Long-press context
  interface LongPressContext {
    id: string;
  }

  // Long-press handlers
  const { handlers } = useLongPress<HTMLLIElement, LongPressContext>({
    onClick: (event, { id }) => {
      if (!selectionMode) {
        navigate(`/reports/${id}`);
      } else {
        event.preventDefault();
        event.stopPropagation();
        selectRecent(id);
      }
    },
    onDoubleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectRecent(id);
    },
    onTripleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectRecent(id);
    },
    onLongPress: (event, { id }) => {
      event.preventDefault();
      setSelectionMode(true);
      selectRecent(id);
    },
  });

  // Add a new report
  const addRecent = () => {
    const newId = uuid();
    const newRecent: Report = {
      id: newId,
      name: `New Report ${newId.slice(0, 4)}`,
      shared: sharedItems.slice(0, 4),
      status: "Draft",
      lastUpdated: new Date().toLocaleDateString(),
      body: { content: "Content for the new report." },
      type: "report",
      url: `/reports/${newId}`,
      toJSON: () => ({
        id: newId,
        name: `New Report ${newId.slice(0, 4)}`,
        status: "Draft",
      }),
    };
    setRecents((prev) => [...prev, newRecent]);
  };

  // Select a report
  const selectRecent = (id: string) => {
    const report = recents.find((r) => r.id === id);
    if (report) {
      setSelectedRecents((prev) =>
        prev.includes(report)
          ? prev.filter((i) => i.id !== id)
          : [...prev, report]
      );
    }
  };

  // Remove selected reports
  const removeRecent = () => {
    setRecents((prev) =>
      prev.filter((report) => !selectedRecents.includes(report))
    );
    setSelectedRecents([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  // Clear all reports
  const clearAllRecents = () => {
    setRecents([]);
    setSelectedRecents([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRecents([]);
      setSelectAll(false);
      setSelectionMode(false);
    } else {
      setSelectedRecents(recents);
      setSelectAll(true);
      setSelectionMode(true);
    }
  };

  // Manage select-all and selection mode state
  useEffect(() => {
    setSelectAll(
      recents.length > 0 && selectedRecents.length === recents.length
    );
    if (selectedRecents.length === 0) {
      setSelectionMode(false);
    }
  }, [selectedRecents, recents]);

  return (
    <div className="flex flex-col gap-4 min-h-screen p-4 reports">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
            All Reports
          </h1>
          {selectionMode && recents.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              ({selectedRecents.length} selected)
            </span>
          )}
        </div>
        <motion.div className="flex gap-2">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={addRecent}
            aria-label="Add new report"
          >
            Add
          </button>
          <AnimatePresence mode="popLayout">
            {selectionMode && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex gap-2"
              >
                {recents.length > 0 && (
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={clearAllRecents}
                    aria-label="Clear all reports"
                  >
                    Clear All
                  </button>
                )}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  onClick={removeRecent}
                  disabled={!selectedRecents.length}
                  aria-label="Remove selected reports"
                >
                  Remove Selected
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Reports List Section */}
      <div className="flex flex-col">
        <div className="flex w-full border-b border-gray-200 dark:border-neutral-700 py-2">
          {selectionMode && recents.length > 0 && (
            <div className="w-10 px-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="size-4 rounded border border-red-300 accent-purple-200"
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
          ref={listRef}
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="py-2 mt-2 h-full overflow-y-auto"
          role="list"
          aria-label="List of reports"
        >
          <AnimatePresence mode="popLayout">
            {recents.length === 0 && (
              <motion.li
                key="empty"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center font-semibold py-4"
              >
                There is nothing today.
              </motion.li>
            )}
            {[...recents].reverse().map((report) => (
              <motion.li
                key={report.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex w-full text-sm py-3 px-3 last:border-0 border-b items-center hover:bg-gray-50 dark:hover:bg-neutral-700 relative ${
                  selectedRecents.includes(report)
                    ? "bg-blue-100 dark:bg-neutral-700 hover:bg-blue-200 hover:dark:bg-neutral-800 border-zinc-200 dark:border-neutral-600"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
                {...handlers({ id: report.id })}
                role="listitem"
                aria-label={`Report: ${report.name}`}
              >
                <AnimatePresence>
                  {selectionMode && selectedRecents.includes(report) && (
                    <div className="overflow-hidden absolute left-0 h-full w-3">
                      <motion.div
                        variants={indicatorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ ease: "easeInOut", duration: 0.15 }}
                        className="h-full bg-purple-300 absolute left-0"
                      />
                    </div>
                  )}
                </AnimatePresence>
                {selectionMode && (
                  <div className="w-10 px-3">
                    <input
                      type="checkbox"
                      checked={selectedRecents.includes(report)}
                      onChange={() => selectRecent(report.id)}
                      className="size-4 rounded border-gray-300 accent-purple-200"
                      aria-label={`Select ${report.name}`}
                    />
                  </div>
                )}
                <Link
                  to={`/reports/${report.id}`}
                  className="flex w-full items-center focus:outline-none"
                  prefetch="intent"
                  aria-label={`View details for ${report.name}`}
                  onClick={(e) => {
                    if (selectionMode) {
                      e.preventDefault();
                      selectRecent(report.id);
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
                  <div
                    className="flex-1 px-3"
                    onClick={(e) => selectionMode && e.stopPropagation()}
                  >
                    <div className="flex -space-x-2">
                      {report.shared
                        .filter((item): item is SharedAvatar => "src" in item)
                        .map((item, index) => (
                          <img
                            key={index}
                            className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-neutral-900"
                            src={item.src}
                            alt={
                              item.alt || `Avatar for shared user ${index + 1}`
                            }
                            aria-label={`Avatar for shared user ${index + 1}`}
                          />
                        ))}
                      {report.shared.some(
                        (item): item is SharedUser => "name" in item
                      ) && (
                        <Menu
                          as="div"
                          className="[--placement:top-left] outline-none border-none ring-0 relative inline-flex"
                          onClick={(e) => selectionMode && e.stopPropagation()}
                        >
                          <MenuButton
                            className="inline-flex items-center justify-center size-8 rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-2xs hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:border-neutral-800"
                            aria-label={`Show ${
                              report.shared.filter(
                                (item): item is SharedUser => "name" in item
                              ).length
                            } more shared users`}
                          >
                            <span className="font-medium">
                              {
                                report.shared.filter(
                                  (item): item is SharedUser => "name" in item
                                ).length
                              }
                              +
                            </span>
                          </MenuButton>
                          <AnimatePresence>
                            <MenuItems
                              as={motion.div}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="w-48 z-10 mb-2 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:divide-neutral-700"
                              anchor="top start"
                            >
                              {report.shared
                                .filter(
                                  (item): item is SharedUser => "name" in item
                                )
                                .map((item, index) => (
                                  <MenuItem key={index}>
                                    <a
                                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 data-[focus]:bg-gray-100 dark:data-[focus]:bg-neutral-700"
                                      href={item.href}
                                      onClick={(e) => e.stopPropagation()}
                                      aria-label={`Profile for ${item.name}`}
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
                        : "text-gray-600 dark:text-neutral-400"
                    }`}
                  >
                    {report.status}
                  </div>
                  <div
                    className={`flex-1 px-3 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-neutral-400"
                    }`}
                  >
                    {format(new Date(report.lastUpdated), "MMMM d, yyyy")}
                  </div>
                </Link>
                <div className="flex-1 px-3 absolute right-0">
                  <AnimatePresence>
                    {selectionMode &&
                      selectedRecents.includes(report) &&
                      selectedRecents.length === 1 && (
                        <motion.button
                          variants={trashBinVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecents((prev) =>
                              prev.filter((r) => r.id !== report.id)
                            );
                            setSelectedRecents((prev) =>
                              prev.filter((r) => r.id !== report.id)
                            );
                            setSelectAll(false);
                            setSelectionMode(false);
                          }}
                          className="rounded bg-red-300/20 px-1.5 py-2 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                          aria-label={`Delete ${report.name}`}
                        >
                          <FiTrash2 size={20} />
                        </motion.button>
                      )}
                  </AnimatePresence>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}
