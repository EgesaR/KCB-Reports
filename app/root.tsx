import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

import styles from "./tailwind.css?url";

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

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden bg-white dark:bg-gray-950">
        {/* Show a loading bar or spinner when navigating */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-green-500 animate-pulse z-50" />
        )}

        <Navbar />

        <main className="min-h-screen">
          <Outlet />
        </main>

        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
