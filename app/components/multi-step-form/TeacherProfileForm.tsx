import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { teacherProfile } from "./StepProvider";

const inputVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  focus: {
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.2 },
  },
};

interface TeacherProfileFormProps {
  loaderData: { subjects: string[]; classes: string[]; schools: string[] };
}

const TeacherProfileForm = forwardRef<
  { validateStep: () => boolean },
  TeacherProfileFormProps
>(({ loaderData }, ref) => {
  const profile = useStore(teacherProfile);
  const [formData, setFormData] = useState({
    subjects: profile.subjects || [],
    classes: profile.classes || [],
    schools: profile.schools || [],
    streams: profile.streams || "",
    departmentGroup: profile.departmentGroup || "",
  });
  const [errors, setErrors] = useState({
    subjects: "",
    classes: "",
    schools: "",
  });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        subjects: formData.subjects.length ? "" : "Select at least one subject",
        classes: formData.classes.length ? "" : "Select at least one class",
        schools: formData.schools.length ? "" : "Select at least one school",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  const handleMultiSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    teacherProfile.set(formData);
  }, [formData]);

  return (
    <form className="min-h-[50vh] w-full flex flex-col gap-6">
      {["subjects", "classes", "schools"].map((field, index) => (
        <motion.div
          key={field}
          className="flex flex-col gap-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: index * 0.2 }}
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <div className="flex flex-wrap gap-2">
            {loaderData[field as keyof typeof loaderData].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleMultiSelect(field as keyof typeof formData, item)
                }
                className={`px-3 py-1 rounded-full border ${
                  (
                    formData[field as keyof typeof formData] as string[]
                  ).includes(item)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-800/10 border-neutral-500 text-neutral-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {errors[field as keyof typeof errors] && (
            <span className="text-sm text-red-500">
              {errors[field as keyof typeof errors]}
            </span>
          )}
        </motion.div>
      ))}
      {["streams", "departmentGroup"].map((field, index) => (
        <motion.div
          key={field}
          className="flex flex-col gap-2"
          variants={inputVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: (index + 3) * 0.2 }}
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <motion.input
            name={field}
            value={formData[field as keyof typeof formData] || ""}
            onChange={handleInputChange}
            className="border rounded p-2 focus:outline-0 dark:border-neutral-500 bg-gray-800/10 backdrop-blur-sm"
            variants={inputVariants}
            whileHover="hover"
            whileFocus="focus"
          />
        </motion.div>
      ))}
    </form>
  );
});

export default TeacherProfileForm;
