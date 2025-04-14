import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { Form } from "@remix-run/react";
import type { Student } from "~/types";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  initialData?: Student;
  action: string;
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  action,
}: FormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            <Form method="post" action={action}>
              <input
                type="hidden"
                name="intent"
                value={initialData ? "update" : "create"}
              />
              {initialData && (
                <input type="hidden" name="id" value={initialData.id} />
              )}
              {fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      defaultValue={
                        initialData?.[field.name as keyof Student] as
                          | string
                          | undefined
                      }
                      className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">
                        {field.placeholder || "Select an option"}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      defaultValue={
                        initialData?.[field.name as keyof Student] as
                          | string
                          | undefined
                      }
                      placeholder={field.placeholder}
                      className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </Form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
