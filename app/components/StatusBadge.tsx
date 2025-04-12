import { ReportStatus } from "~/types/reports";

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const statusText = {
    pending: "pending",
    "in-progress": "in progress",
    completed: "completed",
    archived: "archived",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${
        status === "pending"
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300"
          : status === "in-progress"
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
          : status === "completed"
          ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
      }`}
    >
      {statusText[status]}
    </span>
  );
};


export default StatusBadge