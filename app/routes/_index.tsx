import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import React, { memo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import RecentList from "~/components/ReportList";
import SideSheet from "~/components/SideSheet";
import { json } from "@remix-run/node";
import { reports as serverReports, sharedItems } from "~/data/reports";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - KCB Reports" },
    { name: "description", content: "Welcome to KCB Reports Dashboard" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // In a real app, fetch from DB here
  return json({ reports: serverReports });
}

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
        className="w-full h-[40rem] rounded-lg flex flex-col justify-center gap-3 px-6 py-2 sm:py-6 bg-gradient-to-l from-purple-500 via-indigo-500 to-blue-500"
      >
        <span className="uppercase font-inter text-sm text-gray-800 dark:text-neutral-200">
          {eventType}
        </span>
        <h1 className="text-4xl sm:text-2xl font-inter text-gray-900 dark:text-white">
          {eventTitle}
        </h1>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button key={index} onClick={action.action} className="btn">
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
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const { reports } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2.5 h-full pt-4 overflow-hidden relative">
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
          { text: "Edit", action: () => setIsSideSheetOpen(true) },
        ]}
      />
      <RecentList reports={reports} />
      <SideSheet
        id="dashboardSettings"
        isOpen={isSideSheetOpen}
        setIsOpen={() => setIsSideSheetOpen(false)}
        className="absolute top-0 right-0 h-full w-1/3 bg-white dark:bg-gray-800 shadow-lg z-50"
      >
        <div className="p-4">
          <h2>Dashboard Settings</h2>
          <p>Customize your dashboard here.</p>
        </div>
      </SideSheet>
    </div>
  );
}
