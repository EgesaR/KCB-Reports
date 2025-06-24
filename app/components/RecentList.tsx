import { v7 as uuid } from "uuid";
import React, { useRef, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useNavigate } from "@remix-run/react";
import {
  motion,
  AnimatePresence,
  useInView,
  usePresence,
  useAnimate,
} from "framer-motion";
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
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.3 },
  },
};

// Variants for the selection indicator animation
const indicatorVariants = {
  initial: { width: 0, left: "0%" },
  animate: { width: 4, left: "0%" },
  exit: { width: 0, left: "-10%" },
};

// Variants for menu items animation
const menuVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Variants for trash button animation
const trashBinVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// RecentList Component
const RecentList = () => {
  const [recents, setRecents] = useState<Report[]>([]);
  const [selectedRecents, setSelectedRecents] = useState<Report[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(listRef, { amount: 0.2, once: true });
  const navigate = useNavigate();

  // Define the context type for useLongPress
  interface LongPressContext {
    id: string;
  }

  // Use the long-press hook with click, double-click, and triple-click support
  const { action, handlers } = useLongPress<HTMLLIElement, LongPressContext>({
    onClick: (event, { id }) => {
      if (!selectionMode) {
        navigate(`/reports/${id}`, { preventScrollReset: false });
        console.log(`Navigated to report with ID: ${id}`);
      } else {
        event.preventDefault();
        event.stopPropagation();
        selectRecent(id);
        console.log(`Clicked report with ID: ${id}`);
      }
    },
    onDoubleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectRecent(id);
      console.log(`Double-clicked report with ID: ${id}`);
    },
    onTripleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectRecent(id);
      console.log(`Triple-clicked report with ID: ${id}`);
    },
    onLongPress: (event, { id }) => {
      event.preventDefault();
      setSelectionMode(true);
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
      url: `/reports/end-of-term`,
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
    setSelectionMode(false);
  };

  const clearAllRecents = () => {
    setRecents([]);
    setSelectedRecents([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

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

  useEffect(() => {
    setRecents(reports);
  }, []);

  useEffect(() => {
    setSelectAll(
      recents.length > 0 && selectedRecents.length === recents.length
    );
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
        <motion.div className="flex gap-2" layout>
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
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              onClick={removeRecent}
              disabled={!selectedRecents.length}
            >
              Remove Selected
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      <div className="flex flex-col overflow-hidden">
        <div className="flex w-full border-b border-gray-400 dark:border-neutral-600 py-2">
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
          className="py-2 pb-12 mt-2 max-h-[50vh] overflow-y-auto"
          role="list"
          layout
          layoutScroll
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
              <ReportItem
                key={report.id}
                report={report}
                selected={selectedRecents.includes(report)}
                selectionMode={selectionMode}
                selectedRecentsCount={selectedRecents.length}
                handlers={handlers({ id: report.id })}
                selectRecent={selectRecent}
                setRecents={setRecents}
                setSelectedRecents={setSelectedRecents}
                setSelectAll={setSelectAll}
                setSelectionMode={setSelectionMode}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
};

// ReportItem Component
const ReportItem = ({
  report,
  selected,
  selectionMode,
  selectedRecentsCount,
  handlers,
  selectRecent,
  setRecents,
  setSelectedRecents,
  setSelectAll,
  setSelectionMode,
}: {
  report: Report;
  selected: boolean;
  selectionMode: boolean;
  selectedRecentsCount: number;
  handlers: ReturnType<
    ReturnType<typeof useLongPress<HTMLLIElement, { id: string }>>["handlers"]
  >;
  selectRecent: (id: string) => void;
  setRecents: React.Dispatch<React.SetStateAction<Report[]>>;
  setSelectedRecents: React.Dispatch<React.SetStateAction<Report[]>>;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const indicatorRef = useRef<HTMLDivElement>(null);

  const removeSingleRecent = async () => {
    if (indicatorRef.current) {
      await animate(
        indicatorRef.current,
        { width: 0, left: "-10%" },
        { duration: 0.15, ease: "easeInOut" }
      );
    }
    await animate(
      scope.current,
      { scale: 1.025 },
      { duration: 0.125, ease: "easeIn" }
    );
    await animate(scope.current, { opacity: 0, x: -24 }, { duration: 0.3 });
    setRecents((prev) => prev.filter((r) => r.id !== report.id));
    setSelectedRecents((prev) => prev.filter((r) => r.id !== report.id));
    setSelectAll(false);
    setSelectionMode(false);
    if (safeToRemove) {
      safeToRemove();
    }
  };

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        if (indicatorRef.current) {
          await animate(
            indicatorRef.current,
            { width: 0, left: "-10%" },
            { duration: 0.15, ease: "easeInOut" }
          );
        }
        await animate(
          scope.current,
          { scale: 1.025 },
          { duration: 0.125, ease: "easeIn" }
        );
        await animate(scope.current, { opacity: 0, x: -24 }, { duration: 0.3 });
        if (safeToRemove) {
          safeToRemove();
        }
      };
      exitAnimation();
    }
  }, [isPresent, animate, safeToRemove]);

  return (
    <motion.li
      ref={scope}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`flex w-full text-sm py-3 px-3 last:border-0 border-b items-center hover:bg-gray-50 dark:hover:bg-neutral-800 relative report-item-${
        report.id
      } ${
        selected
          ? "bg-blue-100 dark:bg-neutral-700 hover:bg-blue-200 hover:dark:bg-neutral-800 border-zinc-200 dark:border-neutral-600"
          : "border-zinc-200 dark:border-neutral-700"
      }`}
      {...handlers}
    >
      <AnimatePresence>
        {selectionMode && selected && (
          <div className="overflow-hidden absolute left-0 h-full w-3">
            <motion.div
              ref={indicatorRef}
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
            checked={selected}
            onChange={() => selectRecent(report.id)}
            className="size-4 rounded border-gray-300 accent-purple-200"
            aria-label={`Select ${report.name}`}
          />
        </div>
      )}
      <div
        className="flex w-full items-center focus:outline-none relative cursor-pointer"
        aria-label={`View details for ${report.name}`}
      >
        <div
          className={`flex-1 px-3 ${
            selected
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
                className="[--placement:top-left] outline-none border-none ring-0 relative inline-flex"
                onClick={(e) => selectionMode && e.stopPropagation()}
              >
                <MenuButton
                  className="inline-flex items-center justify-center size-8 rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-2xs hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 dark:border-neutral-800"
                  aria-label={`Show ${
                    report.shared.filter((item) => item.name).length
                  } more shared users`}
                >
                  <span className="font-medium">
                    {report.shared.filter((item) => item.name).length}+
                  </span>
                </MenuButton>
                <AnimatePresence>
                  <MenuItems
                    as={motion.div}
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
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
            selected
              ? "text-gray-800 dark:text-white"
              : "text-gray-800 dark:text-neutral-200"
          }`}
        >
          {report.status}
        </div>
        <div
          className={`flex-1 px-3 pl-6 ${
            selected
              ? "text-gray-800 dark:text-white"
              : "text-gray-800 dark:text-neutral-200"
          }`}
        >
          {report.lastUpdated}
        </div>
        <div
          className={`flex-1 px-3 absolute right-0 ${
            selected
              ? "text-gray-800 dark:text-white"
              : "text-gray-800 dark:text-neutral-200"
          }`}
        >
          <AnimatePresence>
            {selectionMode && selected && selectedRecentsCount === 1 && (
              <motion.button
                variants={trashBinVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeSingleRecent();
                }}
                className="rounded bg-red-300/20 px-1.5 py-2 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                aria-label={`Delete ${report.name}`}
              >
                <FiTrash2 size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
};

export default RecentList;