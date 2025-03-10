import { useStore } from "@nanostores/react";
import { currentRole } from "./StepProvider";
import { FaUserTie, FaUserGraduate, FaUserShield } from "react-icons/fa";

interface RoleItemProps {
  role: {
    title: string;
  };
  onSelect: (role: { title: string }) => void;
}

const iconMap: { [key: string]: React.ComponentType<{ className: string }> } = {
  Teacher: FaUserTie,
  Parent: FaUserGraduate,
  Admin: FaUserShield,
};

function RoleItem({ role, onSelect }: RoleItemProps) {
  const selectedRole = useStore(currentRole);
  const isSelected = selectedRole.title === role.title;
  const Icon = iconMap[role.title];

  return (
    <div
      className={`flex flex-col justify-center items-center p-4 py-8 border rounded-lg cursor-pointer transition ${
        isSelected ? "border-blue-500 shadow-none" : "border-gray-300 shadow-md"
      }`}
      onClick={() => onSelect(role)}
    >
      <Icon className="text-2xl mb-2" />
      <h2 className="text-lg font-bold">{role.title}</h2>
    </div>
  );
}

export default RoleItem;
