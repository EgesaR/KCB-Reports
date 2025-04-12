import { FC, ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "text" | "filled" | "outlined";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const IconButton: FC<IconButtonProps> = ({
  variant = "text",
  icon,
  size = "md",
  rounded = true,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses = "transition-all duration-200 focus:outline-none";
  
  const variantClasses = {
    text: "text-[#E8DEF8] hover:bg-purple-400/20 dark:text-purple-400 dark:hover:bg-purple-400/20",
    filled: "bg-[#E8DEF8] text-[#1C1B1F] hover:bg-[#E8DEF8]/90 dark:bg-[#4A4458] dark:text-purple-400 dark:hover:bg-[#4A4458]/80",
    outlined: "border border-[#E8DEF8] text-[#E8DEF8] hover:bg-purple-400/20 dark:border-[#4A4458] dark:text-[#4A4458] dark:hover:bg-[#4A4458]/20",
  }; 

  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${rounded ? "rounded-full" : "rounded-md"}
        ${fullWidth ? "w-full flex justify-center" : ""}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;