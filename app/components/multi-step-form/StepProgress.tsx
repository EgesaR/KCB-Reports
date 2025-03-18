import React from "react";
import { motion } from "framer-motion";

interface StepProgressProps {
  steps: number; // Total number of steps
  currentStep: number; // Current step (1-based index)
  progress: number; // Progress percentage (0-100)
  color?: string; // Color for the progress bar (e.g., "blue", "red", "teal")
  showPercentage?: boolean; // Whether to show the percentage text
  showCheckmark?: boolean; // Whether to show a checkmark at the end
}

const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  progress,
  color = "blue",
  showPercentage = true,
  showCheckmark = false,
}) => {
  // Determine the color classes
  const progressColor = {
    blue: "bg-blue-600 dark:bg-blue-500",
    red: "bg-red-600 dark:bg-red-500",
    teal: "bg-teal-500 dark:bg-teal-500",
  }[color];

  const inactiveColor = {
    blue: "bg-gray-300 dark:bg-neutral-600",
    red: "bg-red-100 dark:bg-red-500/30",
    teal: "bg-teal-100 dark:bg-teal-500/30",
  }[color];

  // Calculate the width of each step
  const stepWidth = 100 / steps;

  return (
    <div className="flex items-center gap-x-1">
      {Array.from({ length: steps }).map((_, index) => (
        <motion.div
          key={index}
          className="w-full h-2.5 flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition duration-500"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          initial={{ width: 0 }}
          animate={{
            width: `${stepWidth}%`,
            backgroundColor:
              index < currentStep - 1 || progress >= 100
                ? progressColor
                : index === currentStep - 1
                ? progress >= (index + 1) * stepWidth
                  ? progressColor
                  : inactiveColor
                : inactiveColor,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      ))}
      {showPercentage && (
        <div className="w-10 text-end">
          <span
            className={`text-sm ${
              color === "red" ? "text-red-500" : "text-gray-800 dark:text-white"
            }`}
          >
            {progress}%
          </span>
        </div>
      )}
      {showCheckmark && progress >= 100 && (
        <div className="ms-1">
          <span className="shrink-0 ms-auto size-4 flex justify-center items-center rounded-full bg-teal-500 text-white">
            <svg
              className="shrink-0 size-3"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default StepProgress;