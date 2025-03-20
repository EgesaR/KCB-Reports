import { FaCog, FaQuestionCircle, FaSync } from "react-icons/fa";
import { FaChartLine, FaRobot, FaUsers } from "react-icons/fa6";

export default function DashboardIndex() {
  return (
    <div className="flex flex-col h-full gap-6">
      {/* Welcome Header Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-blue-100 rounded-lg shadow-sm dark:bg-blue-900">
        <div>
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            Welcome Back, User!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here's an overview of your recent activity and updates.
          </p>
        </div>
        <img
          src="https://via.placeholder.com/120"
          alt="Welcome Illustration"
          className="h-16 w-16 rounded-full shadow-md bg-blue-300 dark:bg-blue-700"
        />
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Projects
            </h2>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              12
            </p>
          </div>
          <FaChartLine className="text-4xl text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Tasks Completed
            </h2>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              85
            </p>
          </div>
          <FaSync className="text-4xl text-green-500 dark:text-green-400" />
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Messages
            </h2>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              7
            </p>
          </div>
          <FaUsers className="text-4xl text-yellow-500 dark:text-yellow-400" />
        </div>
      </div>

      {/* Activity Overview Section */}
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Activity Overview
        </h2>
        <div className="h-40 bg-gray-200 rounded-md dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
          <p>Activity Graph Placeholder</p>
        </div>
      </div>

      {/* Shortcut Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-4 shadow-md hover:bg-blue-200 transition dark:bg-blue-900 dark:hover:bg-blue-700">
          <FaCog className="text-3xl text-blue-500 dark:text-blue-400 mb-2" />
          <span className="text-gray-700 dark:text-gray-200">Settings</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-green-100 rounded-lg p-4 shadow-md hover:bg-green-200 transition dark:bg-green-900 dark:hover:bg-green-700">
          <FaRobot className="text-3xl text-green-500 dark:text-green-400 mb-2" />
          <span className="text-gray-700 dark:text-gray-200">AI Tools</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-yellow-100 rounded-lg p-4 shadow-md hover:bg-yellow-200 transition dark:bg-yellow-900 dark:hover:bg-yellow-700">
          <FaQuestionCircle className="text-3xl text-yellow-500 dark:text-yellow-400 mb-2" />
          <span className="text-gray-700 dark:text-gray-200">Help</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-red-100 rounded-lg p-4 shadow-md hover:bg-red-200 transition dark:bg-red-900 dark:hover:bg-red-700">
          <FaUsers className="text-3xl text-red-500 dark:text-red-400 mb-2" />
          <span className="text-gray-700 dark:text-gray-200">Teams</span>
        </div>
      </div>
    </div>
  );
}
