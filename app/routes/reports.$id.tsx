// app/routes/reports.$id.tsx
import { useParams } from "@remix-run/react";
import { useTheme } from "~/components/ThemeProvider";

export default function Report() {
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  return (
    <div className="p-4 bg-dark dark:text-neutral-200">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-200">
        Report {id}
      </h1>
      <p>Current theme: {isDarkMode ? "Dark" : "Light"}</p>
    </div>
  );
}
