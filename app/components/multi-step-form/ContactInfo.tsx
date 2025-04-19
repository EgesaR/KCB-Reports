import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { user } from "./StepProvider";

const ContactInfo = forwardRef((props, ref) => {
  const userInfo = useStore(user);
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [formData, setFormData] = useState({
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? ""
          : "Invalid email address",
        phone: /^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))
          ? ""
          : "Invalid phone number",
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
    if (formData.email && formData.phone) {
      user.set({ ...userInfo, ...formData });
    }
  }, [formData]);

  return (
    <form className="min-h-[50vh] w-full flex flex-col gap-6">
      {["email", "phone"].map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label
            htmlFor={field}
            className="text-sm font-medium text-gray-900 dark:text-neutral-200"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "tel"}
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

export default ContactInfo;
