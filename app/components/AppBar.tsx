// app/components/AppBar.tsx
import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiAdjustmentsHorizontal, HiOutlineUser } from "react-icons/hi2";
import { IoSearch, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { useTheme } from "./ThemeProvider";

interface User {
  name: string;
  email: string;
  avatar: string;
  status: "online" | "offline" | "away";
  notifications: number;
}

const AppBar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const user: User = {
    name: "Bonnie Green",
    email: "name@flowbite.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: "online",
    notifications: 3,
  };

  return (
    <nav className="w-full py-1.5 px-3 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button
          className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center md:hidden"
          aria-label="Open menu"
          onClick={() =>
            document.dispatchEvent(new Event("toggleSidebarModal"))
          }
        >
          <svg
            className="w-5 h-5 text-gray-800 dark:text-neutral-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="font-semibold text-[17px] text-gray-800 dark:text-neutral-200">
          KCB Reports
        </span>
      </div>

      <div className="flex gap-1.5">
        <button
          className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center"
          aria-label="Search"
        >
          <IoSearch className="text-gray-800 dark:text-neutral-200" />
        </button>
        <button
          className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center"
          aria-label="Settings"
        >
          <HiAdjustmentsHorizontal className="text-gray-800 dark:text-neutral-200" />
        </button>
        <button
          className="h-8 w-8 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/80 grid place-content-center"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <IoSunnyOutline className="text-gray-800 dark:text-neutral-200" />
          ) : (
            <IoMoonOutline className="text-gray-800 dark:text-neutral-200" />
          )}
        </button>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="h-8 w-8 rounded-lg bg-zinc-200/90 dark:bg-zinc-800/90 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 grid place-content-center focus-visible:outline-none">
              {user ? (
                <div className="relative group">
                  <img
                    className="w-8 h-8 rounded-full ring-2 ring-zinc-300 dark:ring-zinc-500 object-cover"
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    width="32"
                    height="32"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-800 ${
                      user.status === "online"
                        ? "bg-green-400"
                        : user.status === "offline"
                        ? "bg-gray-400"
                        : "bg-yellow-400"
                    }`}
                    title={
                      user.status.charAt(0).toUpperCase() + user.status.slice(1)
                    }
                  ></span>
                  {user.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {user.notifications}
                    </span>
                  )}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                    {user.name} -{" "}
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    {user.notifications > 0 && ` (${user.notifications} new)`}
                  </div>
                </div>
              ) : (
                <HiOutlineUser
                  className="text-gray-800 dark:text-neutral-200"
                  aria-hidden="true"
                />
              )}
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-md bg-dark shadow-lg ring-1 ring-black/5 transition focus:outline-none dark:divide-zinc-800 dark:ring-white/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200">
              <div>{user.name}</div>
              <div className="font-medium truncate">{user.email}</div>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200"
                >
                  Account settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200"
                >
                  Support
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200"
                >
                  Notifications ({user.notifications})
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200"
                >
                  Share
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:text-zinc-200 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200"
                >
                  Add to favorites
                </a>
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm bg-red-300/20 text-red-300 transition-colors data-focus:bg-red-600 data-focus:text-red-200"
                >
                  Sign out
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
};

export default AppBar;
