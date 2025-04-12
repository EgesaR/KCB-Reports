import { useState } from "react";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { FaArrowLeft } from "react-icons/fa";
import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import Chip from "~/components/Chip";
import IconButton from "~/components/IconButton";
import reports from "~/data/reports.json";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiDotsVertical } from "react-icons/hi";
import ContextMenu from "~/components/ContextMenu";
import ReportDetailsModal from "~/components/ReportDetailsModal";

type ExamType = "AOI" | "EOT" | "BOT" | "MTE" | "TT";
type ReportStatus = "pending" | "in-progress" | "completed" | "archived";

interface Report {
  id: string;
  examType: ExamType;
  title: string;
  students: number;
  status: ReportStatus;
  lastUpdated: string;
  metadata: {
    averageScore: string;
    performance: string;
    highestSubject: string;
    lowestSubject: string;
    totalExams: number;
    grade: string;
    scoreDistribution: Record<string, number>;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    profilePicture: string | null;
  };
  marks: Array<{
    id: string;
    subject: string;
    mark: number;
  }>;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.report_id, "Missing reportId param");

  // Type assertion to ensure proper typing
  const reportData = reports as Report[];
  const report = reportData.find((r) => r.id === params.report_id);

  if (!report) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ report });
};

const ExamTypeBadge = ({ examType }: { examType: ExamType }) => {
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
    <span
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium 
      ${examColors[examType].light} dark:${examColors[examType].dark}`}
    >
      {examType}
    </span>
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

export default function Report() {
  const { report } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState<"report" | "presentation">(
    "report"
  );
  const data = []

  return (
    <div className="w-full min-h-[70vh] text-gray-900 dark:text-gray-100 pt-14 px-4">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            icon={<FaArrowLeft />}
            size="md"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          />

          <div className="flex gap-2 items-center">
            <ExamTypeBadge examType={report.examType} />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {report.title}
            </h1>
            <ContextMenu report={report} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip
            variant="outlined"
            isActive={activeForm === "report"}
            onClick={() => setActiveForm("report")}
            aria-pressed={activeForm === "report"}
          >
            Report Form
          </Chip>
          <Chip
            variant="outlined"
            isActive={activeForm === "presentation"}
            onClick={() => setActiveForm("presentation")}
            aria-pressed={activeForm === "presentation"}
          >
            Presentation Form
          </Chip>
        </div>
      </nav>

      {/* Form content based on activeForm state */}
      <div className="mt-6">
        {activeForm === "report" ? (
          <div className="p-6 pb-0 h-[74vh]">
            {data.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <img
                  src="/images/boy_on_the_hill.png"
                  alt="No Students"
                  className="w-74 h-74 rounded-full"
                />
                <h2 className="text-lg font-semibold mb-1 mt-4">
                  No Students Found
                </h2>
                <p className="font-thin">or add new student or reload</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Report Form</h2>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 pb-0 h-[74vh]">
            {data.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <img
                  src="/images/girl_on_the_hill.png"
                  alt="No Students"
                  className="w-74 h-74 rounded-full"
                />
                <h2 className="text-lg font-semibold mb-1 mt-4">
                  No Students Found
                </h2>
                <p className="font-thin">or add new student or reload</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Presentation Form
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
