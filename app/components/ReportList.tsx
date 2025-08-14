// ~/components/ReportList.tsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  usePresence,
  useAnimate,
} from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "@headlessui/react";

// Import report data and types
import { Report, SharedItem, sharedItems } from "~/data/reports";
import useLongPress from "~/hooks/useLongPress";
import { useSafeFormattedDate } from "~/hooks/useSafeFormattedDate";

// Type definitions
interface SharedItemWithAvatar {
  src: string;
  alt: string;
}

interface SharedItemWithName {
  name: string;
  href: string;
}

interface LongPressContext {
  id: string;
}

interface ReportListProps {
  reports?: Report[];
}

interface ReportItemProps {
  report: Report;
  selected: boolean;
  selectionMode: boolean;
  selectedRecentsCount: number;
  handlers: {
    onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLLIElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLLIElement>) => void;
    onTouchStart: (e: React.TouchEvent<HTMLLIElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLLIElement>) => void;
  };
  selectRecent: (id: string) => void;
  setRecents: React.Dispatch<React.SetStateAction<Report[]>>;
  setSelectedRecents: React.Dispatch<React.SetStateAction<Report[]>>;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Animation variants
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

const indicatorVariants = {
  initial: { width: 0, left: "0%" },
  animate: { width: 4, left: "0%" },
  exit: { width: 0, left: "-10%" },
};

const menuVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

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

// Type guard functions
const isSharedItemWithAvatar = (
  item: SharedItem
): item is SharedItemWithAvatar => {
  return "src" in item;
};

const isSharedItemWithName = (item: SharedItem): item is SharedItemWithName => {
  return "name" in item;
};

// ReportList Component
const ReportList: React.FC<ReportListProps> = ({ reports = [] }) => {
  const [reportsState, setReportsState] = useState<Report[]>(reports);
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const listRef = useRef<HTMLUListElement>(null);
  const isInView = useInView(listRef, { amount: 0.2, once: true });
  const navigate = useNavigate();

  const reportsStateMemo = useMemo(() => reportsState, [reportsState]);

  const sortedReports = useMemo(() => {
    return [...reportsStateMemo].sort((a, b) => {
      const dateA = new Date(a.lastUpdated);
      const dateB = new Date(b.lastUpdated);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }, [reportsStateMemo, sortOrder]);

  const handleNavigate = (url: string): void => {
    navigate(url);
  };

  const { action, handlers } = useLongPress<HTMLLIElement, LongPressContext>({
    onClick: (
      event: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>,
      { id }: LongPressContext
    ) => {
      if (!selectionMode) {
        const report = reportsState.find((r) => r.id === id);
        if (report) handleNavigate(report.url);
      } else {
        event.preventDefault();
        event.stopPropagation();
        selectReport(id);
      }
    },
    onDoubleClick: (
      event: React.MouseEvent<HTMLLIElement>,
      { id }: LongPressContext
    ) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectReport(id);
    },
    onTripleClick: (
      event: React.MouseEvent<HTMLLIElement>,
      { id }: LongPressContext
    ) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      setSelectedReports(reportsState); // Select all reports on triple-click
      setSelectAll(true);
    },
    onLongPress: (
      event: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>,
      { id }: LongPressContext
    ) => {
      // Note: event is a mock event, so avoid calling preventDefault/stopPropagation
      setSelectionMode(true);
      selectReport(id);
    },
  });

  const addReport = (): void => {
    const newId = uuidv4();
    const newReport: Report = {
      id: newId,
      name: "New Report",
      shared: sharedItems.slice(0, 8),
      status: "Draft",
      lastUpdated: new Date().toISOString(),
      body: { content: "Content for the new report." },
      type: "generic-report",
      url: `/reports/${newId}`,
      toJSON: () => ({
        id: newId,
        name: "New Report",
        status: "Draft",
      }),
    };

    setReportsState((prev) => [...prev, newReport]);
  };

  const selectReport = (id: string): void => {
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

  const removeReports = (): void => {
    setReportsState((prev) =>
      prev.filter((report) => !selectedReports.includes(report))
    );
    setSelectedReports([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  const clearAllReports = (): void => {
    setReportsState([]);
    setSelectedReports([]);
    setSelectAll(false);
    setSelectionMode(false);
  };

  const toggleSelectAll = (): void => {
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

  useEffect(() => {
    setReportsState(reports);
  }, [reports]);

  useEffect(() => {
    setSelectAll(
      reportsStateMemo.length > 0 &&
        selectedReports.length === reportsStateMemo.length
    );
    setSelectionMode(selectedReports.length > 0);
  }, [selectedReports, reportsStateMemo]);

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
          <button
            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? "↓" : "↑"}
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
          className="pt-2 pb-[10px] mt-2 max-h-[41.5vh] h-auto overflow-y-auto"
          role="list"
          layout
          layoutScroll
        >
          <AnimatePresence mode="popLayout">
            {sortedReports.length === 0 && (
              <motion.li
                key="empty"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center font-semibold pt-4"
              >
                There is nothing today.
              </motion.li>
            )}
            {sortedReports.map((report) => (
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
const ReportItem: React.FC<ReportItemProps> = ({
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
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = (report.shared?.length || 0) < 50; // Disable animations for large lists

  const removeSingleReport = async (): Promise<void> => {
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
      const exitAnimation = async (): Promise<void> => {
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

  const sharedItemsArray: SharedItem[] = report.shared ?? [];

  return (
    <motion.li
      ref={scope}
      variants={shouldAnimate ? itemVariants : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      animate={shouldAnimate ? "visible" : undefined}
      exit={shouldAnimate ? "exit" : undefined}
      layout={shouldAnimate}
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
            {sharedItemsArray
              .filter(isSharedItemWithAvatar)
              .map((item, index) => (
                <img
                  key={index}
                  className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-gray-900"
                  src={item.src}
                  alt={item.alt}
                />
              ))}
            {sharedItemsArray.some(isSharedItemWithName) && (
              <Menu as="div" className="relative inline-flex">
                {({ open }) => (
                  <>
                    <Menu.Button
                      as="button"
                      className="inline-flex items-center justify-center size-8 rounded-full bg-gray-100 border-2 border-white font-medium text-gray-700 shadow-2xs hover:bg-gray-200 focus:outline-none focus:bg-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:border-gray-800"
                      aria-label={`Show ${
                        sharedItemsArray.filter(isSharedItemWithName).length
                      } more shared users`}
                    >
                      <span className="font-medium">
                        {sharedItemsArray.filter(isSharedItemWithName).length}+
                      </span>
                    </Menu.Button>
                    <Menu.Items
                      as={motion.div}
                      variants={menuVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 z-50"
                    >
                      {sharedItemsArray
                        .filter(isSharedItemWithName)
                        .map((item, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <a
                                className={`flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 ${
                                  active
                                    ? "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                    : "dark:text-gray-400"
                                }`}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                    </Menu.Items>
                  </>
                )}
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
          onClick={(e: React.MouseEvent) => {
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
        >
          <FiTrash2 size={18} />
        </motion.button>
      )}
    </motion.li>
  );
};

export default ReportList;
