import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

export interface SecurityInfoRef {
  validateStep: () => boolean;
}

const SecurityInfo = forwardRef<SecurityInfoRef>((_, ref) => {
  const userInfo = useStore(user);

  const [errors, setErrors] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: userInfo.password || "",
    confirmPassword: userInfo.confirmPassword || "",
  });

  const validateField = (name: string, value: string): string => {
    if (name === "password") {
      return value.trim().length >= 8
        ? ""
        : "Password must be at least 8 characters long.";
    } else if (name === "confirmPassword") {
      return value === formData.password ? "" : "Passwords do not match.";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));

      return updatedFormData;
    });
  };

  useImperativeHandle(ref, () => ({
    validateStep: (): boolean => {
      const newErrors = {
        password: validateField("password", formData.password),
        confirmPassword: validateField(
          "confirmPassword",
          formData.confirmPassword
        ),
      };

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((error) => error !== "");
      if (!hasErrors) {
        user.set({ ...userInfo, ...formData });
        return true;
      }

      return false;
    },
  }));

  return (
    <form className="h-[90%] w-full flex flex-col gap-6">
      {["password", "confirmPassword"].map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-900 dark:text-neutral-200"
          >
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")}
          </label>
          <input
            id={field}
            name={field}
            type="password"
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleChange}
            className={`border rounded p-2 focus:outline-0 ${
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
});

export default SecurityInfo;
