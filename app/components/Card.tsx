// app/components/Card.tsx
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface CardProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...motionProps
}) => {
  return (
    <motion.div
      className={`h-full relative bg-dark p-2 px-1 mt-0 sm:mt-2 sm:p-2 rounded-xl overflow-auto custom-scrollbar transition duration-300 ${className}`}
      layout
      layoutDependency={false}
      initial={{ scale: 0.98, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1, ...(motionProps.animate as any) }}
      transition={{
        layout: {
          duration: 0.3,
          ease: "easeOut",
        },
        width: {
          duration: 0.3,
          ease: "easeOut",
        },
        scale: {
          duration: 0.2,
          ease: "easeOut",
        },
        opacity: {
          duration: 0.2,
        },
      }}
      {...(motionProps as Record<string, any>)} // Type assertion to spread
    >
      {children}
    </motion.div>
  );
};

export default Card;
