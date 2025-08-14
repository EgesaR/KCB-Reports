// app/components/Card.tsx
import {
  motion,
  MotionProps,
  TargetAndTransition,
  Transition,
  VariantLabels,
} from "framer-motion";
import React, { forwardRef } from "react";

interface CardProps extends Omit<MotionProps, "ref"> {
  children: React.ReactNode;
  className?: string;
}

// Use forwardRef to allow passing refs to the component
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      initial,
      animate,
      exit,
      transition,
      ...restMotionProps
    },
    ref
  ) => {
    const defaultInitial: TargetAndTransition = { scale: 0.98, opacity: 0.8 };
    const defaultAnimate: TargetAndTransition = { scale: 1, opacity: 1 };
    const defaultExit: TargetAndTransition = { scale: 0.95, opacity: 0 };
    const defaultTransition: Transition = {
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
    };

    // Helper function for initial and animate props
    const mergeInitialOrAnimate = (
      defaultProp: TargetAndTransition,
      customProp: MotionProps["initial"] | MotionProps["animate"]
    ): TargetAndTransition | VariantLabels | boolean | undefined => {
      // Handle undefined: return defaultProp
      if (customProp === undefined) {
        return defaultProp;
      }
      // Handle false: return false (valid for initial and animate)
      if (customProp === false) {
        return false;
      }
      // Handle string or string[]: return as-is for variants
      if (typeof customProp === "string" || Array.isArray(customProp)) {
        return customProp as VariantLabels;
      }
      // Handle object: merge with defaultProp
      if (typeof customProp === "object") {
        return { ...defaultProp, ...customProp } as TargetAndTransition;
      }
      // Fallback for unexpected types
      return defaultProp;
    };

    // Helper function for exit prop (false not allowed)
    const mergeExit = (
      defaultProp: TargetAndTransition,
      customProp: MotionProps["exit"]
    ): TargetAndTransition | VariantLabels | undefined => {
      // Handle undefined: return defaultProp
      if (customProp === undefined) {
        return defaultProp;
      }
      // Handle string or string[]: return as-is for variants
      if (typeof customProp === "string" || Array.isArray(customProp)) {
        return customProp as VariantLabels;
      }
      // Handle object: merge with defaultProp
      if (typeof customProp === "object") {
        return { ...defaultProp, ...customProp } as TargetAndTransition;
      }
      // Fallback for unexpected types (including false)
      return defaultProp;
    };

    // Helper function for transition prop
    const mergeTransition = (
      defaultProp: Transition,
      customProp: MotionProps["transition"]
    ): Transition | undefined => {
      // Handle undefined: return defaultProp
      if (customProp === undefined) {
        return defaultProp;
      }
      // Handle object: merge with defaultProp
      if (typeof customProp === "object") {
        return { ...defaultProp, ...customProp } as Transition;
      }
      // Fallback for unexpected types (including string, string[], false)
      return defaultProp;
    };

    return (
      <motion.div
        ref={ref}
        className={`h-full relative bg-container p-2 px-1 mt-0 sm:mt-2 sm:p-2 sm:px-4 rounded-xl overflow-auto custom-scrollbar transition duration-300 ${className}`}
        layout
        layoutDependency={false}
        initial={mergeInitialOrAnimate(defaultInitial, initial)}
        animate={mergeInitialOrAnimate(defaultAnimate, animate)}
        exit={mergeExit(defaultExit, exit)}
        transition={mergeTransition(defaultTransition, transition)}
        {...restMotionProps}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
