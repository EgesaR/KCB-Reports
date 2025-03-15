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
  const selectedRole = useStore(currentRole); // Get the currently selected role
  const isSelected = selectedRole.title === role.title; // Check if the role is selected
  const Icon = iconMap[role.title]; // Map the role to its corresponding icon

  return (
    <div className="h-12 w-full flex items-center justify-between rounded-md shadow border border-neutral-400 py-2 px-4">
      <div className="flex gap-4">
        <Icon className="text-2xl" />
        <h2 className="text-lg font-medium">{role.title}</h2>
      </div>
      <label
        className="relative flex cursor-pointer items-center rounded-full p-3"
        htmlFor={role.title}
        data-ripple-dark="true"
      >
        <input
          name="ripple"
          type="radio"
          className="before:content[''] peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-blue-400 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity hover:before:opacity-10"
          id={role.title}
          checked={isSelected} // Link to the selected state
          onChange={() => onSelect(role)} // Trigger the selection handler
        />
        <span className="absolute bg-blue-600 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
      </label>
    </div>
  );
}

export default RoleItem;
