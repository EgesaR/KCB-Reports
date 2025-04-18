import { NavLink } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBook,
  FaChalkboard,
  FaStream,
  FaFileAlt,
  FaEnvelope,
  FaDatabase,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard/admin/students", label: "Students", icon: FaUsers },
  { to: "/dashboard/admin/subjects", label: "Subjects", icon: FaBook },
  { to: "/dashboard/admin/classes", label: "Classes", icon: FaChalkboard },
  { to: "/dashboard/admin/streams", label: "Streams", icon: FaStream },
  { to: "/dashboard/admin/reports", label: "Reports", icon: FaFileAlt },
  { to: "/dashboard/admin/contacts", label: "Contacts", icon: FaEnvelope },
  { to: "/dashboard/admin/records", label: "Records", icon: FaDatabase },
];

export default function AdminSidebar() {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-[280px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 hidden sm:block shadow-lg lg:mt-9"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
