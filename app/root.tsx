import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "~/tailwind.css?url";
import { ThemeProvider } from "~/components/ThemeProvider";
import AppContent from "~/components/AppContent";
import { ReportProvider } from "~/contexts/ReportContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      <body className="w-full h-screen overflow-hidden font-comfortaa">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ReportProvider>
              <AppContent>{children}</AppContent>
              <ScrollRestoration />
              <Scripts />
            </ReportProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
