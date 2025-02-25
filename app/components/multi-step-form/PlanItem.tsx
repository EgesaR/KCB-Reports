import { useStore } from "@nanostores/react";
import {
  roleType,
  roleList,
  currentRole
} from "./StepProvider";

type Props = {
  src: string;
  role: roleType;
};

function PlanItem({ src, role }: Props) {
  const $currentRole = useStore(currentRole);

  const lowerCaseTitle = role.title.toLowerCase();

  function handleSubscriptionChange() {
    currentRole.set(role);
  }

  return (
    <>
      <input
        name="plan"
        type="radio"
        checked={role.title === $currentRole.title}
        value={role.title}
        onChange={handleSubscriptionChange}
        id={`plan-${lowerCaseTitle}`}
      />
      <label htmlFor={`role-${lowerCaseTitle}`}>
        <img src={src} alt={role.title} />
        <div>
          <h3>{role.title}</h3>
        </div>
      </label>
    </>
  );
}

export default PlanItem;
