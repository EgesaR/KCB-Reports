import React from "react";
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
import { motion, AnimatePresence, AnimationOptions } from "framer-motion";
import SideBar from "./components/SideBar";
import AppBar from "./components/AppBar";
import TooltipButton from "./components/TooltipBtn";
import useMotionTimeline from "./hooks/useMotionTimeline";

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
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 0.5,
};

const INDICATOR_TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 1.5,
};

export function Layout({ children }: { children: React.ReactNode }) {
  const scope = useMotionTimeline(
    [
      [".bar-2", { height: 48 }, TRANSITION],
      [
        [".bar-1", { x: -24 }, TRANSITION],
        [".bar-3", { x: 24 }, TRANSITION],
      ],
      [
        [".bar-1", { height: 48, rotate: 90 }, TRANSITION],
        [".bar-3", { height: 48, rotate: -90 }, TRANSITION],
      ],
      [
        [".bar-1", { x: 48 }, TRANSITION],
        [".bar-3", { x: -48 }, TRANSITION],
      ],
      [
        [".bar-1", { rotate: 120, background: "#059669" }, TRANSITION],
        [".bar-2", { rotate: -120, background: "#34d399" }, TRANSITION],
        [".bar-3", { rotate: 90 }, TRANSITION],
      ],
      [
        [
          ".bar-1",
          { rotate: 0, x: 0, height: 96, background: "#FFFFFF" },
          { ...TRANSITION, delay: 2 },
        ],
        [
          ".bar-2",
          { rotate: 0, height: 96, background: "#FFFFFF" },
          { ...TRANSITION, delay: 2 },
        ],
        [
          ".bar-3",
          { rotate: 0, x: 0, height: 96, background: "#FFFFFF" },
          { ...TRANSITION, delay: 2 },
        ],
      ],
    ],
    Infinity
  );

  const bar = useMotionTimeline(
    [
      [".bar-4", { height: 2.5, top: "60%" }, INDICATOR_TRANSITION],
      [".bar-4", { top: "calc(1/2*100%)" }, INDICATOR_TRANSITION],
      [".bar-4", { height: 24, top: "calc(1/2*100%)" }, INDICATOR_TRANSITION],
    ],
    Infinity
  );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full h-screen overflow-hidden font-inter bg-zinc-100 dark:bg-zinc-950">
        <QueryClientProvider client={queryClient}>
          <div className="w-full h-full flex py-2 px-2.5 gap-2.5">
            <SideBar />
            <section className="flex-1 grow flex flex-col gap-2">
              <AppBar />
              <main className="h-full w-full bg-[#E8EBF3] p-2 rounded-lg overflow-auto">
                <div
                  ref={scope}
                  className="flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 bg-grid-zinc-900"
                >
                  <div
                    style={{
                      width: 48,
                      height: 96,
                    }}
                    className="bar-1 bg-white"
                  />
                  <div
                    style={{
                      width: 48,
                      height: 96,
                    }}
                    className="bar-2 bg-white"
                  />
                  <div
                    style={{
                      width: 48,
                      height: 96,
                    }}
                    className="bar-3 bg-white"
                  />
                  <div ref={bar}>
                    <motion.div
                      className="bg-purple-300 rounded-full absolute top-1/2 -translate-y-1/2 bar-4"
                      style={{ width: 4 }}
                    ></motion.div>
                  </div>
                </div>
              </main>
            </section>
          </div>
          <ScrollRestoration />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
