import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { user } from "./StepProvider";

const fieldVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface ContactInfoProps {}

const ContactInfo = forwardRef<
  { validateStep: () => boolean },
  ContactInfoProps
>(({}, ref) => {
  const $user = useStore(user);
  const [formData, setFormData] = useState({
    email: $user.email || "",
    phone: $user.phone || "",
  });
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [emailChecked, setEmailChecked] = useState(false);

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const newErrors = {
        email: formData.email
          ? emailChecked
            ? ""
            : "Checking email..."
          : "Email is required",
        phone: formData.phone ? "" : "Phone number is required",
      };
      setErrors(newErrors);
      if (formData.email && !emailChecked) {
        const response = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const { exists } = await response.json();
        if (exists) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
          setEmailChecked(true);
          return false;
        }
        setEmailChecked(true);
      }
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailChecked(false);
  };

  useEffect(() => {
    user.set({ ...$user, ...formData });
  }, [formData]);

  return (
    <form className="min-h-[50vh] w-full flex flex-col gap-6">
      {["email", "phone"].map((field, index) => (
        <motion.div
          key={field}
          className="flex flex-col gap-2"
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.2 }}
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            name={field}
            value={formData[field as keyof typeof formData]}
            onChange={handleInputChange}
            className="border-2 border-gradient-to-r from-blue-500 to-purple-500 rounded p-2 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200"
            placeholder={
              field === "email" ? "Enter your email" : "Enter your phone number"
            }
          />
          {errors[field as keyof typeof errors] && (
            <span className="text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </span>
          )}
        </motion.div>
      ))}
    </form>
  );
});

export default ContactInfo;
