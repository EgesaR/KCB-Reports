import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTie,
  FaSchool,
  FaList,
  FaCheck,
} from "react-icons/fa";

interface StepSvgAnimationProps {
  step: number;
}

// Unique animations for each step
const svgVariants = {
  step1: {
    initial: { scale: 0, opacity: 0, y: 100 },
    animate: {
      scale: [0, 1.3, 1], // Bounce effect
      opacity: [0, 1, 1],
      y: [100, -20, 0],
      transition: { duration: 0.7, ease: ["easeOut", "easeInOut"] },
    },
  },
  step2: {
    initial: { scale: 0.5, opacity: 0, rotateX: 90 },
    animate: {
      scale: [0.5, 1.2, 1], // Flip and settle
      opacity: [0, 1, 1],
      rotateX: [90, 0, 0],
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  step3: {
    initial: { scale: 0.3, opacity: 0, x: -50 },
    animate: {
      scale: [0.3, 1.4, 1], // Slide and overshoot
      opacity: [0, 1, 1],
      x: [-50, 10, 0],
      transition: { duration: 0.8, ease: ["easeOut", "easeIn"] },
    },
  },
  step4: {
    initial: { scale: 0, opacity: 0, rotate: 180 },
    animate: {
      scale: [0, 1.5, 1], // Spin and settle
      opacity: [0, 1, 1],
      rotate: [180, 0, 0],
      transition: { duration: 0.9, ease: "easeOut" },
    },
  },
  step5: {
    initial: { scale: 0.5, opacity: 0, y: -50 },
    animate: {
      scale: [0.5, 1.2, 1], // Drop and bounce
      opacity: [0, 1, 1],
      y: [-50, 20, 0],
      transition: { duration: 0.7, ease: ["easeIn", "easeOut"] },
    },
  },
  step6: {
    initial: { scale: 0.4, opacity: 0, x: 50 },
    animate: {
      scale: [0.4, 1.3, 1], // Slide from right
      opacity: [0, 1, 1],
      x: [50, -10, 0],
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  step7: {
    initial: { scale: 0, opacity: 0, rotate: -360 },
    animate: {
      scale: [0, 1.6, 1], // Dramatic spin and pulse
      opacity: [0, 1, 1],
      rotate: [-360, 20, 0],
      transition: { duration: 1, ease: ["easeOut", "easeInOut"] },
    },
  },
};

export default function StepSvgAnimation({ step }: StepSvgAnimationProps) {
  const icons = [
    null, // Step 0 (unused)
    FaUser, // Step 1: Basic Info
    FaEnvelope, // Step 2: Contact Info
    FaLock, // Step 3: Security Info
    FaUserTie, // Step 4: Role Selection
    FaSchool, // Step 5: Profile Forms
    FaList, // Step 6: Summary
    FaCheck, // Step 7: Submission Complete
  ];

  const Icon = icons[step] || FaUser;
  const variant = `step${step}` as keyof typeof svgVariants;

  return (
    <motion.div
      className="flex items-center justify-center w-full h-full"
      variants={svgVariants[variant]}
      initial="initial"
      animate="animate"
      key={step}
    >
      <Icon className="text-6xl text-blue-400" />
    </motion.div>
  );
}
