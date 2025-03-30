import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import styles from "./tailwind.css?url";
import { type IStaticMethods } from "preline/preline";
import { useEffect } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
];

export default function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const location = useLocation();

  useEffect(() => {
    import("preline/preline")
      .then(() => {
        window.HSStaticMethods.autoInit();
      })
      .catch((err) => console.error("Failed to load Preline:", err));
  }, [location.pathname]);

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="nunito-400 overflow-x-hidden bg-white dark:bg-neutral-950 text-black">
        <QueryClientProvider client={queryClient}>
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-1 bg-green-500 animate-pulse z-50" />
          )}
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}