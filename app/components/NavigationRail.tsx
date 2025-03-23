import React from "react";
import { BiHomeSmile, BiSolidHomeSmile } from "react-icons/bi";
import { MdMenu } from "react-icons/md";
import { FaChartLine, FaRobot, FaUsers, FaSync } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

interface NavigationRailButtonProps {
  text: string;
  icon: React.ReactElement;
  active?: boolean;
  iconClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const NavigationRailButton: React.FC<NavigationRailButtonProps> = ({
  text,
  icon,
  active,
  iconClassName = "",
  containerClassName = "",
  labelClassName = "",
}) => {
  return (
    <div
      className={`w-full h-[42px] flex flex-col justify-center items-center group gap-[6px] ${containerClassName}`}
    >
      <div className="w-full flex flex-col justify-center items-center relative">
        {React.cloneElement(icon, {
          className: `text-[18px] z-10 group-hover:text-[#4A4458] dark:group-hover:text-[#E8DEF8] ${
            active ? "text-[#4A4458] dark:text-[#E8DEF8]" : ""
          } ${iconClassName}`,
        })}
        <motion.div
          className="w-[42px] h-[24px] rounded-[12px] bg-[#E8DEF8] dark:bg-[#4A4458] absolute -top-[20%]"
          initial={{ scale: 0, borderRadius: "50%" }} // Initial state: circle
          animate={{
            scale: active ? 1 : 0, // Grow to full size if active, else shrink to circle
            borderRadius: active ? "12px" : "50%", // Rounded rectangle if active, else circle
          }}
          whileHover={{
            scale: 1, // Always grow on hover
            borderRadius: "12px", // Always rounded rectangle on hover
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }} // Animation settings
        />
      </div>
      <label
        className={`text-[12px] px-2 font-[500] group-hover:text-[#1D1B20] dark:group-hover:text-[#E6E0E9]/70 ${
          active ? "text-[#1D1B20] dark:text-[#E6E0E9]/70" : ""
        } ${labelClassName}`}
      >
        {text}
      </label>
    </div>
  );
};

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

const NavigationRail = () => {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div className="h-full w-[82px] bg-[#FEF7FF] dark:bg-[#141218] text-[#49454F] dark:text-[#E1DBE4] py-12 transition-all duration-300 ease-in-out">
      <div className="w-full h-[42px] flex flex-col justify-center items-center group mb-10">
        <div className="w-[36px] h-[36px] transition-all duration-200 ease-in-out rounded-full hover:text-[#1D1B20] hover:bg-[#1D1B20]/8 dark:hover:text-[#E6E0E9] dark:hover:bg-[#E6E0E9]/8 grid place-content-center">
          <MdMenu className="text-[18px]" />
        </div>
      </div>
      <div className="w-full flex flex-col gap-[28px]">
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
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationRail;
