import React, { useState, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import SidebarModal from "./components/SidebarModal";
import Card from "./components/Card";
import { AnimatePresence, motion } from "framer-motion";
import SideSheet from "./components/SideSheet";
import AppBar from "./components/AppBar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap",
    as: "style",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap",
  },
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    as: "style",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [openSideSheet, setOpenSideSheet] = useState<string | null>(null);
  const { pathname } = useLocation();

  const handleSave = async (): Promise<boolean> => {
    console.log("Saving...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  const handleUndo = (): void => {
    console.log("Undo action");
  };

  const handleRedo = (): void => {
    console.log("Redo action");
  };

  const toggleSideSheet = (id: string) => {
    console.log(
      "Toggling SideSheet:",
      id,
      "Current openSideSheet:",
      openSideSheet
    );
    setOpenSideSheet((prev) => (prev === id ? null : id));
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="w-full h-screen overflow-hidden font-comfortaa">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <div className="w-full h-full flex flex-col py-2 px-0 sm:px-2.5 gap-2.5">
              {pathname === "/reports/" ? (
                <Header
                  title="Document Editor"
                  mode={mode}
                  setMode={setMode}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  onSave={handleSave}
                  toggleSideSheet={toggleSideSheet}
                  openSideSheet={openSideSheet}
                />
              ) : (
                <AppBar />
              )}
              <div className="flex-1 h-full flex gap-2">
                <SideBar toggleSideSheet={toggleSideSheet} />

                <AnimatePresence>
                  <section className="flex-1 h-[90%] grow flex flex-col gap-2">
                    <motion.main className="h-full relative w-full flex gap-4 p-2 px-1 sm:p-2 transition-all duration-500">
                      <Card className="w-full ease-in-out transition-all duration-300 text-white">
                        <button
                          onClick={() => toggleSideSheet("settings")}
                          className="bg-blue-600 px-4 py-2 rounded"
                        >
                          Open Settings
                        </button>
                        {children}
                      </Card>
                      <SideSheet
                        id="settings"
                        isOpen={openSideSheet === "settings"}
                        setIsOpen={toggleSideSheet}
                        className="z-50"
                      >
                        <div className="text-white">
                          <p>Settings Panel Content</p>
                          <button className="mt-2 bg-blue-600 px-4 py-2 rounded">
                            Adjust Settings
                          </button>
                        </div>
                      </SideSheet>
                      <SidebarModal />
                    </motion.main>
                  </section>
                </AnimatePresence>
              </div>
            </div>
            <ScrollRestoration />
            <Scripts />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
