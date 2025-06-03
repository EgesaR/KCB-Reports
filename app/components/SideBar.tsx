import { useState } from "react";
import { FaRegHeart, FaHeart, FaRegClock } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { CgHomeAlt } from "react-icons/cg";
import { motion } from "framer-motion";

const SideBar = () => {
  const [isLiked, setIsLiked] = useState(false);
  const mainButtons = Array(4).fill({ label: "Home", icon: <CgHomeAlt /> });
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

  return (
    <aside className="bg-zinc-200 dark:bg-zinc-900 rounded-lg py-4 flex flex-col items-center justify-between px-1.5">
      <span className="font-bold text-md opacity-0">KR</span>
      <div className="flex flex-col items-center gap-4">
        {mainButtons.map((btn, index) => (
          <SideBarBtn
            key={`main-btn-${index}`}
            label={btn.label}
            icon={btn.icon}
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

const SideBarBtn = ({
  label,
  className,
  icon,
}: {
  label: string;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div className="h-5 w-1 bg-purple-300 rounded-full absolute top-1/2 -translate-y-1/2">

      </motion.div>
      <motion.button
        className={`h-8 w-10 grid place-content-center text-[20px] rounded-lg hover:bg-zinc-700/50 ${
          className || ""
        }`}
        aria-label={label}
        whileTap={{ scale: 0.87 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.button>
      <motion.div
        className="bg-zinc-800 text-xs font-semibold absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-lg whitespace-nowrap"
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
  );
};

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
      className="h-8 w-8 grid place-content-center rounded-full hover:bg-zinc-700/50 relative overflow-hidden"
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
