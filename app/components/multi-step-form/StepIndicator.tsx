import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { currentStep } from "./StepProvider";
import styles from "~/styles/styles.module.css";  // Import CSS module styles

const indicator = {
  active: {
    backgroundColor: "var(--pastel-blue)",
    color: "var(--marine-blue)",
  },
  inactive: {
    backgroundColor: "rgba(0,0,0,0)",
    color: "rgba(255,255,255,1)",
  },
};

function StepIndicator() {
  const $currentStep = useStore(currentStep);

  return (
    <ul className={styles.stepIndicatorContainer}>
      <li className={styles.stepIndicator}>
        <motion.span
          animate={$currentStep === 1 ? "active" : "inactive"}
          variants={indicator}
          className={styles.stepNumber}
        >
          1
        </motion.span>
        <div>
          <p>Step 1</p>
          <h2>Your info</h2>
        </div>
      </li>
      <li className={styles.stepIndicator}>
        <motion.span
          animate={$currentStep === 2 ? "active" : "inactive"}
          variants={indicator}
          className={styles.stepNumber}
        >
          2
        </motion.span>
        <div>
          <p>Step 2</p>
          <h2>Select plan</h2>
        </div>
      </li>
      <li className={styles.stepIndicator}>
        <motion.span
          animate={$currentStep === 3 ? "active" : "inactive"}
          variants={indicator}
          className={styles.stepNumber}
        >
          3
        </motion.span>
        <div>
          <p>Step 3</p>
          <h2>Add-ons</h2>
        </div>
      </li>
      <li className={styles.stepIndicator}>
        <motion.span
          animate={$currentStep >= 4 ? "active" : "inactive"}
          variants={indicator}
          className={styles.stepNumber}
        >
          4
        </motion.span>
        <div>
          <p>Step 4</p>
          <h2>Summary</h2>
        </div>
      </li>
    </ul>
  );
}

export default StepIndicator;
