import type { MetaFunction } from "@remix-run/node";
import React, { memo } from "react";
import { FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import RecentList from "~/components/RecentList";

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

