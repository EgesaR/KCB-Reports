import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { user } from "./StepProvider";

const fieldVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  focus: {
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.2 },
  },
};

const SecurityInfo = forwardRef((props, ref) => {
  const userInfo = useStore(user);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [formData, setFormData] = useState({
    password: userInfo.password || "",
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
      {["password", "confirmPassword"].map((field, index) => (
        <motion.div
          key={field}
          className="flex flex-col gap-2"
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.2 }}
        >
          <label
            htmlFor={field}
            className="text-sm font-medium text-gray-900 dark:text-neutral-200"
          >
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace("Password", " Password")}
          </label>
          <motion.input
            id={field}
            name={field}
            type="password"
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleChange}
            className={`border rounded p-2 focus:outline-0 dark:border-neutral-500 bg-gray-800/10 backdrop-blur-sm ${
              errors[field as keyof typeof errors]
                ? "border-red-500"
                : "border-neutral-300"
            }`}
            aria-describedby={`${field}-error`}
            required
            variants={fieldVariants}
            whileHover="hover"
            whileFocus="focus"
          />
          {errors[field as keyof typeof errors] && (
            <span id={`${field}-error`} className="text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </span>
          )}
        </motion.div>
      ))}
    </form>
  );
});

export default SecurityInfo;
