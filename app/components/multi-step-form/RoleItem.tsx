import { motion } from "framer-motion";

interface RoleProps {
  role: { title: string };
  onSelect: (role: { title: string }) => void;
}

const roleVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

export default function RoleItem({ role, onSelect }: RoleProps) {
  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-gray-800/20 backdrop-blur-sm rounded-lg shadow-md cursor-pointer"
      onClick={() => onSelect(role)}
      variants={roleVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <span className="text-white">{role.title}</span>
    </motion.div>
  );
}
