// app/routes/dashboard/reports.tsx

import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import reportsData from "~/data/reports.json";
import type {
  ReportItem,
  ActionData,
  ReportStatus,
  ExamType,
} from "~/types/reports";
import IconButton from "~/components/IconButton";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { Prisma } from "@prisma/client";

export const loader: LoaderFunction = async () => {
  return json({ reports: reportsData });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const reportId = formData.get("reportId") as string;
    const reportToDelete = reportsData.find((r) => r.id === reportId);

    if (!reportToDelete) {
      return json<ActionData>(
        {
          error: "Report not found",
          details: `Report with ID ${reportId} does not exist`,
        },
        { status: 404 }
      );
    }

    // Ensure the status field is of type ReportStatus
    const validStatus: ReportStatus = reportToDelete.status as ReportStatus;

    return json<ActionData>({
      success: true,
      count: 1,
      firstReport: {
        ...reportToDelete,
        description: null,
        metadata: reportToDelete.metadata as Prisma.JsonValue, // Explicitly cast metadata
        status: validStatus, // Ensure status is of type ReportStatus
      },
    });
  } catch (error) {
    return json<ActionData>(
      {
        error: "Failed to delete report",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};

export default function Reports() {
  const { reports } = useLoaderData<{ reports: ReportItem[] }>();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen text-gray-900 dark:text-gray-100 pt-12 px-4 overflow-x-hidden">
      <div className="flex items-center gap-4 mb-6 max-w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          Reports
        </h1>
      </div>
      <ReportsLayout reports={reports} />
    </div>
  );
}

const ReportsLayout = ({ reports }: { reports: ReportItem[] }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full overflow-x-hidden">
      <div className="overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm flex-1 w-full">
        <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <TableHeader />
          <TableBody reports={reports} />
        </table>
      </div>
    </div>
  );
};

const TableHeader = () => (
  <thead className="sticky top-0 z-20 bg-white dark:bg-neutral-900">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400 min-w-[180px] max-w-[280px]">
        Examination
      </th>
      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400 w-24">
        Students
      </th>
      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400 w-28">
        Status
      </th>
      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400 w-32">
        Last Updated
      </th>
      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400 w-20">
        Actions
      </th>
    </tr>
  </thead>
);

const TableBody = ({ reports }: { reports: ReportItem[] }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
    {reports.map((report) => (
      <ReportRow key={report.id} report={report} />
    ))}
  </tbody>
);

const ReportRow = ({ report }: { report: ReportItem }) => {
  const navigate = useNavigate();

  return (
    <motion.tr
      className="hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/dashboard/reports/${report.id}`)}
    >
      <td className="px-4 py-4 whitespace-nowrap min-w-[180px] max-w-[280px]">
        <ExamInfo report={report} />
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center w-24">
        {report.students}
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-center w-28">
        <StatusBadge status={report.status} />
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400 text-center w-32">
        {report.lastUpdated}
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-center w-20">
        <DeleteButton reportId={report.id} />
      </td>
    </motion.tr>
  );
};

const ExamInfo = ({ report }: { report: ReportItem }) => {
  const examColors = {
    AOI: {
      light: "bg-purple-100 text-purple-800",
      dark: "bg-purple-700/60 text-purple-200",
    },
    EOT: {
      light: "bg-red-100 text-red-800",
      dark: "bg-red-700/60 text-red-200",
    },
    BOT: {
      light: "bg-green-100 text-green-800",
      dark: "bg-green-700/60 text-green-200",
    },
    MTE: {
      light: "bg-blue-100 text-blue-800",
      dark: "bg-blue-700/60 text-blue-200",
    },
    TT: {
      light: "bg-yellow-100 text-yellow-800",
      dark: "bg-yellow-700/60 text-yellow-200",
    },
  };

  return (
    <div className="flex items-center">
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium 
        ${examColors[report.examType].light} dark:${
          examColors[report.examType].dark
        }`}
      >
        {getExamAbbreviation(report.title)}
      </span>
      <div className="ml-4 min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {report.title}
        </div>
        <div className="text-sm text-gray-500 dark:text-neutral-400 truncate">
          ID: {report.id}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const statusText = {
    pending: "pending",
    "in-progress": "in progress",
    completed: "completed",
    archived: "archived",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full inline-block min-w-[80px] text-center ${
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

const DeleteButton = ({ reportId }: { reportId: string }) => (
  <form method="post">
    <input type="hidden" name="reportId" value={reportId} />
    <button
      type="submit"
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
      aria-label="Delete report"
      onClick={(e) => e.stopPropagation()}
    >
      <FaTrash className="h-4 w-4" />
    </button>
  </form>
);

function getExamTitle(type: ExamType): string {
  const titles = {
    AOI: "Area of Interest Assessment",
    EOT: "End of Term Examination",
    BOT: "Beginning of Term Test",
    MTE: "Mid Term Evaluation",
    TT: "Topical Test",
  };
  return titles[type];
}

function getExamAbbreviation(title: string): string {
  const words = title.split(" ");
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  if (words.length === 2)
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
