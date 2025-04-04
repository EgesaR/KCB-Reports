import { FaCog, FaQuestionCircle, FaSync } from "react-icons/fa";
import { FaChartLine, FaRobot, FaUsers } from "react-icons/fa6";
import { useDashboardContext } from "~/context/DashboardContext";

export default function DashboardIndex() {
  const { user } = useDashboardContext();
  return (
    <div className="flex flex-col min-h-screen gap-8 p-6">
      {/* Welcome Header Section - Now with proper height */}
      <div className="min-h-[40vh] flex flex-col px-10 py-8 rounded-xl shadow-lg bg-gradient-to-r from-[#751d91] via-[#4d1a72] to-[#38185e]">
        <div className="w-[55%] flex flex-col gap-2">
          <h1 className="text-white text-3xl font-medium">
            Good morning, {user?.name || "User"}
          </h1>
          <p className="text-gray-100 dark:text-gray-200">
            Track, analyze, and optimize student progress effortlessly. Automate
            grading, monitor performance trends, and collaborate with teachers
            seamlessly. Gain data-driven insights for smarter, more efficient
            education.
          </p>
          <button className="bg-neutral-200 dark:bg-neutral-900 hover:bg-neutal-300 dark:hover:bg-neutral-900/90 text-black dark:text-white font-bold py-2 px-4 border border-[#751d91] hover:border-[#761d91b6] rounded-lg w-[20%] mt-4">
            Get Started
          </button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: <FaChartLine className="text-4xl" />,
            title: "Projects",
            value: "12",
            color:
              "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
          },
          {
            icon: <FaSync className="text-4xl" />,
            title: "Tasks Completed",
            value: "85",
            color:
              "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
          },
          {
            icon: <FaUsers className="text-4xl" />,
            title: "Messages",
            value: "7",
            color:
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-6 rounded-xl shadow-sm transition-all hover:shadow-md ${stat.color}`}
          >
            <div>
              <h2 className="text-lg font-medium">{stat.title}</h2>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="p-3 rounded-full bg-white/30 backdrop-blur-sm">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Overview Section */}
      <div className="flex-1 p-6 bg-white rounded-xl shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Activity Overview
          </h2>
          <select className="text-sm bg-gray-100 border-0 rounded-lg px-3 py-1 dark:bg-gray-700 dark:text-gray-200">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg dark:from-gray-700 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-400">
              Activity chart will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Shortcut Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: <FaCog className="text-2xl" />,
            label: "Settings",
            color: "bg-blue-500",
          },
          {
            icon: <FaRobot className="text-2xl" />,
            label: "AI Tools",
            color: "bg-green-500",
          },
          {
            icon: <FaQuestionCircle className="text-2xl" />,
            label: "Help",
            color: "bg-yellow-500",
          },
          {
            icon: <FaUsers className="text-2xl" />,
            label: "Teams",
            color: "bg-red-500",
          },
        ].map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-xl text-white ${item.color} transition-all hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="p-3 bg-white/20 rounded-full mb-2">{item.icon}</div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
