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
    <div className="flex h-screen w-16 flex-col justify-between border-e border-gray-100 bg-white transition-width duration-500">
      {/* Logo Section */}
      <div>
        <div className="inline-flex items-center justify-center p-4">
          <span className="grid h-10 w-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            L
          </span>
        </div>

        {/* Main Navigation */}
        <div className="border-t border-gray-100">
          <div className="px-2 py-4 flex flex-col gap-2.5">
            {mainButtons.map((button, index) => (
              <SidebarBtn
                key={index}
                text={button.text}
                icon={button.icon}
                activeIcon={button.activeIcon}
                route={button.route}
                active={location.pathname === button.route}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 bg-white px-2 py-4 flex flex-col gap-2">
        {bottomButtons.map((button, index) => (
          <SidebarBtn
            key={index}
            text={button.text}
            icon={button.icon}
            route={button.route}
            active={location.pathname === button.route}
          />
        ))}
        <Link
          to="/logout"
          className="group flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
