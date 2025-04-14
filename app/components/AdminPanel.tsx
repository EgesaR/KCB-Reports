// app/components/AdminPanel.tsx
import { useState } from "react";
import {
  FaUsers,
  FaBook,
  FaSchool,
  FaTasks,
  FaFileAlt,
  FaEnvelope,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import { useDashboardContext } from "~/context/DashboardContext";

export default function AdminPanel() {
  const { user } = useDashboardContext();
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    { id: "students", label: "Students", icon: <FaUserGraduate /> },
    { id: "teachers", label: "Teachers", icon: <FaChalkboardTeacher /> },
    { id: "parents", label: "Parents", icon: <FaUserShield /> },
    { id: "subjects", label: "Subjects", icon: <FaBook /> },
    { id: "classes", label: "Classes & Streams", icon: <FaSchool /> },
    { id: "tasks", label: "Report Tasks", icon: <FaTasks /> },
    { id: "reports", label: "Report Layouts", icon: <FaFileAlt /> },
    { id: "messages", label: "Communications", icon: <FaEnvelope /> },
  ];

  return (
    <div className="h-screen w-full sm:w-[40%] border-l border-gray-900/20 dark:border-gray-100/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-900/20 dark:border-gray-100/20">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-900/20 dark:border-gray-100/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-[#751d91] text-[#751d91] dark:text-[#a855f7]"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "students" && <StudentsPanel />}
        {activeTab === "teachers" && <TeachersPanel />}
        {activeTab === "parents" && <ParentsPanel />}
        {activeTab === "subjects" && <SubjectsPanel />}
        {activeTab === "classes" && <ClassesStreamsPanel />}
        {activeTab === "tasks" && <ReportTasksPanel />}
        {activeTab === "reports" && <ReportLayoutsPanel />}
        {activeTab === "messages" && <CommunicationsPanel />}
      </div>
    </div>
  );
}

// Individual panel components would go here
const StudentsPanel = () => <div>Students Management Content</div>;
const TeachersPanel = () => <div>Teachers Management Content</div>;
const ParentsPanel = () => <div>Parents Management Content</div>;
const SubjectsPanel = () => <div>Subjects Management Content</div>;
const ClassesStreamsPanel = () => <div>Classes & Streams Content</div>;
const ReportTasksPanel = () => <div>Report Tasks Content</div>;
const ReportLayoutsPanel = () => <div>Report Layouts Content</div>;
const CommunicationsPanel = () => <div>Communications Content</div>;
