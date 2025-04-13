import React, { useState } from "react";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { MdMenu } from "react-icons/md";
import { FaChartLine, FaUsers, FaSync } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  Variants,
  useReducedMotion,
} from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { RxCross2 } from "react-icons/rx";
import { HiDocumentReport, HiOutlineDocumentReport } from "react-icons/hi";
import { IoBarChart, IoBarChartOutline } from "react-icons/io5";

interface NavigationRailButtonProps {
  text: string;
  icon: React.ReactElement;
  active?: boolean;
  badgeCount?: number;
  expanded?: boolean;
  index?: number;
}

const NavigationRailButton: React.FC<NavigationRailButtonProps> = ({
  text,
  icon,
  active,
  badgeCount,
  expanded = false,
  index = 0,
}) => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
  };

  const badgeContent =
    badgeCount !== undefined
      ? badgeCount > 50
        ? "50+"
        : badgeCount.toString()
      : null;

  return (
    <motion.div
      className={`flex ${
        expanded
          ? "flex-row items-center h-[36px] rounded-[50px] px-4"
          : "flex-col items-center"
      } gap-${expanded ? "4" : "2"} group relative ${
        expanded && active ? "bg-[#E8DEF8] dark:bg-[#4A4458]" : ""
      } ${expanded ? "w-full" : "w-[70px]"}`}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
      transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
    >
      <div className="relative flex items-center justify-center">
        {React.cloneElement(icon, {
          className: `size-4.5 z-10 group-hover:text-[#4A4458] dark:group-hover:text-[#E8DEF8] ${
            active ? "text-[#4A4458] dark:text-[#E8DEF8]" : ""
          }`,
        })}
        {!expanded && (
          <div
            className="w-[42px] h-[24px] rounded-[12px] absolute -top-[10%] overflow-hidden"
            onClick={handleClick}
          >
            <motion.div
              className="w-full h-full bg-[#E8DEF8] dark:bg-[#4A4458]"
              initial={{ scale: 0, borderRadius: "50%" }}
              animate={{
                scale: active ? 1 : 0,
                borderRadius: active ? "12px" : "50%",
              }}
              whileHover={{
                scale: 1,
                borderRadius: "12px",
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            {ripple && (
              <motion.div
                className="absolute w-10 h-10 bg-[#4A4458] dark:bg-[#E8DEF8] opacity-50 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                }}
              />
            )}
          </div>
        )}
        {badgeContent && (
          <div
            className={`absolute flex items-center justify-center ${
              expanded ? "top-[-6px] right-[-8px]" : "top-[-8px] right-[-4px]"
            }`}
          >
            <div className="w-auto min-w-[14px] h-[14px] flex items-center justify-center px-1 pt-0.5 rounded-full bg-[#B3261E]">
              <label className="text-[9px] text-white font-medium">
                {badgeContent}
              </label>
            </div>
          </div>
        )}
      </div>

      <motion.label
        className={`text-[10px] font-[500] group-hover:text-[#1D1B20] dark:group-hover:text-[#E6E0E9]/70 ${
          active ? "text-[#1D1B20] dark:text-[#E6E0E9]/70 font-[600]" : ""
        } ${expanded ? "" : "text-center px-1"}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        layout
        style={{ maxWidth: expanded ? "none" : "60px" }}
      >
        {text}
      </motion.label>
    </motion.div>
  );
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.3,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
  exit: { opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } },
};

const mainButtons = [
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

const adminButtons = [
  {
    text: "Admin Panel",
    icon: <FaUsers className="opacity-75" />,
    route: "/admin",
  },
];

interface User {
  id: string;
  email: string;
  name: string;
  profileUrl: string;
  roles: string[];
}

const railVariants: Variants = {
  expanded: {
    width: 240,
    opacity: 1,
    transition: {
      width: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
      opacity: { duration: 0.2 },
    },
  },
  collapsed: {
    width: 82,
    opacity: 1,
    transition: {
      width: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: {
      width: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.2 },
    },
  },
};

const titleVariants: Variants = {
  initial: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 0.5,
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
      mass: 0.5,
      opacity: { duration: 0.15 },
    },
  },
};

const NavigationRail = ({ user }: { user: User }) => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
  });

  const isAdmin = user.roles.includes("ADMIN");

  // Simplified variants for reduced motion
  const accessibleRailVariants: Variants = {
    expanded: {
      width: 240,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    collapsed: {
      width: 82,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const accessibleTitleVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="navigation-rail"
        className={`h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#49454F] dark:text-[#E1DBE4] border-r border-gray-900/20 dark:border-gray-100/20 pt-6 px-2`}
        variants={shouldReduceMotion ? accessibleRailVariants : railVariants}
        initial="collapsed"
        animate={expanded ? "expanded" : "collapsed"}
        exit="exit"
        {...swipeHandlers}
      >
        <div className="w-full h-[42px] flex flex-col justify-center items-center group mb-8">
          <AnimatePresence mode="wait">
            {!expanded && (
              <motion.div
                key="menu-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2, ease: "easeOut" }
                    : { type: "spring", stiffness: 150, damping: 15, mass: 0.5 }
                }
                className="w-[36px] h-[36px] transition-all duration-200 ease-in-out rounded-full hover:text-[#1D1B20] hover:bg-[#1D1B20]/8 dark:hover:text-[#E6E0E9] dark:hover:bg-[#E6E0E9]/8 grid place-content-center cursor-pointer"
                onClick={() => setExpanded(true)}
              >
                <MdMenu className="text-[18px]" />
              </motion.div>
            )}
            {expanded && (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2, ease: "easeOut" }
                    : {
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                        mass: 0.5,
                        delay: 0.05,
                      }
                }
                className="w-full flex items-center justify-between px-3"
              >
                <motion.h1
                  variants={
                    shouldReduceMotion ? accessibleTitleVariants : titleVariants
                  }
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="font-semibold text-[20px] overflow-hidden"
                >
                  KCB Reports
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2, ease: "easeOut" }
                      : {
                          type: "spring",
                          stiffness: 150,
                          damping: 15,
                          mass: 0.5,
                        }
                  }
                  className="w-[36px] h-[36px] transition-all duration-200 ease-in-out rounded-full hover:text-[#1D1B20] hover:bg-[#1D1B20]/8 dark:hover:text-[#E6E0E9] dark:hover:bg-[#E6E0E9]/8 grid place-content-center cursor-pointer"
                  onClick={() => setExpanded(false)}
                >
                  <RxCross2 className="text-[18px]" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className={`w-full flex flex-col ${
            expanded ? "gap-[16px]" : "gap-[28px]"
          }`}
        >
          <AnimatePresence initial={false}>
            {mainButtons.map((button, index) => (
              <motion.div
                key={button.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2, ease: "easeOut", delay: index * 0.05 }
                    : {
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.5,
                        delay: index * 0.05,
                      }
                }
              >
                <Link to={button.route}>
                  <NavigationRailButton
                    text={button.text}
                    icon={
                      currentRoute === button.route
                        ? button.activeIcon || button.icon
                        : button.icon
                    }
                    active={currentRoute === button.route}
                    badgeCount={button.badgeCount}
                    expanded={expanded}
                    index={index}
                  />
                </Link>
              </motion.div>
            ))}
            {isAdmin &&
              adminButtons.map((button, index) => (
                <motion.div
                  key={button.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={
                    shouldReduceMotion
                      ? {
                          duration: 0.2,
                          ease: "easeOut",
                          delay: (mainButtons.length + index) * 0.05,
                        }
                      : {
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                          mass: 0.5,
                          delay: (mainButtons.length + index) * 0.05,
                        }
                  }
                >
                  <Link to={button.route}>
                    <NavigationRailButton
                      text={button.text}
                      icon={button.icon}
                      active={currentRoute === button.route}
                      expanded={expanded}
                      index={mainButtons.length + index}
                    />
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NavigationRail;
