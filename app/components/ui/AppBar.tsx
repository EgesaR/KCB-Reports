"use client";

import React from "react";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { RiSettingsLine } from "react-icons/ri";
import { BsBell } from "react-icons/bs";
import { useDashboardContext } from "~/context/DashboardContext";

interface AppBarProps {
  unreadCount: number;
  onNotificationClick: () => void;
}

export const AppBar = ({ unreadCount, onNotificationClick }: AppBarProps) => {
  const { isMobile } = useDashboardContext();

  return (
    <div className="w-full h-full flex items-center justify-between px-2">
      <div className="flex items-center gap-2.5">
        {isMobile && (
          <>
            <button
              className="sm:hidden rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              type="button"
            >
              <IoMenu />
            </button>
            <label className="text-xl font-bold">KCB Reports</label>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          className="rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          type="button"
        >
          <IoSearch />
        </button>
        <button
          className="relative rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          type="button"
          onClick={onNotificationClick}
          aria-label={`Notifications ${
            unreadCount > 0 ? `(${unreadCount} unread)` : ""
          }`}
        >
          <BsBell />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          )}
        </button>
        <button
          className="rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          type="button"
        >
          <RiSettingsLine />
        </button>
        <button
          className="rounded-full border border-transparent p-1.5 text-center text-[21px] transition-all text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          type="button"
        >
          <FaUserCircle />
        </button>
      </div>
    </div>
  );
};
