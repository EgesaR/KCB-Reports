import React, { useState } from "react";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { MdMenu } from "react-icons/md";
import { FaChartLine, FaUsers, FaSync } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, Variants, usePresence } from "framer-motion";
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
  const [isPresent, safeToRemove] = usePresence();

  // Explicitly type safeToRemove as a function
  const safeToRemoveFn = safeToRemove as (() => void) | undefined;

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
      className={`w-full flex ${
        expanded ? "flex-row items-center" : "flex-col items-center"
      } gap-${expanded ? "4" : "2.5"} group relative ${
        expanded ? "h-[36px] rounded-[50px] px-4" : ""
      } ${expanded && active ? "bg-[#E8DEF8] dark:bg-[#4A4458]" : ""}`}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
    >
      <div className="flex items-center justify-center relative">
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
      </div>
      {/* Label - Always Visible */}
      <AnimatePresence>
        {isPresent && (
          <motion.label
            className={`text-[11px] font-[500] group-hover:text-[#1D1B20] dark:group-hover:text-[#E6E0E9]/70 ${
              active ? "text-[#1D1B20] dark:text-[#E6E0E9]/70 font-[600]" : ""
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => !isPresent && safeToRemoveFn?.()}
            layout
          >
            {text}
          </motion.label>
        )}
      </AnimatePresence>
      {/* Badge */}
      {badgeContent && (
        <div
          className={`flex items-center justify-center ${
            expanded ? "ml-auto" : "absolute"
          } ${
            expanded
              ? badgeContent.length >= 3
                ? "top-[-20%] right-[21%]" // Adjust right position for longer content
                : "top-[-20%] right-[21%]" // Default right position
              : "top-[-20%] right-[21%]" // Default position when not expanded
          }`}
        >
          <div className="w-auto min-w-[12px] h-[12px] flex items-center justify-center px-1 pt-0.5 rounded-full bg-[#B3261E]">
            <label className="text-[10px] text-white">{badgeContent}</label>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.1, duration: 0.3, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
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

const NavigationRail = () => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const [expanded, setExpanded] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
  });

  return (
    <AnimatePresence>
      <motion.div
        className={`h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#49454F] dark:text-[#E1DBE4] border-r border-gray-900/20 dark:border-gray-100/20 pt-6 transition-all easeInOut duration-400 ${
          expanded ? "px-5" : ""
          }`}
        style={{ width: expanded ? "25%" : "82px" }}
        {...swipeHandlers}
      >
        <div className="w-full h-[42px] flex flex-col justify-center items-center group mb-8">
          {!expanded && (
            <div
              className="w-[36px] h-[36px] transition-all duration-200 ease-in-out rounded-full hover:text-[#1D1B20] hover:bg-[#1D1B20]/8 dark:hover:text-[#E6E0E9] dark:hover:bg-[#E6E0E9]/8 grid place-content-center cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <MdMenu className="text-[18px]" />
            </div>
          )}
          {expanded && (
            <AnimatePresence>
              <div className="w-full flex items-center justify-between">
                <AnimatePresence>
                  <motion.h1
                    initial={{ opacity: 0, width: "60%" }}
                    animate={{
                      opacity: 1,
                      width: "70%",
                      transition: {
                        width: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.15,
                        },
                      },
                    }}
                    exit={{
                      width: "60%",
                      opacity: 0,
                      transition: {
                        width: {
                          duration: 0.4,
                        },
                        opacity: {
                          duration: 0.3,
                        },
                      },
                    }}
                    key="title"
                    className="font-semibold text-[20px] overflow-hidden"
                  >
                    KCB Reports
                  </motion.h1>
                </AnimatePresence>
                <div
                  className="w-[36px] h-[36px] transition-all duration-200 ease-in-out rounded-full hover:text-[#1D1B20] hover:bg-[#1D1B20]/8 dark:hover:text-[#E6E0E9] dark:hover:bg-[#E6E0E9]/8 grid place-content-center cursor-pointer"
                  onClick={() => setExpanded(!expanded)}
                >
                  <RxCross2 className="text-[18px]" />
                </div>
              </div>
            </AnimatePresence>
          )}
        </div>
        <div
          className={`w-full flex flex-col ${
            expanded ? "gap-[16px]" : "gap-[28px]"
          }`}
        >
          <AnimatePresence>
            {mainButtons.map((button, index) => (
              <Link to={button.route} key={index}>
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
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NavigationRail;
