// app/routes/index.tsx
import type { MetaFunction } from "@remix-run/node";
import React, { memo } from "react";
import { FaRegHeart } from "react-icons/fa";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Link } from "@remix-run/react";

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

interface Report {
  id: string;
  name: string;
  shared: Array<{
    src?: string;
    alt?: string;
    name?: string;
    href?: string;
  }>;
  status: string;
  lastUpdated: string;
}

const EventCard = memo(
  ({ eventType, eventDate, eventTitle, actions }: EventCardProps) => {
    return (
      <div
        className="w-full h-48 rounded-lg flex flex-col justify-center gap-3 px-6 py-2 bg-gradient-to-tl from-indigo-400 from- via-violet-300 via- to-purple-200 to-"
        style={
          {
            //background: `linear-gradient(to bottom right, var(--shape-color-01), var(--shape-color-02))`,
          }
        }
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
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-dark text-gray-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {action.text}
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

const sharedItems = [
  {
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  { name: "Chris Lynch", href: "#" },
  { name: "Maria Guan", href: "#" },
  { name: "Amil Evara", href: "#" },
  { name: "Ebele Egbuna", href: "#" },
  { name: "James Patel", href: "#" },
  { name: "Sophie Nguyen", href: "#" },
  { name: "Liam Carter", href: "#" },
  { name: "Aisha Khan", href: "#" },
];

const reports: Report[] = [
  {
    id: "1",
    name: "End of Term",
    shared: sharedItems.slice(0, 8),
    status: "Completed",
    lastUpdated: new Date("2025-06-10").toLocaleDateString(),
  },
  {
    id: "2",
    name: "Beginning of Term",
    shared: sharedItems.slice(0, 6),
    status: "In Progress",
    lastUpdated: new Date("2025-06-09").toLocaleDateString(),
  },
  {
    id: "3",
    name: "Activity Of Integration",
    shared: sharedItems.slice(0, 7),
    status: "Active",
    lastUpdated: new Date().toLocaleDateString(),
  },
  {
    id: "4",
    name: "Mid Term",
    shared: sharedItems.slice(0, 5),
    status: "Pending",
    lastUpdated: new Date("2025-06-08").toLocaleDateString(),
  },
  {
    id: "5",
    name: "Test 09",
    shared: sharedItems.slice(0, 4),
    status: "Draft",
    lastUpdated: new Date("2025-06-07").toLocaleDateString(),
  },
  {
    id: "6",
    name: "Resource Paper",
    shared: sharedItems.slice(0, 3),
    status: "Review",
    lastUpdated: new Date("2025-06-06").toLocaleDateString(),
  },
  {
    id: "7",
    name: "Quarterly Review",
    shared: sharedItems.slice(0, 7),
    status: "Completed",
    lastUpdated: new Date("2025-06-05").toLocaleDateString(),
  },
  {
    id: "8",
    name: "Project Proposal",
    shared: sharedItems.slice(0, 5),
    status: "In Progress",
    lastUpdated: new Date("2025-06-04").toLocaleDateString(),
  },
  {
    id: "9",
    name: "Annual Summary",
    shared: sharedItems.slice(0, 6),
    status: "Draft",
    lastUpdated: new Date("2025-06-03").toLocaleDateString(),
  },
  {
    id: "10",
    name: "Evaluation Report",
    shared: sharedItems.slice(0, 4),
    status: "Pending",
    lastUpdated: new Date("2025-06-02").toLocaleDateString(),
  },
  {
    id: "11",
    name: "Research Notes",
    shared: sharedItems.slice(0, 8),
    status: "Review",
    lastUpdated: new Date("2025-06-01").toLocaleDateString(),
  },
];

export default function Index() {
  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <EventCard
        eventType="welcome"
        eventDate={new Date().toLocaleDateString()}
        eventTitle="Welcome to KCB Reports"
        actions={[
          { text: "Join Now", action: () => {}, icon: <FaRegHeart /> },
          { text: "Edit", action: () => {} },
        ]}
      />
      <section className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Recent Reports
          </h3>
        </div>
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
          <ul className="py-2 mt-2" role="list">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex w-full text-sm py-3 px-3 last:border-0 border-b border-zinc-200 dark:border-zinc-700 items-center hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <Link
                  to={`/reports/${report.id}`}
                  className="flex w-full items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
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
                          >
                            <span className="font-medium">
                              {report.shared.filter((item) => item.name).length}
                              +
                            </span>
                          </MenuButton>
                          <MenuItems
                            className="w-48 z-10 transition-[margin,opacity] opacity-0 data-[open]:opacity-100 mb-2 bg-dark shadow-md rounded-lg p-2 dark:divide-neutral-700"
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
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
