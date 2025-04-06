import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Define TypeScript types
type Update = {
  id: number;
  version: string;
  title: string;
  date: string;
  status: "released" | "planned" | "security" | "improvement";
  description: string;
  features?: string[];
  type: "feature" | "improvement" | "security";
};

// Function to get status color
const getStatusColor = (status: Update["status"]): string => {
  switch (status) {
    case "released":
      return "bg-green-500";
    case "planned":
      return "bg-purple-500";
    case "security":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Function to get type icon
const getTypeIcon = (type: Update["type"]): string => {
  switch (type) {
    case "feature":
      return "✨";
    case "improvement":
      return "⚡";
    case "security":
      return "🛡️";
    default:
      return "•";
  }
};

// UpdateCard Component
const UpdateCard: React.FC<{ update: Update; index: number }> = ({
  update,
  index,
}) => {
  return (
    <motion.div
      key={update.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline Dot */}
      <div
        className={`absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full ${getStatusColor(
          update.status
        )} border-2 dark:border-gray-900 border-white transform -translate-x-1/2 z-10`}
      ></div>

      {/* Update Card */}
      <div
        className={`ml-6 md:ml-0 ${
          index % 2 === 0
            ? "md:pr-8 md:pl-0 md:text-right"
            : "md:pl-8 md:pr-0 md:text-left"
        }`}
      >
        <div className="p-6 rounded-xl shadow-lg border dark:bg-gray-800/80 dark:border-gray-700 bg-white border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700">
                {update.version}
              </span>
              <h2 className="text-xl font-bold mt-2">{update.title}</h2>
            </div>
            <span className="text-sm dark:text-gray-400 text-gray-500">
              {update.date}
            </span>
          </div>

          <p className="mt-3 dark:text-gray-300 text-gray-600">
            {getTypeIcon(update.type)} {update.description}
          </p>

          {update.features && (
            <ul className="mt-4 space-y-2 dark:text-gray-300 text-gray-700">
              {update.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 pt-4 border-t dark:border-gray-700 border-gray-200">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                update.status === "released"
                  ? "dark:bg-green-900/50 dark:text-green-300 bg-green-100 text-green-800"
                  : update.status === "planned"
                  ? "dark:bg-purple-900/50 dark:text-purple-300 bg-purple-100 text-purple-800"
                  : update.status === "security"
                  ? "dark:bg-red-900/50 dark:text-red-300 bg-red-100 text-red-800"
                  : "dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700"
              }`}
            >
              {update.status}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Updates Component
export default function Updates() {
  const [updates] = useState<Update[]>([
    {
      id: 1,
      version: "v3.2.0",
      title: "Advanced Analytics Dashboard",
      date: "June 2024 (Current)",
      status: "released",
      description:
        "New real-time analytics with custom report builder and export functionality.",
      features: [
        "Custom visualization widgets",
        "PDF/CSV export",
        "Data comparison tools",
      ],
      type: "feature",
    },
    {
      id: 2,
      version: "v3.1.5",
      title: "Performance Optimization",
      date: "May 2024",
      status: "released",
      description: "System-wide performance improvements and bug fixes.",
      features: [
        "40% faster load times",
        "Reduced memory usage",
        "Fixed 23 reported issues",
      ],
      type: "improvement",
    },
    // Add more updates as needed
  ]);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen gap-2 text-black dark:text-neutral-200">
      <div className="flex flex-col min-h-screen h-[90%] sm:h-auto sm:px-3 gap-8 sm:pt-[5%] pb-2 pr-5 sm:pr-6 overflow-y-auto">
        <h1 className="text-3xl font-bold">Product Version History</h1>
      </div>
    </div>
  );
}
