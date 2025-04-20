import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { teacherProfile } from "./StepProvider";

const fieldVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface TeacherProfileFormProps {
  loaderData: { subjects: string[]; classes: string[]; schools: string[] };
}

const subjectIcons: Record<string, string> = {
  Math: "📐",
  Science: "🔬",
  English: "📖",
  History: "🏛️",
  Physics: "⚛️",
  Language: "🗣️",
};

const TeacherProfileForm = forwardRef<
  { validateStep: () => boolean },
  TeacherProfileFormProps
>(({ loaderData }, ref) => {
  const profile = useStore(teacherProfile);
  const [formData, setFormData] = useState({
    schools: profile.schools,
    subjects: profile.subjects,
    classes: profile.classes,
    streams: profile.streams,
    departmentGroup: profile.departmentGroup,
  });
  const [errors, setErrors] = useState({
    schools: "",
    subjects: "",
    classes: "",
  });
  const [availableSubjects, setAvailableSubjects] = useState<string[]>(
    loaderData.subjects
  );

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        schools: formData.schools.length ? "" : "Select at least one school",
        subjects: formData.subjects.length ? "" : "Select at least one subject",
        classes: formData.classes.length ? "" : "Select at least one class",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  const handleMultiSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return {
        ...prev,
        [field]: updated,
        ...(field === "subjects" && {
          departmentGroup:
            updated.includes("Math") || updated.includes("Physics")
              ? "Mathematics"
              : updated.includes("English") || updated.includes("Language")
              ? "Languages"
              : updated.includes("Science")
              ? "Sciences"
              : updated.includes("History")
              ? "Social Studies"
              : "",
        }),
      };
    });
  };

  const handleSchoolSelect = async (school: string) => {
    const updatedSchools = formData.schools.includes(school)
      ? formData.schools.filter((s) => s !== school)
      : [...formData.schools, school];
    setFormData((prev) => ({ ...prev, schools: updatedSchools }));
    if (updatedSchools.length) {
      const response = await fetch("/api/get-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: updatedSchools[0] }),
      });
      const subjects = await response.json();
      setAvailableSubjects(subjects);
    } else {
      setAvailableSubjects(loaderData.subjects);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    teacherProfile.set(formData);
  }, [formData]);

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <form className="w-full flex flex-col gap-6">
        <motion.div
          className="flex flex-col gap-2"
          variants={fieldVariants}
          initial="initial"
          animate="animate"
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            Schools
          </label>
          <div className="flex flex-wrap gap-2">
            {loaderData.schools.map((school) => (
              <motion.button
                key={school}
                type="button"
                onClick={() => handleSchoolSelect(school)}
                className={`px-3 py-1 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-500 ${
                  formData.schools.includes(school)
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200"
                }`}
                variants={fieldVariants}
              >
                {school}
              </motion.button>
            ))}
          </div>
          {errors.schools && (
            <span className="text-sm text-red-500">{errors.schools}</span>
          )}
        </motion.div>
        <motion.div
          className="flex flex-col gap-2"
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSubjects.map((subject) => (
              <motion.button
                key={subject}
                type="button"
                onClick={() => handleMultiSelect("subjects", subject)}
                className={`px-3 py-1 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-500 ${
                  formData.subjects.includes(subject)
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200"
                }`}
                variants={fieldVariants}
              >
                {subjectIcons[subject] || "📚"} {subject}
              </motion.button>
            ))}
          </div>
          {errors.subjects && (
            <span className="text-sm text-red-500">{errors.subjects}</span>
          )}
        </motion.div>
        <motion.div
          className="flex flex-col gap-2"
          variants={fieldVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
            Classes
          </label>
          <div className="flex flex-wrap gap-2">
            {loaderData.classes.map((cls) => (
              <motion.button
                key={cls}
                type="button"
                onClick={() => handleMultiSelect("classes", cls)}
                className={`px-3 py-1 rounded-full border-2 border-gradient-to-r from-blue-500 to-purple-500 ${
                  formData.classes.includes(cls)
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-neutral-200"
                }`}
                variants={fieldVariants}
              >
                {cls}
              </motion.button>
            ))}
          </div>
          {errors.classes && (
            <span className="text-sm text-red-500">{errors.classes}</span>
          )}
        </motion.div>
        {["streams", "departmentGroup"].map((field, index) => (
          <motion.div
            key={field}
            className="flex flex-col gap-2"
            variants={fieldVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: (index + 3) * 0.2 }}
          >
            <label className="text-sm font-medium text-gray-900 dark:text-neutral-200">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              value={formData[field as keyof typeof formData] || ""}
              onChange={handleInputChange}
              className="border-2 border-gradient-to-r from-blue-500 to-purple-500 rounded p-2 focus:outline-none dark:bg-neutral-900 dark:text-neutral-200"
              disabled={field === "departmentGroup"}
            />
          </motion.div>
        ))}
      </form>
    </div>
  );
});

export default TeacherProfileForm;
