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
import { reports as initialReports, Report, sharedItems } from "~/data/reports";
import useLongPress from "~/hooks/useLongPress";
import { FiTrash2 } from "react-icons/fi";
import { useSafeFormattedDate } from "~/hooks/useSafeFormattedDate";

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

// ReportList Component
const ReportList = ({ reports = [] }: { reports: Report[] }) => {
  const [reportsState, setReportsState] = useState<Report[]>([]);
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
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
        selectReport(id);
        console.log(`Clicked report with ID: ${id}`);
      }
    },
    onDoubleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectReport(id);
      console.log(`Double-clicked report with ID: ${id}`);
    },
    onTripleClick: (event, { id }) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectReport(id);
      console.log(`Triple-clicked report with ID: ${id}`);
    },
    onLongPress: (event, { id }) => {
      event.preventDefault();
      setSelectionMode(true);
      selectReport(id);
      console.log(`Long-pressed report with ID: ${id}`);
    },
  });

  const addReport = () => {
    const newId = uuid();
    const newReport: Report = {
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

    setReportsState((prev) => [...prev, newReport]);
  };

  const selectReport = (id: string) => {
    const report = reportsState.find((r) => r.id === id);
    if (report) {
      setSelectedReports((prev) => {
        if (prev.includes(report)) {
          return prev.filter((i) => i.id !== id);
        } else {
          return [...prev, report];
        }
      });
    }
  };

  const removeReports = () => {
    setReportsState((prev) =>
      prev.filter((report) => !selectedReports.includes(report))
    );
    setSelectedReports([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  const clearAllReports = () => {
    setReportsState([]);
    setSelectedReports([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedReports([]);
      setSelectAll(false);
      setSelectionMode(false);
    } else {
      setSelectedReports(reportsState);
      setSelectAll(true);
      setSelectionMode(true);
    }
  };

  // Initialize reports state only once or when 'reports' changes
  useEffect(() => {
    setReportsState(reports);
  }, [reports]);

  // Update selectAll and selectionMode properly, avoiding infinite loops
  useEffect(() => {
    setSelectAll(
      reportsState.length > 0 && selectedReports.length === reportsState.length
    );
    if (selectedReports.length === 0) {
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
    }
  }, [selectedReports, reportsState]);
  console.log("Report List Date: ", reports);

  return (
    <section className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg sm:text-base font-semibold text-gray-800 dark:text-gray-200">
            Recent Reports
          </h3>
          {selectionMode && reportsState.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({selectedReports.length} selected)
            </span>
          )}
        </div>
        <motion.div className="flex gap-2 sm:text-sm">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={addReport}
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
                {reportsState.length > 0 && (
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={clearAllReports}
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
                  onClick={removeReports}
                  disabled={!selectedReports.length}
                >
                  Remove Selected
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className="flex flex-col overflow-hidden">
        <div className="flex w-full border-b border-gray-400 dark:border-gray-600 py-2">
          {selectionMode && reportsState.length > 0 && (
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
          <div className="flex-1 sm:text-sm px-3 font-medium text-gray-600 dark:text-gray-400">
            Name
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-gray-600 dark:text-gray-400">
            Shared
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-gray-600 dark:text-gray-400">
            Status
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-gray-600 dark:text-gray-400">
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
            {reportsState.length === 0 && (
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
            {[...reportsState].reverse().map((report) => (
              <ReportItem
                key={report.id}
                report={report}
                selected={selectedReports.includes(report)}
                selectionMode={selectionMode}
                selectedRecentsCount={selectedReports.length}
                handlers={handlers({ id: report.id })}
                selectRecent={selectReport}
                setRecents={setReportsState}
                setSelectedRecents={setSelectedReports}
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

  const removeSingleReport = async () => {
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

  // Make sure shared is always an array
  const sharedItems = report.shared ?? [];
  console.log("Report date: ", report.lastUpdated);

  return (
    <motion.li
      ref={scope}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`flex w-full text-sm sm:text-xs py-3 px-3 last:border-0 border-b items-center hover:bg-gray-50 dark:hover:bg-gray-700 relative report-item-${
        report.id
      } ${
        selected
          ? "bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 hover:dark:bg-gray-800 border-zinc-200 dark:border-gray-600"
          : "border-zinc-200 dark:border-gray-700"
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
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {report.name}
        </div>
        <div
          className="flex-1 px-3"
          onClick={(e) => selectionMode && e.stopPropagation()}
        >
          <div className="flex -space-x-2">
            {sharedItems
              .filter(
                (item): item is { src: string; alt: string } => "src" in item
              )
              .map((item, index) => (
                <img
                  key={index}
                  className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-gray-900"
                  src={item.src}
                  alt={item.alt}
                />
              ))}
            {sharedItems.some(
              (item): item is { name: string; href: string } => "name" in item
            ) && (
              <Menu
                as="div"
                className="[--placement:top-left] outline-none border-none ring-0 relative inline-flex"
                onClick={(e) => selectionMode && e.stopPropagation()}
              >
                <MenuButton
                  className="inline-flex items-center justify-center size-8 rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-2xs hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:border-gray-800"
                  aria-label={`Show ${
                    sharedItems.filter(
                      (item): item is { name: string; href: string } =>
                        "name" in item
                    ).length
                  } more shared users`}
                >
                  <span className="font-medium">
                    {
                      sharedItems.filter(
                        (item): item is { name: string; href: string } =>
                          "name" in item
                      ).length
                    }
                    +
                  </span>
                </MenuButton>
                <AnimatePresence>
                  <MenuItems
                    as={motion.div}
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-48 z-10 mb-2 bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:divide-gray-700"
                    anchor="top start"
                  >
                    {sharedItems
                      .filter(
                        (item): item is { name: string; href: string } =>
                          "name" in item
                      )
                      .map((item, index) => (
                        <MenuItem key={index}>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 data-[focus]:bg-gray-100 data-[focus]:dark:bg-gray-700"
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
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
        <div className="flex-1 px-3 text-gray-600 dark:text-gray-400">
          {report.status}
        </div>
        <div className="flex-1 px-3 text-gray-600 dark:text-gray-400">
          {useSafeFormattedDate(report.lastUpdated)}
        </div>
      </div>

      {selectionMode && selectedRecentsCount > 0 && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            removeSingleReport();
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={trashBinVariants}
          whileHover={{ scale: 1.25 }}
          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring focus:ring-red-500 rounded p-1"
          aria-label={`Remove ${report.name}`}
          tabIndex={-1}
        >
          <FiTrash2 size={18} />
        </motion.button>
      )}
    </motion.li>
  );
};

export default ReportList;
