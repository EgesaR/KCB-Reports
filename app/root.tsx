import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Navbar from "~/components/Navbar"
import Footer from "~/components/Footer";

import styles from "./tailwind.css?url"
export const links: LinksFunction = () => [
  {
    rel: "stylesheet", href: styles
  }, 
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
]
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden bg-white dark:bg-gray-950">
        <Navbar />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
