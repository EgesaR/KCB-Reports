import { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export const meta : MetaFunction = () => [
  {
    title: "Contact our dev team | Contact KCB Reports",
    description: "Welcome to KCB Reports!",
  },
];

const Contact = () => {
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme class to <html> and save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <div className="isolate bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-24 sm:py-32 lg:px-8 min-h-screen">
      {/* 🌗 Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed bottom-5 right-5 p-3 bg-gray-200 dark:bg-gray-800 rounded-full shadow-lg transition"
      >
        {theme === "dark" ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-900" />
        )}
      </button>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Contact Sales
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>

      <form className="mt-16 mx-auto max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Email
          </label>
          <input
            type="email"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Message
          </label>
          <textarea
            rows={4}
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 shadow-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 font-semibold shadow-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
