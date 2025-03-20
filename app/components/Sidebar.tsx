import React from "react";
import {
  FaCog,
  FaChartLine,
  FaRobot,
  FaQuestionCircle,
  FaUsers,
  FaSync,
} from "react-icons/fa";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { useLocation } from "@remix-run/react"; // Use Remix's `useLocation`
import { Link } from "@remix-run/react";
import { FiMenu } from "react-icons/fi";
import { HomeIcon } from "@heroicons/react/16/solid";

interface SidebarBtnProps {
  text: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  route: string;
  active?: boolean;
}

const SidebarBtn: React.FC<SidebarBtnProps> = ({
  text,
  icon,
  activeIcon,
  route,
  active,
}) => {
  return (
    <Link
      to={route}
      className={`group relative flex justify-center rounded-sm ${
        active ? "bg-blue-100" : "bg-blue-50"
      } px-2 py-1.5 text-blue-700 transition-width duration-500 w-16`}
    >
      {active && activeIcon ? activeIcon : icon}
      <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white invisible group-hover:visible">
        {text}
      </span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Main navigation buttons
  const mainButtons = [
    {
      text: "Dashboard",
      icon: <BiHomeSmile className="size-5 opacity-75" />,
      activeIcon: <BiSolidHomeSmile className="size-5 opacity-75" />,
      route: "/dashboard",
    },
    {
      text: "Analysis",
      icon: <FaChartLine className="size-5 opacity-75" />,
      route: "/dashboard/analysis",
    },
    {
      text: "AI",
      icon: <FaRobot className="size-5 opacity-75" />,
      route: "/dashboard/ai",
    },
    {
      text: "Departments",
      icon: <FaUsers className="size-5 opacity-75" />,
      route: "/dashboard/departments",
    },
    {
      text: "Updates",
      icon: <FaSync className="size-5 opacity-75" />,
      route: "/dashboard/updates",
    },
  ];

  // Bottom utility buttons
  const bottomButtons = [
    {
      text: "Settings",
      icon: <FaCog className="size-5 opacity-75" />,
      route: "/dashboard/settings",
    },
    {
      text: "Help & Feedback",
      icon: <FaQuestionCircle className="size-5 opacity-75" />,
      route: "/dashboard/help",
    },
  ];

  return (
    <div className="flex h-screen w-14 flex-col justify-center items-center border-e border-gray-100 bg-[#fef7ff] transition-width duration-500">
      <div className=" h-full w-full flex flex-col justify-between items-center py-5">
        <button className="grid place-content-center h-8 w-8 rounded-full hover:bg-gray-200">
          <FiMenu />
        </button>
        <div>
          <button className="w-full h-10 flex flex-col gap-1 justify-center items-center bg-red-400">
            <HomeIcon className="size-20" />
            <span className="">Home</span>
          </button>
        </div>
        <div>Hello</div>
      </div>
    </div>
  );
};

export default Sidebar;
