import { useState } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import {
  currentStep,
  user,
  currentRole,
  teacherProfile,
  adminProfile,
  parentProfile,
} from "./StepProvider";

interface StepNavigationProps {
  refs: Record<number, React.RefObject<{ validateStep: () => boolean }>>;
  onSubmissionResult: (success: boolean, message?: string) => void;
}

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export default function StepNavigation({
  refs,
  onSubmissionResult,
}: StepNavigationProps) {
  const $currentStep = useStore(currentStep);
  const $user = useStore(user);
  const $role = useStore(currentRole);
  const $teacherProfile = useStore(teacherProfile);
  const $adminProfile = useStore(adminProfile);
  const $parentProfile = useStore(parentProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    if ($currentStep.value > 1) {
      currentStep.set({ value: $currentStep.value - 1 });
    }
  };

  const handleNext = () => {
    const currentRef = refs[$currentStep.value];
    if (currentRef?.current) {
      const isValid = currentRef.current.validateStep();
      if (isValid) {
        if ($currentStep.value === 6) {
          handleSubmit();
        } else {
          currentStep.set({ value: $currentStep.value + 1 });
        }
      } else {
        onSubmissionResult(false, "Please correct the errors in this step.");
      }
    } else {
      currentStep.set({ value: $currentStep.value + 1 });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: $user.name,
          email: $user.email,
          password: $user.password,
          dob: $user.dob,
          phone: $user.phone,
          role: $role.title,
          schools:
            $role.title === "Teacher"
              ? $teacherProfile.schools
              : $role.title === "Admin"
              ? $adminProfile.schools
              : $parentProfile.schools,
          teacherProfile:
            $role.title === "Teacher" ? $teacherProfile : undefined,
          adminProfile: $role.title === "Admin" ? $adminProfile : undefined,
          parentProfile: $role.title === "Parent" ? $parentProfile : undefined,
        }),
      });
      const result = await response.json();
      setIsSubmitting(false);
      onSubmissionResult(result.success, result.message);
      if (result.success) {
        currentStep.set({ value: 7 });
      } else {
        setError(result.message || "Submission failed.");
      }
    } catch {
      setIsSubmitting(false);
      setError("Submission failed.");
      onSubmissionResult(false, "Submission failed.");
    }
  };

  return (
    <div className="navigation-buttons p-5 flex justify-between items-center">
      {$currentStep.value > 1 && (
        <motion.button
          className="bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500 text-gray-800 dark:text-neutral-200 font-bold py-2 px-4 rounded"
          onClick={handleBack}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Go Back
        </motion.button>
      )}
      {$currentStep.value === 1 && <div></div>}
      {$currentStep.value < 6 ? (
        <motion.button
          className={`transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={handleNext}
          disabled={isSubmitting}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Next Step
        </motion.button>
      ) : (
        <div className="flex flex-col gap-2">
          <motion.button
            className={`transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={handleSubmit}
            disabled={isSubmitting}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </motion.button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      )}
    </div>
  );
}
