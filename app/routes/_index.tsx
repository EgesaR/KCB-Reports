import type { MetaFunction } from "@remix-run/node";
import React from "react";
import { FaRegHeart } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - KCB Reports" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Index() {
  return (
    <div className="flex min-h-screen overflow-hidden dark:bg-zinc-950 rounded-lg">
      <EventCard
        eventType="welcome"
        eventDate={`${new Date()}`}
        eventTitle="Welcome to KCB Reports"
        actions={[
          { text: "Join Now", action: () => {}, icon: <FaRegHeart /> },
          { text: "Edit", action: () => {} },
        ]}
      />
    </div>
  );
}

interface actionsProps {
  text: React.ReactNode
  action: () => void
  icon?: React.ReactNode
}

interface EventCardProps {
  eventType: string;
  eventDate: string;
  eventTitle: string;
  actions: actionsProps[];
}

const EventCard = ({eventType, eventDate, eventTitle, actions}:EventCardProps) => {
  return (
    <div className="px-6 py-2 w-full h-48 rounded-lg bg-gradient-to-br from-[#e6b3e6] via-[#e0b0e0] to-[#d6a3d6] flex flex-col justify-center gap-3">
      <span className="uppercase font-inter text-sm">{eventType}</span>
      <h1 className="text-4xl font-inter">{eventTitle}</h1>
      <div className="flex gap-2">
        {actions?.map((action, index) => (
          <button
            onClick={() => action.action()}
            key={index}
            className="flex gap-2 px-4 text-sm hover:cursor-pointer py-1.5 rounded-full bg-white dark:bg-black justify-center items-center"
          >
            {action.text}
            {action.icon}
          </button>
        ))}
      </div>
    </div>
  );
}