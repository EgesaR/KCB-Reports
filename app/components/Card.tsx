import { motion, MotionProps } from "framer-motion";
import React, { forwardRef } from "react";

interface CardProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}
  
// Use forwardRef to allow passing refs to the component
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...motionProps }, ref) => {
    return (
      <motion.div
        ref={ref} // Pass the ref to motion.div
        className={`h-full relative bg-container p-2 px-1 mt-0 sm:mt-2 sm:p-2 sm:px-4 rounded-xl overflow-auto custom-scrollbar transition duration-300 ${className}`}
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
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

export default Card;