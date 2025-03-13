import React, { useState, useRef, useEffect, startTransition } from "react";
import { useStore } from "@nanostores/react";
import { user, currentStep, stepStatuses } from "./StepProvider";

const PersonalInfo = () => {
  const userInfo = useStore(user); // Access global user store
  const $currentStep = useStore(currentStep); // Current step
  const $stepStatuses = useStore(stepStatuses); // Step statuses
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Reference to inputs

  const [errors, setErrors] = useState({
    name: "",
    dob: "",
  });

  const [formData, setFormData] = useState({
    name: userInfo.name || "",
    dob: userInfo.dob || "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    startTransition(() => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    });

    // Validate required fields
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() === "" ? `${name} is required` : "",
    }));
  };

  // Save data to global store automatically
  const handleAutoSave = () => {
    const hasErrors = Object.keys(formData).some(
      (key) => formData[key as keyof typeof formData] === ""
    );

    if (!hasErrors) {
      startTransition(() => {
        user.set({ ...userInfo, ...formData });
      });

      const updatedStatuses = { ...$stepStatuses };
      updatedStatuses[$currentStep] = "success";
      stepStatuses.set(updatedStatuses);
    }
  };

  useEffect(() => {
    handleAutoSave();
  }, [formData]); // Automatically save whenever formData changes

  return (
    <form className="h-[90%] w-full flex flex-col gap-6">
      {["name", "dob"].map((field, index) => (
        <div key={field} className="flex flex-col gap-2">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-900"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            type={field === "dob" ? "date" : "text"}
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleChange}
            onBlur={handleAutoSave} // Trigger save on blur
            ref={(el) => (inputRefs.current[index] = el)}
            className={`border rounded p-2 ${
              errors[field as keyof typeof errors]
                ? "border-red-500"
                : "border-neutral-300"
            }`}
            required
          />
          {errors[field as keyof typeof errors] && (
            <span className="text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </span>
          )}
        </div>
      ))}
    </form>
  );
};

export default PersonalInfo;
