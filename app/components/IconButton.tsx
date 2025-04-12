import { FC, ButtonHTMLAttributes } from "react";

type IconButtonVariant = "text" | "filled" | "outlined" | "gradient";
type IconButtonColor =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  icon: string;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  fullWidth?: boolean;
}

const IconButton: FC<IconButtonProps> = ({
  variant = "text",
  color = "gray",
  icon,
  size = "md",
  rounded = true,
  fullWidth = false,
  className = "",
  ...props
}) => {
  // Base classes
  const baseClasses = "transition-all duration-200 focus:outline-none";

  // Size classes
  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  // Variant and color classes
  const variantClasses = {
    text: {
      gray: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
      red: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30",
      blue: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30",
      // Add other colors as needed
    },
    filled: {
      gray: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600",
      red: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
      blue: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
      // Add other colors as needed
    },
    // Add other variants as needed
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]?.[color] || variantClasses.text.gray}
        ${rounded ? "rounded-full" : "rounded-md"}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      <i className={`fas fa-${icon}`} />
    </button>
  );
};

export default IconButton;
