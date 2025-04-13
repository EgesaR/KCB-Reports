import React from "react";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { FaUsers, FaSync } from "react-icons/fa";
import { HiDocumentReport, HiOutlineDocumentReport } from "react-icons/hi";
import { IoBarChart, IoBarChartOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string;
  profileUrl: string;
  roles: string[];
}

interface NavigationButtonProps {
  text: string;
  icon: React.ReactElement;
  activeIcon?: React.ReactElement;
  active?: boolean;
  route: string;
  badgeCount?: number;
  index: number;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  text,
  icon,
  activeIcon,
  active,
  route,
  badgeCount,
  index,
}) => {
  const badgeContent =
    badgeCount !== undefined
      ? badgeCount > 50
        ? "50+"
        : badgeCount.toString()
      : null;

  return (
    <Link to={route} className="flex-1 flex justify-center items-center">
      <motion.div
        className="flex flex-col items-center gap-1 p-2 rounded-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          {active && (
            <motion.div
              className="absolute -inset-1 -left-2 bg-[#E8DEF8] dark:bg-[#4A4458] -z-10 w-[40px] rounded-[50px]"
              layoutId="activeIndicator"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
          {React.cloneElement(active ? activeIcon || icon : icon, {
            className: `size-6 z-10 ${
              active
                ? "text-[#4A4458] dark:text-[#E8DEF8]"
                : "text-[#49454F] dark:text-[#E1DBE4] opacity-75"
            }`,
          })}
          {badgeContent && (
            <div className="absolute top-[-8px] right-[-4px] flex items-center justify-center">
              <div className="w-auto min-w-[14px] h-[14px] flex items-center justify-center px-1 pt-0.5 rounded-full bg-[#B3261E]">
                <span className="text-[9px] text-white font-medium">
                  {badgeContent}
                </span>
              </div>
            </div>
          )}
        </motion.div>
        <motion.span
          className={`text-[10px] ${
            active
              ? "text-[#4A4458] dark:text-[#E8DEF8]"
              : "text-[#49454F] dark:text-[#E1DBE4] opacity-75"
          }`}
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          {text}
        </motion.span>
      </motion.div>
    </Link>
  );
};

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: index * 0.1,
    },
  }),
};

const labelVariants: Variants = {
  hidden: {
    opacity: 0.5,
    y: 10,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      delay: index * 0.1 + 0.05,
    },
  }),
};

interface Button {
  text: string;
  icon: React.ReactElement;
  activeIcon?: React.ReactElement;
  route: string;
  badgeCount?: number;
}

const BottomNavigation = ({ user }: { user: User }) => {
  const location = useLocation();
  const currentRoute = location.pathname;

  const navigationButtons: Button[] = [
    {
      text: "Dashboard",
      icon: <BiHomeSmile className="opacity-75" />,
      activeIcon: <BiSolidHomeSmile className="opacity-75" />,
      route: "/dashboard",
    },
    {
      text: "Reports",
      icon: <HiOutlineDocumentReport className="opacity-75" />,
      activeIcon: <HiDocumentReport className="opacity-75" />,
      route: "/dashboard/reports",
    },
    {
      text: "Analysis",
      icon: <IoBarChartOutline className="opacity-75" />,
      activeIcon: <IoBarChart className="opacity-75" />,
      route: "/dashboard/analysis",
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
      transition={{ duration: 0.4, ease: "easeInOut" }}
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
            badgeCount={button.badgeCount}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
