// app/components/ReportList.tsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView, usePresence, useAnimate, Variants } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "@headlessui/react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { AvatarGroup, AvatarGroupTooltip } from "~/components/ui/avatar-group";
import { Report, SharedItem, sharedItems } from "~/data/reports";
import useLongPress from "~/hooks/useLongPress";
import { useSafeFormattedDate } from "~/hooks/useSafeFormattedDate";

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

const listVariants: Variants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  hidden: { opacity: 0 },
};

const indicatorVariants: Variants = {
  initial: { width: 0, left: "0%" },
  animate: { width: 4, left: "0%", transition: { ease: "easeInOut", duration: 0.15 } },
  exit: { width: 0, left: "-10%", transition: { ease: "easeInOut", duration: 0.15 } },
};

const menuVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { ease: "easeInOut", duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { ease: "easeInOut", duration: 0.2 } },
};

const trashBinVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { ease: "easeInOut", duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { ease: "easeInOut", duration: 0.2 } },
};

const itemVariants: Variants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, x: -24, transition: { duration: 0.3, ease: "easeInOut" } },
};

const isSharedItemWithAvatar = (item: SharedItem): item is SharedItemWithAvatar => {
  return "src" in item;
};

const isSharedItemWithName = (item: SharedItem): item is SharedItemWithName => {
  return "name" in item;
};

const defaultAvatarUrls = [
  "https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
  "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2).toUpperCase();
};

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

  const { handlers } = useLongPress<HTMLLIElement, LongPressContext>({
    onClick: (event: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>, { id }: LongPressContext) => {
      if (!selectionMode) {
        const report = reportsState.find((r) => r.id === id);
        if (report) handleNavigate(report.url);
      } else {
        event.preventDefault();
        event.stopPropagation();
        selectReport(id);
      }
    },
    onDoubleClick: (event: React.MouseEvent<HTMLLIElement>, { id }: LongPressContext) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      selectReport(id);
    },
    onTripleClick: (event: React.MouseEvent<HTMLLIElement>, { id }: LongPressContext) => {
      event.preventDefault();
      event.stopPropagation();
      setSelectionMode(true);
      setSelectedReports(reportsState);
      setSelectAll(true);
    },
    onLongPress: (event: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>, { id }: LongPressContext) => {
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
      reportsStateMemo.length > 0 && selectedReports.length === reportsStateMemo.length
    );
    setSelectionMode(selectedReports.length > 0);
  }, [selectedReports, reportsStateMemo]);

  return (
    <section className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="mb-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg sm:text-base font-semibold text-foreground">
            Recent Reports
          </h3>
          {selectionMode && reportsState.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({selectedReports.length} selected)
            </span>
          )}
        </div>
        <motion.div className="flex gap-2 sm:text-sm">
          <button
            className="px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            onClick={addReport}
          >
            Add
          </button>
          <button
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
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
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
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
                  className="px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50"
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
        <div className="flex w-full border-b border-border py-2">
          <div className="w-10 px-3">
            {selectionMode && reportsState.length > 0 && (
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                className="size-4 rounded border-border accent-primary"
                aria-label="Select all reports"
              />
            )}
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-muted-foreground">
            Name
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-muted-foreground">
            Shared
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-muted-foreground">
            Status
          </div>
          <div className="flex-1 sm:text-sm px-3 font-medium text-muted-foreground">
            Last Updated
          </div>
          <div className="w-10 px-3" />
        </div>
        <motion.ul
          ref={listRef}
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="py-2 pb-18 mt-2 max-h-[42vh] overflow-y-auto"
          role="list"
        >
          <AnimatePresence mode="popLayout">
            {sortedReports.length === 0 && (
              <motion.li
                key="empty"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center font-semibold py-4 min-h-12"
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
  const shouldAnimate = (report.shared?.length || 0) < 50;

  const removeSingleReport = async (): Promise<void> => {
    if (indicatorRef.current) {
      await animate(
        indicatorRef.current,
        { width: 0, left: "-10%" },
        { duration: 0.15, ease: "easeInOut" }
      );
    }
    await animate(scope.current, { opacity: 0, x: -24 }, { duration: 0.3, ease: "easeInOut" });
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
        await animate(scope.current, { opacity: 0, x: -24 }, { duration: 0.3, ease: "easeInOut" });
        if (safeToRemove) {
          safeToRemove();
        }
      };
      exitAnimation();
    }
  }, [isPresent, animate, safeToRemove]);

  const sharedItemsArray: SharedItem[] = report.shared ?? [];
  const avatarItems = useMemo(
    () => sharedItemsArray.filter(isSharedItemWithAvatar).slice(0, 4),
    [sharedItemsArray]
  );
  const nameItems = useMemo(
    () => sharedItemsArray.filter(isSharedItemWithName),
    [sharedItemsArray]
  );

  const extraCount = sharedItemsArray.length > 4 ? sharedItemsArray.length - 4 : 0;

  const avatarData = useMemo(() => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const avatar = avatarItems[i] || {};
      const name = nameItems[i] || { name: "Unknown User" };
      result.push({
        src: i < defaultAvatarUrls.length ? defaultAvatarUrls[i] : avatar.src || "",
        fallback: getInitials(name.name),
        tooltip: name.name,
      });
    }
    return result;
  }, [avatarItems, nameItems]);

  return (
    <motion.li
      ref={scope}
      variants={shouldAnimate ? itemVariants : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      animate={shouldAnimate ? "visible" : undefined}
      exit={shouldAnimate ? "exit" : undefined}
      className={`flex w-full text-sm sm:text-xs py-3 px-3 last:border-0 border-b items-center hover:bg-accent relative report-item-${
        report.id
      } min-h-12 ${
        selected
          ? "bg-accent hover:bg-accent/90 border-border"
          : "border-border"
      }`}
      {...handlers}
    >
      <AnimatePresence>
        {selectionMode && selected && (
          <motion.div
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            ref={indicatorRef}
            className="absolute left-0 h-full w-3 bg-primary"
          />
        )}
      </AnimatePresence>
      <div className="w-10 px-3">
        {selectionMode && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => selectRecent(report.id)}
            className="size-4 rounded border-border accent-primary"
            aria-label={`Select ${report.name}`}
          />
        )}
      </div>
      <div
        className="flex w-full items-center focus:outline-none relative cursor-pointer"
        aria-label={`View details for ${report.name}`}
      >
        <div
          className={`flex-1 px-3 ${
            selected ? "text-foreground" : "text-foreground"
          }`}
        >
          {report.name}
        </div>
        <div
          className="flex-1 px-3"
          onClick={(e) => selectionMode && e.stopPropagation()}
        >
          <div className="flex items-center">
            <AvatarGroup
              invertOverlap
              className="h-12 -space-x-2"
              tooltipProps={{ side: "bottom", sideOffset: 24 }}
              translateX="30%"
            >
              {avatarData.map((avatar, index) => (
                <Avatar
                  key={index}
                  className="size-11 border-3 border-background hover:z-10"
                >
                  <AvatarImage src={avatar.src} />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  <AvatarGroupTooltip>
                    <p>{avatar.tooltip}</p>
                  </AvatarGroupTooltip>
                </Avatar>
              ))}
            </AvatarGroup>
            {extraCount > 0 && (
              <Menu as="div" className="hs-dropdown [--placement:top-left] relative inline-flex ml-2">
                {({ open }) => (
                  <>
                    <Menu.Button
                      id="hs-avatar-group-dropdown"
                      className="hs-dropdown-toggle inline-flex items-center justify-center size-11 rounded-full bg-muted border-2 border-background font-medium text-foreground shadow-2xs align-middle hover:bg-muted/80 focus:outline-none focus:bg-muted/80 text-sm"
                      aria-haspopup="menu"
                      aria-expanded={open}
                      aria-label={`Show ${nameItems.length} more shared users`}
                    >
                      <span className="font-medium">+{extraCount}</span>
                    </Menu.Button>
                    <Menu.Items
                      as={motion.div}
                      variants={menuVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 z-10 transition-[margin,opacity] opacity-0 duration-300 mb-2 bg-background shadow-md rounded-lg p-2 border border-border"
                      aria-labelledby="hs-avatar-group-dropdown"
                    >
                      {nameItems.map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <a
                              className={`flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-foreground ${
                                active ? "bg-accent text-accent-foreground" : ""
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
        <div className="flex-1 px-3 text-muted-foreground">
          {report.status}
        </div>
        <div className="flex-1 px-3 text-muted-foreground">
          {useSafeFormattedDate(report.lastUpdated)}
        </div>
      </div>
      <div className="w-10 px-3">
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
            className="ml-2 text-destructive hover:text-destructive/90 focus:outline-none focus:ring focus:ring-destructive/50 rounded p-1"
            aria-label={`Remove ${report.name}`}
          >
            <FiTrash2 size={18} />
          </motion.button>
        )}
      </div>
    </motion.li>
  );
};

export default ReportList;