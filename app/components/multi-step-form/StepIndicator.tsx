import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { currentStep, stepStatuses } from "./StepProvider";

function StepIndicator() {
  const $currentStep = useStore(currentStep); // Get the current step number
  const $stepStatuses = useStore(stepStatuses); // Get statuses for all steps

  return (
    <ul className="relative flex flex-col items-center gap-y-4">
      {[1, 2, 3, 4].map((step, index) => {
        const status = $stepStatuses[step]; // Retrieve the status of the step

        return (
          <li key={step} className="flex flex-col items-center gap-y-2 group">
            {/* Step Indicator */}
            <span
              className={`min-w-7 min-h-7 flex justify-center items-center text-xs font-medium rounded-full ${
                $currentStep === step
                  ? "bg-blue-600 text-white"
                  : status === "success"
                  ? "bg-green-500 text-white"
                  : status === "failure"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* Display logic */}
              {$currentStep === step || status === "pending" ? (
                step
              ) : status === "success" ? (
                <motion.svg
                  className="size-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : status === "failure" ? (
                <motion.svg
                  className="size-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </motion.svg>
              ) : null}
            </span>

            {/* Divider */}
            {index < 3 && (
              <div
                className={`w-1 bg-gray-200 h-10 ${
                  status === "success"
                    ? "bg-green-500"
                    : status === "failure"
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
              ></div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default StepIndicator;
