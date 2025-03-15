import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

export interface ContactInfoRef {
  validateStep: () => boolean;
}

const ContactInfo = forwardRef<ContactInfoRef>((_, ref) => {
  const userInfo = useStore(user);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  });

  const validateField = (name: string, value: string): string => {
    if (name === "email") {
      return value.includes("@") && value.includes(".")
        ? ""
        : "Invalid email address";
    } else if (name === "phone") {
      return value.trim().length >= 10
        ? ""
        : "Phone number must be at least 10 digits";
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

      return updatedFormData; // Ensure updated state
    });
  };

  useImperativeHandle(ref, () => ({
    validateStep: (): boolean => {
      const newErrors = {
        email: validateField("email", formData.email),
        phone: validateField("phone", formData.phone),
      };

      setErrors(newErrors);

      const hasErrors = Object.values(newErrors).some((error) => error !== "");
      if (!hasErrors) {
        user.set({ ...userInfo, ...formData });
        return true; // Validation passed
      }

      return false; // Validation failed
    },
  }));

  return (
    <form className="h-[90%] w-full flex flex-col gap-6">
      {["email", "phone"].map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-900 dark:text-neutral-200"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "tel"}
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

export default ContactInfo;
