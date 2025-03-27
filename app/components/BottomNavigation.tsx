import React from "react";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { FaChartLine, FaRobot, FaUsers, FaSync } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavigationButtonProps {
  text: string;
  icon: React.ReactElement;
  activeIcon?: React.ReactElement;
  active?: boolean;
  route: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  text,
  icon,
  activeIcon,
  active,
  route,
}) => {
  return (
    <Link to={route} className="flex-1 flex justify-center items-center">
      <motion.div
        className="flex flex-col items-center gap-1 p-2 rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Background Highlight for Active State */}
          {active && (
            <motion.div
              className="absolute -inset-1 -left-2.5 bg-[#E8DEF8] dark:bg-[#4A4458] -z-10 w-[45px] rounded-[50px]"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {/* Icon */}
          {React.cloneElement(active ? activeIcon || icon : icon, {
            className: `size-6 z-10 ${
              active ? "text-[#4A4458] dark:text-[#E8DEF8]" : "opacity-75"
            }`,
          })}
        </div>
        {/* Label */}
        <motion.span
          className={`text-xs ${
            active ? "text-[#4A4458] dark:text-[#E8DEF8]" : "opacity-75"
          }`}
        >
          {text}
        </motion.span>
      </motion.div>
    </Link>
  );
};

const BottomNavigation = () => {
  const location = useLocation();
  const currentRoute = location.pathname;

  const navigationButtons = [
    {
      text: "Dashboard",
      icon: <BiHomeSmile className="opacity-75" />,
      activeIcon: <BiSolidHomeSmile className="opacity-75" />,
      route: "/dashboard",
    },
    {
      text: "Analysis",
      icon: <FaChartLine className="opacity-75" />,
      route: "/dashboard/analysis",
    },
    {
      text: "AI",
      icon: <FaRobot className="opacity-75" />,
      route: "/dashboard/ai",
    },
    {
      text: "Departments",
      icon: <FaUsers className="opacity-75" />,
      route: "/dashboard/departments",
      badgeCount: 3,
    },
    {
      text: "Updates",
      icon: <FaSync className="opacity-75" />,
      route: "/dashboard/updates",
      badgeCount: 55,
    },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#141218] shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center p-2">
        {navigationButtons.map((button, index) => (
          <NavigationButton
            key={index}
            text={button.text}
            icon={button.icon}
            activeIcon={button.activeIcon}
            active={currentRoute === button.route}
            route={button.route}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
