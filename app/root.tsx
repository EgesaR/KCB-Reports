import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import stylesHref from "~/tailwind.css?url";
import { ThemeProvider } from "~/components/ThemeProvider";
import { ReportProvider } from "~/contexts/ReportContext";
import AppContent from "./components/AppContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 5,
    },
  },
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesHref },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Inter:ital,wght@0,400;1,700&display=swap",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
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
      <body className="font-comfortaa text-foreground w-full h-screen overflow-hidden">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ReportProvider>
              <AppContent>
                <Outlet />
              </AppContent>

              <ScrollRestoration />
              <Scripts />
            </ReportProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
