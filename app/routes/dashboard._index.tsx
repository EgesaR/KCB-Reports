import { useEffect, useState } from "react";
import { FaChartLine, FaRobot, FaUsers } from "react-icons/fa6";
import { FaCog, FaQuestionCircle, FaSync } from "react-icons/fa";
import { useDashboardContext } from "~/context/DashboardContext";
import { Outlet } from "@remix-run/react";
import AdminSidebar from "~/components/admin/AdminSidebar";
import { motion } from "framer-motion";

export default function DashboardIndex() {
  const { user } = useDashboardContext();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col gap-8 p-6 overflow-y-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[40vh] flex flex-col px-10 py-8 rounded-xl shadow-xl bg-gradient-to-r from-[#751d91] via-[#4d1a72] to-[#38185e]"
        >
          <div className="w-full sm:w-[55%] flex flex-col gap-2">
            <h1 className="text-white text-lg sm:text-2xl font-medium">
              {greeting}, {user?.name || "User"}
            </h1>
            <p className="text-gray-100 text-[12px] sm:text-[16px]">
              Track, analyze, and optimize student progress effortlessly.
              Automate grading, monitor performance trends, and collaborate with
              teachers seamlessly.
            </p>
            <button className="bg-neutral-200 dark:bg-neutral-900 hover:bg-neutral-300 dark:hover:bg-neutral-900/90 text-black dark:text-white font-bold py-2 px-4 rounded-lg w-full sm:w-[35%] mt-4">
              Get Started
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center justify-between p-6 rounded-xl shadow-sm ${stat.color}`}
            >
              <div>
                <h2 className="text-lg font-medium">{stat.title}</h2>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white/30">{stat.icon}</div>
            </motion.div>
          ))}
        </div>

        <Outlet />
      </div>
      {user?.roles.includes("ADMIN") && <AdminSidebar />}
    </div>
  );
}
