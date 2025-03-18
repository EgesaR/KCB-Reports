import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { currentStep, stepStatuses, user, currentRole } from "./StepProvider";
import axios from "axios"; // Import axios for API calls

const MAX_STEPS = 7; // Total number of steps in the navigation

interface StepNavigationProps {
  refs: Record<number, React.RefObject<{ validateStep: () => boolean }>>; // Ref for each step
  onSubmissionResult: (success: boolean, message?: string) => void; // Callback for submission result
}

// Define the type for user data
interface UserData {
  name?: string;
  email?: string;
  password?: string | null; // Allow null
  roles: string[];
  schools: string[];
}

function StepNavigation({ refs, onSubmissionResult }: StepNavigationProps) {
  const $currentStep = useStore(currentStep);
  const $stepStatuses = useStore(stepStatuses);
  const $user = useStore(user);
  const $role = useStore(currentRole);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    if ($currentStep > 1) {
      const updatedStatuses = { ...$stepStatuses, [$currentStep]: "pending" };
      stepStatuses.set(updatedStatuses);
      currentStep.set($currentStep - 1);
    }
  };

  // Validate user data
  const validateUserData = (userData: UserData): boolean => {
    return (
      !!userData.name &&
      !!userData.email &&
      !!userData.password &&
      userData.roles.length > 0
    );
  };

  // Handle API response
  const handleApiResponse = (response: any) => {
    if (response.status === 200) {
      onSubmissionResult(true);
      alert("Signup successful!");
    } else {
      onSubmissionResult(
        false,
        response.data.error || "Unknown error occurred."
      );
      alert(
        `Signup failed: ${response.data.error || "Unknown error occurred."}`
      );
    }
  };

  // Handle form submission at the last step
  const handleConfirm = async () => {
    setIsSubmitting(true);

    const userData: UserData = {
      name: $user.name?.trim(),
      email: $user.email?.trim(),
      password: $user.password || undefined, // Convert null to undefined
      roles: [$role.title], // Ensure roles are in an array
      schools: Array.isArray($user.schools) ? $user.schools : [], // Ensure schools is always an array
    };

    // Validate required fields
    if (!validateUserData(userData)) {
      onSubmissionResult(
        false,
        "Please complete all required fields before continuing."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Make API call using axios
      const response = await axios.post("/api/signup", userData, {
        headers: { "Content-Type": "application/json" },
      });

      handleApiResponse(response);
    } catch (error) {
      console.error("Error during signup:", error);
      onSubmissionResult(
        false,
        "An unexpected error occurred. Please try again later."
      );
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to the next step
  const handleNext = () => {
    const currentRef = refs[$currentStep];

    if (currentRef?.current) {
      const isValid = currentRef.current.validateStep();
      if (isValid) {
        if ($currentStep === MAX_STEPS - 1) {
          handleConfirm(); // Submit on the last step
        } else {
          currentStep.set($currentStep + 1); // Move to the next step
        }
      } else {
        onSubmissionResult(
          false,
          "Please correct the errors in this step before proceeding."
        );
        alert("Please correct the errors in this step before proceeding.");
      }
    } else {
      // If no currentRef exists
      if ($currentStep === MAX_STEPS - 1) {
        handleConfirm(); // Submit on the last step
        currentStep.set($currentStep + 1);
      } else {
        currentStep.set($currentStep + 1); // Move to the next step
      }
    }
  };

  // Render navigation buttons
  return (
    <div className="navigation-buttons p-[20px] py-[10px] flex justify-between items-center">
      {/* Conditionally render the Back button */}
      {$currentStep > 1 && (
        <button
          className="back bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleBack}
        >
          Go Back
        </button>
      )}
      {$currentStep === 1 && <div></div>}

      {/* Next/Confirm button */}
      <button
        className={`next transition-all ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        } text-white font-bold py-2 px-4 rounded`}
        onClick={handleNext}
        disabled={isSubmitting || $stepStatuses[$currentStep] === "submitting"} // Disable on submitting
      >
        {isSubmitting
          ? "Submitting..."
          : $currentStep === MAX_STEPS - 1
          ? "Confirm"
          : "Next Step"}
      </button>
    </div>
  );
}

export default StepNavigation;
