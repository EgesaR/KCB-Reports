import React from "react";
import { useStore } from "@nanostores/react";
import { currentStep, stepStatuses } from "./StepProvider";

const maxSteps = 5;

interface StepNavigationProps {
  refs: Record<number, React.RefObject<{ validateStep: () => boolean }>>; // Flexible for multiple refs
}

function StepNavigation({ refs }: StepNavigationProps) {
  const $currentStep = useStore(currentStep);
  const $stepStatuses = useStore(stepStatuses);

  const handleBack = () => {
    if ($currentStep > 1) {
      const updatedStatuses = { ...stepStatuses.get() };
      updatedStatuses[$currentStep - 1] = "pending";
      stepStatuses.set(updatedStatuses);

      currentStep.set($currentStep - 1);
    }
  };

  const handleNext = () => {
    const currentRef = refs[$currentStep];

    // Check if the current step has a ref and validate it
    if (currentRef && currentRef.current) {
      const isValid = currentRef.current.validateStep();
      if (isValid) {
        currentStep.set($currentStep + 1);
      } else {
        alert("Please correct validation errors before proceeding.");
        return;
      }
    } else {
      // Proceed if no validation is needed for the current step
      currentStep.set($currentStep + 1);
    }
  };

  return (
    <div className="navigation-buttons p-[20px] py-[10px]">
      <button
        className="back"
        onClick={handleBack}
        disabled={$currentStep === 1}
      >
        Go Back
      </button>
      <button className="next" onClick={handleNext}>
        {$currentStep === maxSteps - 1 ? "Confirm" : "Next Step"}
      </button>
    </div>
  );
}

export default StepNavigation;
