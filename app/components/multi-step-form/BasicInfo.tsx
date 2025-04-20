import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { user } from "./StepProvider";

const fieldVariants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  focus: {
    transition: { duration: 0.2 },
  },
};

const BasicInfo = forwardRef((props, ref) => {
  const userInfo = useStore(user);
  const [errors, setErrors] = useState({ name: "", dob: "" });
  const [formData, setFormData] = useState({
    name: userInfo.name || "",
    dob: userInfo.dob || "",
  });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        name: /^[A-Za-z\s]+$/.test(formData.name.trim())
          ? ""
          : "Name must contain only letters",
        dob:
          formData.dob && new Date(formData.dob) < new Date()
            ? ""
            : "DOB must be in the past",
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
    if (formData.name && formData.dob) {
      user.set({ ...userInfo, ...formData });
    }
  }, [formData]);

  return (
    <form className="min-h-[50vh] w-full flex flex-col gap-6">
      {["name", "dob"].map((field, index) => (
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
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <motion.input
            id={field}
            name={field}
            type={field === "dob" ? "date" : "text"}
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

export default BasicInfo;
