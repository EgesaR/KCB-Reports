import { useStore } from "@nanostores/react";
import { isMonthly } from "./StepProvider"; // Changed from isSubscriptionTimeMonthly

function SubscriptionTimeToggle() {
  const $isMonthly = useStore(isMonthly);

  function toggleSubscriptionTime() {
    isMonthly.set(!$isMonthly);
  }

  return (
    <div className="button-month-year">
      <strong className={$isMonthly ? "active" : ""}>Monthly</strong>
      <input
        id="month-year"
        type="checkbox"
        name="subscription"
        checked={!$isMonthly}
        onChange={toggleSubscriptionTime}
      />
      <label htmlFor="month-year">
        <span className="dot"></span>
      </label>
      <strong className={!$isMonthly ? "active" : ""}>Yearly</strong>
    </div>
  );
}

export default SubscriptionTimeToggle;
