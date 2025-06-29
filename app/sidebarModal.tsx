// app/components/SidebarModal.tsx
import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useTheme } from "./ThemeProvider";
import { CgHomeAlt } from "react-icons/cg";
import { TbBrandGoogleAnalytics, TbChartPie } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { IoClose, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const SidebarModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    document.addEventListener("toggleSidebarModal", handleToggle);
    return () =>
      document.removeEventListener("toggleSidebarModal", handleToggle);
  }, []);

  const mainButtons = [
    { label: "Home", route: "/", icon: <CgHomeAlt /> },
    { label: "Reports", route: "/reports", icon: <TbBrandGoogleAnalytics /> },
    { label: "Analytics", route: "/analytics", icon: <TbChartPie /> },
    { label: "Admin", route: "/admin", icon: <MdOutlineAdminPanelSettings /> },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-start z-50 md:hidden"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-64 bg-dark p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-800 dark:text-neutral-200">
            KCB Reports
          </span>
          <button
            className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 grid place-content-center"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="text-gray-800 dark:text-neutral-200" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {mainButtons.map((btn, index) => (
            <Link
              key={`modal-btn-${index}`}
              to={btn.route}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-neutral-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              {btn.icon}
              {btn.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-neutral-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
            onClick={toggleTheme}
          >
            {isDarkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-neutral-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
            onClick={() => setTheme("system")}
          >
            <IoSunnyOutline />
            Use System Preference
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarModal;
