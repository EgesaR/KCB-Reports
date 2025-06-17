import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { reports, Report } from "~/data/reports";
import { useRef } from "react";
import useLongPress from "~/hooks/use-long-press";

export const meta: MetaFunction = () => {
  return [
    { title: "KCB Reports - Reports" },
    { name: "description", content: "View all reports in KCB Reports" },
  ];
};

export default function Reports() {
   const handleClick = () => {
    console.log("Hello Wolrd")
   }
  
  const { action, handlers } = useLongPress({ onClick: handleClick})
  
  return (
    <div className="flex flex-col gap-4 min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
          All Reports
        </h1>
      </motion.div>
      <div className="flex flex-col">
        <div className="flex w-full border-b border-gray-200 dark:border-neutral-700 py-2">
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
          className="py-2 mt-2"
          role="list"
          transition={{
            staggerChildren: 0.07,
            delayChildren: 0.05,
            staggerDirection: -1,
          }}
        >
          {reports.map((report, index) => (
            <motion.li
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                y: { stiffness: 1000, velocity: -100 },
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="flex w-full text-sm py-3 px-3 last:border-0 border-b border-zinc-200 dark:border-zinc-700 items-center hover:bg-gray-50 dark:hover:bg-neutral-700"
              {...handlers}
            >
              <Link
                to="#"//{`/reports/${report.id}`}
                className="flex w-full items-center focus:outline-none"
                prefetch="intent"
                aria-label={`View details for ${report.name}`}
              >
                <div className="flex-1 px-3 text-gray-800 dark:text-neutral-200">
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
                            {report.shared.filter((item) => item.name).length}+
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
                <div className="flex-1 px-3 text-gray-600 dark:text-neutral-400">
                  {report.status}
                </div>
                <div className="flex-1 px-3 text-gray-600 dark:text-neutral-400">
                  {report.lastUpdated}
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
