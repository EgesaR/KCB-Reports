import { motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import { currentStep } from "./StepProvider";

export default function StepProgress({ totalSteps = 7 }) {
  const $currentStep = useStore(currentStep);
  const progress = ($currentStep.value / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-neutral-600">
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
