import { useState } from "react";
import { useStore } from "@nanostores/react";
import { Form, useActionData } from "@remix-run/react";
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
  const errors = useActionData<any>();

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
          setIsSubmitting(true); // Submission handled by Form
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

  return (
    <div className="navigation-buttons p-[20px] py-[10px] flex justify-between items-center">
      {$currentStep.value > 1 && (
        <button
          className="bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500 text-gray-800 dark:text-neutral-200 font-bold py-2 px-4 rounded"
          onClick={handleBack}
        >
          Go Back
        </button>
      )}
      {$currentStep.value === 1 && <div></div>}
      {$currentStep.value < 6 ? (
        <button
          className={`transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={handleNext}
          disabled={isSubmitting}
        >
          Next Step
        </button>
      ) : (
        <Form
          method="post"
          action="/api/signup"
          onSubmit={() => setIsSubmitting(true)}
        >
          <input type="hidden" name="name" value={$user.name || ""} />
          <input type="hidden" name="email" value={$user.email || ""} />
          <input type="hidden" name="password" value={$user.password || ""} />
          <input
            type="hidden"
            name="roles"
            value={JSON.stringify([$role.title])}
          />
          <input
            type="hidden"
            name="schools"
            value={JSON.stringify(
              $role.title === "Teacher"
                ? $teacherProfile.schools
                : $role.title === "Admin"
                ? $adminProfile.schools
                : $parentProfile.schools || []
            )}
          />
          {$role.title === "Teacher" && (
            <input
              type="hidden"
              name="teacherProfile"
              value={JSON.stringify($teacherProfile)}
            />
          )}
          {$role.title === "Admin" && (
            <input
              type="hidden"
              name="adminProfile"
              value={JSON.stringify($adminProfile)}
            />
          )}
          {$role.title === "Parent" && (
            <input
              type="hidden"
              name="parentProfile"
              value={JSON.stringify($parentProfile)}
            />
          )}
          <button
            type="submit"
            className={`transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
          {errors && (
            <div className="text-red-500 mt-2">
              {errors.errors?.email ||
                errors.errors?.message ||
                "Submission failed."}
            </div>
          )}
        </Form>
      )}
    </div>
  );
}
