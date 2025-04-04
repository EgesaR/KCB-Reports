import { FaCog, FaQuestionCircle, FaSync } from "react-icons/fa";
import { FaChartLine, FaRobot, FaUsers } from "react-icons/fa6";
import { useDashboardContext } from "~/context/DashboardContext";

export default function DashboardIndex() {
  const { user } = useDashboardContext();
console.log({ user })
  return (
    <div className="flex flex-col h-full gap-8 p-6">
      {/* Welcome Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg dark:from-blue-700 dark:to-blue-800">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back, {user?.name || "User"}!
          </h1>
          <p className="text-blue-100 dark:text-blue-200">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <img
            src={user?.profileUrl || "https://via.placeholder.com/120"}
            alt="User profile"
            className="h-20 w-20 rounded-full border-4 border-white/30 shadow-lg object-cover"
          />
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
