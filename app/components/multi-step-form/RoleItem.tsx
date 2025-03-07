import React, { useState, useRef } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

function PersonalInfo() {
  const $user = useStore(user);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
  const phoneRegex = /^\+?[0-9]{7,15}$/; // Accepts 7-15 digits, optional '+' at the start
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, 1 letter, 1 number

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    user.setKey(name, value);

    // Validate inputs on change
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "email") {
        newErrors.email = emailRegex.test(value) ? "" : "Invalid email format";
      } else if (name === "phone") {
        newErrors.phone = phoneRegex.test(value)
          ? ""
          : "Phone number must be 7-15 digits, with optional '+'";
      } else if (name === "password") {
        newErrors.password = passwordRegex.test(value)
          ? ""
          : "Password must be at least 8 characters, with one letter and one number";
      }

      return newErrors;
    });
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Enter" && inputRefs.current[index + 1]) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus(); // Focus the next input
    }
  }

  return (
    <form>
      {["name", "email", "phone", "password"].map((field, index) => (
        <div key={field} className="my-2">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-900"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)} {/* Capitalize */}
          </label>
          <input
            id={field}
            name={field}
            type={
              field === "password"
                ? "password"
                : field === "email"
                ? "email"
                : "text"
            }
            value={$user[field] ?? ""}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            required
            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm ${
              errors[field as keyof typeof errors] ? "outline-red-500" : ""
            }`}
          />
          {/* Show validation errors */}
          {errors[field as keyof typeof errors] && (
            <p className="mt-1 text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </p>
          )}
        </div>
      ))}
    </form>
  );
}

export default PersonalInfo;
