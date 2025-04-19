import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

const SecurityInfo = forwardRef((props, ref) => {
  const userInfo = useStore(user);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        password:
          formData.password.length >= 8
            ? ""
            : "Password must be at least 8 characters",
        confirmPassword:
          formData.password === formData.confirmPassword
            ? ""
            : "Passwords do not match",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.password && formData.password === formData.confirmPassword) {
      user.set({ ...userInfo, password: formData.password });
    }
  }, [formData]);

  return (
    <form className="min-h-[50vh] w-full flex flex-col gap-6">
      {["password", "confirmPassword"].map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label
            htmlFor={field}
            className="text-sm font-medium text-gray-900 dark:text-neutral-200"
          >
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace("Password", " Password")}
          </label>
          <input
            id={field}
            name={field}
            type="password"
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleChange}
            className={`border rounded p-2 focus:outline-0 dark:border-neutral-500 ${
              errors[field as keyof typeof errors]
                ? "border-red-500"
                : "border-neutral-300"
            }`}
            aria-describedby={`${field}-error`}
            required
          />
          {errors[field as keyof typeof errors] && (
            <span id={`${field}-error`} className="text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </span>
          )}
        </div>
      ))}
    </form>
  );
});

export default SecurityInfo;
