import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { adminProfile } from "./StepProvider";

const fieldVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface AdminProfileFormProps {
  loaderData: { subjects: string[]; classes: string[]; schools: string[] };
}

const AdminProfileForm = forwardRef<
  { validateStep: () => boolean },
  AdminProfileFormProps
>(({ loaderData }, ref) => {
  const profile = useStore(adminProfile);
  const [formData, setFormData] = useState({
    adminRole: profile.adminRole,
    schools: profile.schools,
  });
  const [errors, setErrors] = useState({ adminRole: "", schools: "" });

  useImperativeHandle(ref, () => ({
    validateStep: () => {
      const newErrors = {
        schools: formData.schools.length ? "" : "Select at least one school",
        adminRole: formData.adminRole ? "" : "Select an admin role",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((e) => e);
    },
  }));

  const handleSelect = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "schools"
          ? prev.schools.includes(value)
            ? prev.schools.filter((s) => s !== value)
            : [...prev.schools, value]
          : value,
    }));
  };

  useEffect(() => {
    adminProfile.set(formData);
  }, [formData]);

  const adminRoles = ["Principal", "Registrar"];

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
                onClick={() => handleSelect("schools", school)}
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
            Admin Role
          </label>
          <select
            value={formData.adminRole}
            onChange={(e) => handleSelect("adminRole", e.target.value)}
            data-hs-select='{
                "placeholder": "Select a role...",
                "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
                "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                "optionTemplate": \"<div className=\\\"flex items-center\\\"><div><div className=\\\"hs-selected:font-semibold text-sm text-gray-800 dark:text-neutral-200\\\" data-title></div></div><div className=\\\"ms-auto\\\"><span className=\\\"hidden hs-selected:block\\\"><svg className=\\\"shrink-0 size-4 text-blue-600\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"16\\\" height=\\\"16\\\" fill=\\\"currentColor\\\" viewBox=\\\"0 0 16 16\\\"><path d=\\\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\\\"/></svg></span></div></div>\",
                "extraMarkup": \"<div className=\\\"absolute top-1/2 end-3 -translate-y-1/2\\\"><svg className=\\\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" strokeWidth=\\\"2\\\" strokeLinecap=\\\"round\\\" strokeLinejoin=\\\"round\\\"><path d=\\\"m7 15 5 5 5-5\\\"/><path d=\\\"m7 9 5-5 5 5\\\"/></svg></div>\"
              }'
            className="hidden w-full max-w-xs"
          >
            <option value="">Select a role...</option>
            {adminRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.adminRole && (
            <span className="text-sm text-red-500">{errors.adminRole}</span>
          )}
        </motion.div>
      </form>
    </div>
  );
});

export default AdminProfileForm;
