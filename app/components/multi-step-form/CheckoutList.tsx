import { useStore } from "@nanostores/react";
import {
  currentStep,
  currentRole,
  addons,
} from "./StepProvider";

function CheckoutList() {
  const $currentRole = useStore(currentRole);
  const $addons = useStore(addons);

  return (
    <ul className="finishing-up">
      <li>
        <div className="base-cost">
          <strong>
            Arcade
          </strong>
          <button onClick={() => currentStep.set(2)}>Change</button>
        </div>
      </li>
    </ul>
  );
}

export default CheckoutList;
