// app/root.tsx
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie") || "";
  const themeMatch = cookieHeader.match(/theme=([^;]*)/);
  let initialTheme: "light" | "dark" | "system" = "system";

  if (themeMatch && themeMatch[1]) {
    const theme = themeMatch[1];
    if (theme === "light" || theme === "dark" || theme === "system") {
      initialTheme = theme;
    }
  }

  return { initialTheme };
};

export default function App() {
  const { initialTheme } = useLoaderData<{
    initialTheme: "light" | "dark" | "system";
  }>();

  return (
    <html lang="en" data-theme={initialTheme === "dark" ? "dark" : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-comfortaa text-foreground w-full h-screen overflow-hidden">
        <ThemeProvider initialTheme={initialTheme}>
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
