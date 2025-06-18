import { v7 as uuid } from "uuid";
import type { MetaFunction } from "@remix-run/node";
import React, { memo, useRef, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { reports, Report, sharedItems } from "~/data/reports";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - KCB Reports" },
    { name: "description", content: "Welcome to KCB Reports Dashboard" },
  ];
};

interface ActionProps {
  text: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface EventCardProps {
  eventType: string;
  eventDate: string;
  eventTitle: string;
  actions: ActionProps[];
}

const EventCard = memo(
  ({ eventType, eventDate, eventTitle, actions }: EventCardProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-48 rounded-lg flex flex-col justify-center gap-3 px-6 py-2 bg-gradient-to-l from-purple-500 via-indigo-500 to-blue-500"
      >
        <span className="uppercase font-inter text-sm text-gray-800 dark:text-neutral-200">
          {eventType}
        </span>
        <h1 className="text-4xl font-inter text-gray-900 dark:text-white">
          {eventTitle}
        </h1>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-black text-white dark:bg-white dark:text-neutral-900 hover:bg-gray-700 dark:hover:bg-neutral-200 transition-colors"
            >
              {action.text}
              {action.icon}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }
);

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

export default function Index() {
  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <EventCard
        eventType="welcome"
        eventDate={new Date().toLocaleDateString()}
        eventTitle="Welcome to KCB Reports"
        actions={[
          {
            text: "Join Now",
            action: () => alert("Joining now!"),
            icon: <FaRegHeart className="fill-current" />,
          },
          { text: "Edit", action: () => alert("Editing dashboard") },
        ]}
      />
      <RecentList />
    </div>
  );
}
const RecentList = () => {
  const [recents, setRecents] = useState<Report[]>([]);
  const [selectedRecents, setSelectedRecents] = useState<Report[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });

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
  };

  useEffect(() => {
    setRecents(reports);
  }, []);

  return (
    <section className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Recent Reports
        </h3>
        <button className="px-2 py-1" onClick={addRecent}>
          Add
        </button>
        <button
          className="px-2 py-1 disabled:opacity-50"
          onClick={removeRecent}
          disabled={!selectedRecents.length}
        >
          Remove
        </button>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex w-full border-b border-gray-400 dark:border-neutral-600 py-2">
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
                className={`flex w-full text-sm py-3 px-3 last:border-0 border-b border-zinc-200 dark:border-neutral-700 items-center hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                  selectedRecents.includes(report)
                    ? "bg-blue-100 dark:bg-neutral-700"
                    : ""
                }`}
                onClick={() => selectRecent(report.id)}
              >
                <Link
                  to="#"
                  className="flex w-full items-center focus:outline-none"
                  prefetch="intent"
                  aria-label={`View details for ${report.name}`}
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
                    className={`flex-1 px-3 ${
                      selectedRecents.includes(report)
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    {report.lastUpdated}
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
