import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  color?:
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink";
  className?: string;
};

export default function Badge({
  children,
  color = "gray",
  className = "",
}: BadgeProps) {
  const colorClasses = {
    gray: {
      light: "bg-gray-50 text-gray-600 ring-gray-500/10",
      dark: "dark:bg-gray-800/30 dark:text-gray-300 dark:ring-gray-500/20",
    },
    red: {
      light: "bg-red-50 text-red-700 ring-red-600/10",
      dark: "dark:bg-red-900/30 dark:text-red-300 dark:ring-red-600/30",
    },
    yellow: {
      light: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
      dark: "dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-600/30",
    },
    green: {
      light: "bg-green-50 text-green-700 ring-green-600/20",
      dark: "dark:bg-green-900/30 dark:text-green-300 dark:ring-green-600/30",
    },
    blue: {
      light: "bg-blue-50 text-blue-700 ring-blue-700/10",
      dark: "dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700/30",
    },
    indigo: {
      light: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
      dark: "dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700/30",
    },
    purple: {
      light: "bg-purple-50 text-purple-700 ring-purple-700/10",
      dark: "dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-700/30",
    },
    pink: {
      light: "bg-pink-50 text-pink-700 ring-pink-700/10",
      dark: "dark:bg-pink-900/30 dark:text-pink-300 dark:ring-pink-700/30",
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color].light} ${colorClasses[color].dark} ${className}`}
    >
      {children}
    </span>
  );
}
