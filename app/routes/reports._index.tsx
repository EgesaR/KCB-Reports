// app/routes/reports.tsx
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  motion,
  AnimatePresence,
  usePresence,
  useAnimate,
} from "framer-motion";
import { v7 as uuid } from "uuid";
import { useRef, useEffect, useState } from "react";
import useLongPress from "~/hooks/useLongPress";
import type { Report, SharedItem } from "~/data/reports";
import { reports as serverReports, sharedItems } from "~/data/reports";

// ----------------- Remix meta & loader -----------------
export const meta: MetaFunction = () => {
  return [
    { title: "Reports" },
    { name: "description", content: "List of reports" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // In a real app, fetch from DB here
  return json({ initialReports: serverReports });
}

// ----------------- Variants -----------------
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 },
};

// ----------------- Report Item -----------------
function ReportItem({
  report,
  index,
  selected,
  toggleSelect,
  removeReport,
  navigate,
  totalSelected,
}: {
  report: Report;
  index: number;
  selected: boolean;
  toggleSelect: (id: string) => void;
  removeReport: (id: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  totalSelected: number;
}) {
  const sharedItems = report.shared ?? [];

  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  // Use recommended useLongPress hook usage
  const { handlers } = useLongPress<HTMLElement, { id: string }>({
    onClick: (_, context) => toggleSelect(context.id),
    onDoubleClick: (_, context) => navigate(`/reports/${context.id}`),
    onTripleClick: (_, context) => console.log("Triple clicked", context.id),
    // Uncomment to handle long press if desired:
    // onLongPress: (_, context) => toggleSelect(context.id),
  });

  useEffect(() => {
    if (!isPresent) {
      animate(scope.current, { opacity: 0, height: 0 }, { duration: 0.3 }).then(
        safeToRemove
      );
    }
  }, [isPresent, animate, safeToRemove, scope]);

  return (
    <motion.li
      ref={scope}
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      transition={{ duration: 0.25 }}
      className={`relative flex items-center justify-between gap-3 p-4 rounded-xl shadow-sm border 
        ${
          selected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
        }`}
      {...handlers({ id: report.id })}
    >
      {/* Left selection bar */}
      {selected && (
        <motion.div
          layoutId="selection-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"
        />
      )}

      {/* Report name + shared avatars */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{report.name}</p>
        <div className="flex items-center gap-1 mt-1">
          {sharedItems.slice(0, 3).map((item, i) =>
            "src" in item ? (
              <img
                key={i}
                src={item.src}
                alt={item.alt}
                className="w-5 h-5 rounded-full border border-white"
              />
            ) : (
              <span
                key={i}
                className="text-xs text-gray-600 font-medium truncate"
              >
                {item.name}
              </span>
            )
          )}

          {sharedItems.length > 3 && (
            <Menu as="div" className="relative">
              <MenuButton className="w-5 h-5 rounded-full bg-gray-200 text-xs flex items-center justify-center">
                +{sharedItems.length - 3}
              </MenuButton>
              <MenuItems className="absolute left-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10 p-1">
                {sharedItems.slice(3).map((item, i) => (
                  <MenuItem key={i}>
                    {({ active }) =>
                      "src" in item ? (
                        <div className="flex items-center gap-2 p-1">
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-sm">{item.alt}</span>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className={`block p-1 text-sm ${
                            active ? "bg-gray-100" : ""
                          }`}
                        >
                          {item.name}
                        </Link>
                      )
                    }
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>

      {/* Status & delete */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            report.status === "Complete"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {report.status}
        </span>
        {totalSelected === 1 && selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeReport(report.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            🗑
          </button>
        )}
      </div>
    </motion.li>
  );
}

// ----------------- Report List -----------------
function ReportList({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const removeReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {reports
          .slice()
          .reverse()
          .map((report, index) => (
            <ReportItem
              key={report.id}
              report={report}
              index={index}
              selected={selectedIds.has(report.id)}
              toggleSelect={toggleSelect}
              removeReport={removeReport}
              navigate={navigate}
              totalSelected={selectedIds.size}
            />
          ))}
      </AnimatePresence>
    </ul>
  );
}

// ----------------- Page -----------------
export default function Reports() {
  const { initialReports } = useLoaderData<typeof loader>();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <ReportList initialReports={initialReports} />
    </div>
  );
}
