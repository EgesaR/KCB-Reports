import type { CSSProperties } from "react";
import { useStore } from "@nanostores/react";
import { currentStep, stepStatuses, user } from "./StepProvider"; // Import stepStatuses

const maxSteps = 5;

function StepNavigation() {
  const $currentStep = useStore(currentStep); // Current step
  const $stepStatuses = useStore(stepStatuses); // Step statuses
  const $user = useStore(user); // User info

  // Handle "Go Back" button click
  function handleBack() {
    if ($currentStep > 1) {
      // Get the current value of stepStatuses
      const updatedStatuses = { ...stepStatuses.get() }; // Clone the object to avoid direct mutations

      // Reset the status of the previous step to "pending"
      updatedStatuses[$currentStep - 1] = "pending";

      // Update the atom with the modified value
      stepStatuses.set(updatedStatuses);

      // Move back to the previous step
      currentStep.set($currentStep - 1);
    }
  }


  // Handle "Next Step" button click
  function handleNext() {
    if ($currentStep < maxSteps) {
      // Get the current value of stepStatuses
      const updatedStatuses = stepStatuses.get();

      // Update the status for the current step
      updatedStatuses[$currentStep] = validateStep($currentStep)
        ? "success"
        : "failure";

      // Update the atom with the modified value
      stepStatuses.set(updatedStatuses);

      // Move to the next step
      currentStep.set($currentStep + 1);
    }
  }

  // Step validation logic
  function validateStep(step: number): boolean {
    // Example: Validate step based on user inputs
    if (step === 2) {
      return $user.name !== null && $user.email !== null;
    }
    // Add further step-specific validation if necessary
    return true;
  }

  // Check if the "Next" button should be disabled
  const isNextButtonDisabled = Object.values($user).some(
    (x) => x === "" || x === null
  );

  // Define styles for back/next buttons
  const backStyle: CSSProperties =
    $currentStep === 1 ? { visibility: "hidden" } : {};
  const nextStyle: CSSProperties =
    $currentStep === maxSteps ? { visibility: "hidden" } : {};

  return (
    <div className="navigation-buttons">
      <span>Current Step: {$currentStep}</span>
      <button className="back" style={backStyle} onClick={handleBack}>
        Go Back
      </button>
      <button
        className={`next ${$currentStep === maxSteps - 1 ? " final" : ""} dark:bg-blue-900`}
        style={nextStyle}
        onClick={handleNext}
        disabled={isNextButtonDisabled}
      >
        {$currentStep === maxSteps - 1 ? "Confirm" : "Next Step"}
      </button>
    </div>
  );
}

export default StepNavigation;
