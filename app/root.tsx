import React, { useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./tailwind.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import SidebarModal from "./components/SidebarModal";
import Card from "./components/Card";
import { motion } from "framer-motion";
import SideSheet from "./components/SideSheet";

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

  const handleSave = async () => {
    console.log("Saving...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  const handleUndo = () => {
    console.log("Undo action");
  };

  const handleRedo = () => {
    console.log("Redo action");
  };

  const toggleSideSheet = (id: string) => {
    console.log(
      "Toggling SideSheet:",
      id,
      "Current openSideSheet:",
      openSideSheet
    );
    setOpenSideSheet(openSideSheet === id ? null : id);
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
              <div className="flex-1 flex gap-2">
                <SideBar />
                <section className="flex-1 grow flex flex-col gap-2">
                  <motion.main className="h-full relative w-full flex gap-4 p-2 px-1 mt-14 sm:p-2 transition-all duration-500">
                    <Card className="w-1/2 ease-in-out transition-all duration-300">
                      <Outlet />
                    </Card>
                    <SideSheet
                      id="control"
                      isOpen={openSideSheet === "control"}
                      setIsOpen={() => toggleSideSheet("control")}
                    >
                      <div className="text-white">
                        <p>Control Panel Content</p>
                        <button className="mt-2 bg-blue-600 px-4 py-2 rounded">
                          Custom Action
                        </button>
                      </div>
                    </SideSheet>
                    <SideSheet
                      id="settings"
                      isOpen={openSideSheet === "settings"}
                      setIsOpen={() => toggleSideSheet("settings")}
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
