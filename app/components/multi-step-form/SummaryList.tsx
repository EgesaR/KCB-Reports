import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import {
  user,
  currentRole,
  teacherProfile,
  adminProfile,
  parentProfile,
} from "./StepProvider";

const itemVariants = {
  initial: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -20 : 20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function SummaryList() {
  const userInfo = useStore(user);
  const role = useStore(currentRole);
  const teacher = useStore(teacherProfile);
  const admin = useStore(adminProfile);
  const parent = useStore(parentProfile);

  const summaryItems = [
    { label: "Name", value: userInfo.name },
    { label: "Date of Birth", value: userInfo.dob },
    { label: "Email", value: userInfo.email },
    { label: "Phone", value: userInfo.phone },
    { label: "Role", value: role.title },
    {
      label: "Schools",
      value: (role.title === "Teacher"
        ? teacher.schools
        : role.title === "Admin"
        ? admin.schools
        : parent.schools
      ).join(", "),
    },
    ...(role.title === "Teacher"
      ? [
          { label: "Subjects", value: teacher.subjects.join(", ") },
          { label: "Classes", value: teacher.classes.join(", ") },
          { label: "Streams", value: teacher.streams },
          { label: "Department Group", value: teacher.departmentGroup },
        ]
      : role.title === "Admin"
      ? [{ label: "Admin Role", value: admin.adminRole }]
      : role.title === "Parent"
      ? [{ label: "Student IDs", value: parent.studentIds.join(", ") }]
      : []),
  ].filter((item) => item.value);

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className="w-full flex flex-col gap-4">
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex justify-between p-2 bg-gray-800/10 rounded"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            custom={index}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-neutral-200">{item.label}</span>
            <span className="text-white">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
