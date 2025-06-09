import React, { useRef, useState, useEffect } from "react";
import { FaRegHeart, FaHeart, FaRegClock } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { CgHomeAlt } from "react-icons/cg";
import {
  TbChartPie,
  TbChartPieFilled,
  TbBrandGoogleAnalytics,
} from "react-icons/tb";
import {
  MdOutlineAdminPanelSettings,
  MdAdminPanelSettings,
} from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { SiGoogleanalytics } from "react-icons/si";
import {
  motion,
  AnimationOptions,
  DOMKeyframesDefinition,
  useAnimate,
} from "framer-motion";
import useMotionTimeline from "~/hooks/useMotionTimeline";
import { Link, useLocation } from "@remix-run/react";

const INDICATOR_TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 0.5,
};

type AnimateParams = [string, DOMKeyframesDefinition, AnimationOptions?];

const SideBar = () => {
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState(location.pathname);

  const mainButtons = [
    { label: "Home", route:"/",activeIcon: <GoHomeFill />, icon: <CgHomeAlt /> },
    {
      label: "Reports",
      route:"/reports",activeIcon: <SiGoogleanalytics />,
      icon: <TbBrandGoogleAnalytics />,
    },
    {
      label: "Analytics",
      route:"/analytics",activeIcon: <TbChartPieFilled />,
      icon: <TbChartPie />,
    },
    {
      label: "Admin",
      route:"/admin",activeIcon: <MdAdminPanelSettings />,
      icon: <MdOutlineAdminPanelSettings />,
    },
  ];
  const actionButtons = [
    {
      icon: isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />,
      ariaLabel: isLiked ? "Unlike" : "Like",
      action: () => setIsLiked((prev) => !prev),
    },
    {
      icon: <FaRegClock />,
      ariaLabel: "Recent",
      action: () => console.log("Recent clicked"),
    },
    {
      icon: <FiMoreHorizontal />,
      ariaLabel: "More",
      action: () => console.log("More clicked"),
    },
  ];

  const handleIndicatorAnimation = (path: string) => {
    setActiveRoute(path);
  };

  return (
    <aside
      className="bg-zinc-100 dark:bg-zinc-900 rounded-lg py-4 flex flex-col items-center justify-between px-1.5 relative"
      style={{ position: "relative" }}
    >
      <span className="font-bold text-md opacity-0">KR</span>
      <div className="flex flex-col items-center gap-4 -mt-4">
        {mainButtons.map((btn, index) => (
          <ForwardedSideBarBtn
            key={`main-btn-${index}`}
            id={`main-btn-${index}`}
            label={btn.label}
            icon={btn.icon}
            activeIcon={btn.activeIcon}
            route={btn.route}
            onClick={() => handleIndicatorAnimation(btn.route)}
            isActive={activeRoute === btn.route}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3.5">
        {actionButtons.map((btn, index) => (
          <ActionSideBarBtn
            key={`action-btn-${index}`}
            icon={btn.icon}
            ariaLabel={btn.ariaLabel}
            onClick={btn.action}
          />
        ))}
      </div>
    </aside>
  );
};

interface SideBarBtnProps {
  id: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  route: string;
  onClick: () => void;
  isActive: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const SideBarBtn = (
  {
    id,
    label,
    className,
    icon,
    activeIcon,
    route,
    onClick,
    isActive,
  }: SideBarBtnProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();

  const keyframes: AnimateParams[] = [
    [
      `.indicator-${id}`,
      {
        opacity: 0,
        height: 4,
        width: 4,
        borderRadius: "50%",
        top: "auto",
        bottom: 0,
      },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
    [
      `.indicator-${id}`,
      { opacity: 1, top: "50%", bottom: "auto", transform: "translateY(-50%)" },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
    [
      `.indicator-${id}`,
      { height: 24, borderRadius: "2px" },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
  ];
  const hideKeyframes: AnimateParams[] = [
    [
      `.indicator-${id}`,
      { height: 4, borderRadius: "50%" },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
    [
      `.indicator-${id}`,
      { opacity: 0, top: "auto", bottom: 0, transform: "none" },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
    [
      `.indicator-${id}`,
      { height: 0, width: 0, opacity: 0 },
      { ...INDICATOR_TRANSITION, duration: 0.3 },
    ],
  ];

  useEffect(() => {
    const runAnimations = async () => {
      if (indicatorRef.current) {
        const targetKeyframes = isActive ? keyframes : hideKeyframes;
        for (const [selector, props, options] of targetKeyframes) {
          await animate(selector, props, options);
        }
      } else {
        console.error(`Indicator ref not found for ${id}`);
      }
    };

    runAnimations();
  }, [isActive, id, animate]);

  return (
    <Link to={route}>
      <motion.div
        className="relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        ref={scope}
        onClick={onClick}
      >
        <motion.div
          className={`bg-purple-300 absolute left-1 z-10 indicator-${id}`}
          ref={indicatorRef}
          initial={{
            opacity: 0,
            top: "auto",
            bottom: 0,
            height: 4,
            width: 4,
            borderRadius: "50%",
          }}
          //style={{ minWidth: 4, minHeight: 4 }}
        />
        <motion.button
          className={`h-9 w-10 grid place-content-center pl-0.5 text-[19px] rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 ${
            className || ""
          } ${isActive ? "bg-zinc-300/50 dark:bg-zinc-700/50" : ""}`}
          aria-label={label}
          id={id}
          whileTap={{ scale: 0.87 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isActive ? activeIcon : icon}
        </motion.button>
        <motion.div
          className="bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-lg whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.15, ease: "easeOut" },
            x: { duration: 0.2, ease: "easeOut" },
          }}
        >
          {label}
        </motion.div>
      </motion.div>
    </Link>
  );
};

// Forward ref to SideBarBtn
const ForwardedSideBarBtn = React.forwardRef(SideBarBtn);

const ActionSideBarBtn = ({
  icon,
  ariaLabel,
  onClick,
}: {
  icon: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
}) => {
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ariaLabel === "Like" || ariaLabel === "Unlike") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y, key: Date.now() });
      setTimeout(() => setRipple(null), 600);
    }
    onClick?.();
  };

  return (
    <motion.button
      className="h-8 w-8 grid place-content-center rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 relative overflow-hidden"
      aria-label={ariaLabel}
      onClick={handleClick}
      whileTap={{ scale: 0.87 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        animate={
          ariaLabel === "Unlike"
            ? { scale: [1, 1.2, 1], transition: { duration: 0.3 } }
            : {}
        }
      >
        {icon}
      </motion.div>
      {(ariaLabel === "Like" || ariaLabel === "Unlike") && ripple && (
        <span
          className="absolute bg-red-500/40 rounded-full animate-ripple"
          style={{
            left: ripple.x - 16,
            top: ripple.y - 16,
            width: 32,
            height: 32,
          }}
        />
      )}
      <style>
        {`
          .animate-ripple {
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          }
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </motion.button>
  );
};

export default SideBar;
