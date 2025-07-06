import React, { useRef, useEffect, useState, forwardRef } from "react";
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
import { motion, useAnimate, AnimationOptions } from "framer-motion";
import { Link, useLocation } from "@remix-run/react";

const INDICATOR_TRANSITION: AnimationOptions = {
  ease: "easeInOut",
  duration: 0.4,
};

type AnimateParams = [
  string, // selector
  Record<string, any>, // keyframes
  AnimationOptions // options
];

interface SideBarProps {
  toggleSideSheet: (id: string) => void;
}

const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  ({ toggleSideSheet, ...props }, ref) => {
    const [isLiked, setIsLiked] = useState(false);
    const location = useLocation();

    const mainButtons = [
      {
        label: "Home",
        route: "/",
        activeIcon: <GoHomeFill />,
        icon: <CgHomeAlt />,
      },
      {
        label: "Reports",
        route: "/reports",
        activeIcon: <SiGoogleanalytics />,
        icon: <TbBrandGoogleAnalytics />,
      },
      {
        label: "Analytics",
        route: "/analytics",
        activeIcon: <TbChartPieFilled />,
        icon: <TbChartPie />,
      },
      {
        label: "Admin",
        route: "/admin",
        activeIcon: <MdAdminPanelSettings />,
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
        action: () => toggleSideSheet("settings"),
      },
    ];

    return (
      <aside
        className="rounded-lg py-4 flex flex-col items-center justify-between px-1.5 relative hidden md:flex"
        style={{ position: "relative" }}
        ref={ref}
      >
        <span className="font-bold text-md opacity-0">KR</span>
        <div className="flex flex-col items-center gap-4 -mt-4">
          {mainButtons.map((btn, index) => (
            <SideBarBtn
              key={`main-btn-${index}`}
              id={`main-btn-${index}`}
              label={btn.label}
              icon={btn.icon}
              activeIcon={btn.activeIcon}
              route={btn.route}
              isActive={
                location.pathname === btn.route ||
                (btn.route !== "/" && location.pathname.startsWith(btn.route))
              }
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
  }
);

interface SideBarBtnProps {
  id: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  route: string;
  isActive: boolean;
}

const SideBarBtn = forwardRef<HTMLDivElement, SideBarBtnProps>(
  ({ id, label, className, icon, activeIcon, route, isActive }, ref) => {
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [scope, animate] = useAnimate();

    const keyframes: AnimateParams[] = [
      [
        `.indicator-${id}`,
        {
          opacity: 1,
          height: 24,
          width: 4,
          borderRadius: "2px",
          top: "50%",
          bottom: "auto",
          transform: "translateY(-50%)",
        },
        INDICATOR_TRANSITION,
      ],
    ];
    const hideKeyframes: AnimateParams[] = [
      [
        `.indicator-${id}`,
        {
          opacity: 0,
          height: 4,
          width: 4,
          borderRadius: "50%",
          top: "auto",
          bottom: 0,
          transform: "none",
        },
        INDICATOR_TRANSITION,
      ],
    ];

    useEffect(() => {
      const runAnimations = async () => {
        if (indicatorRef.current) {
          const targetKeyframes = isActive ? keyframes : hideKeyframes;
          await animate(...targetKeyframes[0]);
        }
      };

      runAnimations();
    }, [isActive, id, animate]);

    return (
      <Link to={route} prefetch="intent">
        <motion.div
          className="relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          ref={scope}
        >
          <motion.div
            className={`bg-gradient-to-br from-indigo-400 to-purple-200 dark:from-indigo-600 dark:to-purple-400 absolute left-1 z-10 indicator-${id}`}
            ref={indicatorRef}
            initial={{
              opacity: 0,
              top: "auto",
              bottom: 0,
              height: 4,
              width: 4,
              borderRadius: "50%",
            }}
            style={{
              willChange:
                "opacity, height, width, top, transform, border-radius, scale",
            }}
            whileTap={
              isActive
                ? {
                    scale: [1, 1.3, 1],
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }
                : {}
            }
          />
          <motion.button
            className={`h-9 w-10 grid place-content-center pl-0.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 ${
              className || ""
            } ${
              isActive
                ? "bg-zinc-300/50 dark:bg-zinc-700/50 text-zinc-900 dark:text-white"
                : ""
            }`}
            aria-label={label}
            id={id}
            whileTap={{ scale: 0.87 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{
              fontSize: "clamp(16px, 2.5vw, 18px)",
            }}
          >
            <span style={{ display: "inline-block", fontSize: "inherit" }}>
              {isActive ? activeIcon : icon}
            </span>
          </motion.button>
          <motion.div
            className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 text-xs font-semibold absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{
              opacity: { duration: 0.15, ease: "easeOut" },
              x: { duration: 0.2, ease: "easeOut" },
            }}
            style={{
              fontSize: "clamp(10px, 1.5vw, 12px)",
            }}
          >
            {label}
          </motion.div>
        </motion.div>
      </Link>
    );
  }
);

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
      className="h-8 w-8 grid place-content-center rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 text-zinc-700 dark:text-zinc-200 relative overflow-hidden"
      aria-label={ariaLabel}
      onClick={handleClick}
      whileTap={{ scale: 0.87 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        fontSize: "clamp(14px, 2vw, 16px)",
      }}
    >
      <motion.div
        animate={
          ariaLabel === "Unlike"
            ? { scale: [1, 1.2, 1], transition: { duration: 0.3 } }
            : {}
        }
        style={{ display: "inline-block", fontSize: "inherit" }}
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
