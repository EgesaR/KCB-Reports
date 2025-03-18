import React from "react";
import { FaHouse } from "react-icons/fa6"; // House icon from React Icons

type IconButtonProps = {
  onClick?: () => void; // Click handler
  icon?: React.ReactNode; // Optional custom icon
  className?: string; // Additional custom classes
};

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className="",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 flex items-center justify-center rounded-full cursor-pointer shadow-xs transition-all duration-500 bg-transparent text-white hover:bg-indigo-700 dark:bg-transparent dark:hover:bg-indigo-800 ${className}`}
    >
      {icon || <FaHouse className="w-5 h-5" />}{" "}
      {/* Default to house icon if no custom icon is provided */}
    </button>
  );
};

export default IconButton;
