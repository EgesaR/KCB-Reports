import React, { useState } from "react";

type ChipVariant = "outlined" | "filled";
type ChipSize = "sm" | "md" | "lg";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
  isActive?: boolean;
  defaultActive?: boolean;
  onClick?: (isActive: boolean) => void;
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = "outlined",
  size = "md",
  className = "",
  isActive: propIsActive,
  defaultActive = false,
  onClick,
}) => {
  const [internalIsActive, setInternalIsActive] = useState(defaultActive);
  const isControlled = propIsActive !== undefined;
  const active = isControlled ? propIsActive : internalIsActive;

  const baseClasses = `inline-flex items-center gap-x-1.5 rounded-md font-medium border shadow-2xs cursor-pointer transition-colors duration-200 ${className}`;

  const sizeClasses = {
    sm: "py-1 px-2 text-xs",
    md: "py-1.5 px-3 text-xs",
    lg: "py-2 px-4 text-sm",
  };

  const variantClasses = {
    outlined: `border-[#E8DEF8] ${
      active ? "bg-purple-400/20" : "bg-transparent"
    } text-[#E8DEF8] dark:border-[#4A4458] dark:text-purple-400`,
    filled: `border-transparent ${
      active ? "bg-[#E8DEF8]" : "bg-[#E8DEF8]/80"
    } text-[#1C1B1F] dark:bg-[#4A4458] dark:text-[#E8DEF8]`,
  };

  const handleClick = () => {
    if (!isControlled) {
      setInternalIsActive(!active);
    }
    onClick?.(!active);
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={handleClick}
      aria-pressed={active}
    >
      {children}
    </span>
  );
};

export default Chip;
