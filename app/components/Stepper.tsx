import { useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import { currentRole, roleList, currentStep } from "./multi-step-form/StepProvider";
import BasicInfo from "./multi-step-form/BasicInfo";
import ContactInfo from "./multi-step-form/ContactInfo";
import SecurityInfo from "./multi-step-form/SecurityInfo";
import RoleItem from "./multi-step-form/RoleItem";
import TeacherProfileForm from "./multi-step-form/TeacherProfileForm";
import AdminProfileForm from "./multi-step-form/AdminProfileForm";
import ParentProfileInfo from "./multi-step-form/ParentProfileInfo";
import SummaryList from "./multi-step-form/SummaryList";
import StepProgress from "./multi-step-form/StepProgress";
import StepNavigation from "./multi-step-form/StepNavigation";
import StepSvgAnimation from "./multi-step-form/StepSvgAnimation";

interface StepProps {
  step: number;
  children: React.ReactNode;
}

interface StepperProps {
  loaderData: {
    subjects: string[];
    classes: string[];
    schools: string[];
  };
}

// Slide variants from SignInPage
const slideVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "left" ? -300 : 300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? 300 : -300,
    opacity: 0,
  }),
};

// Animations for titles and subtitles
const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Celebratory animation for Step 7
const particleVariants = {
  initial: { scale: 0, opacity: 0, x: 0, y: 0 },
  animate: (i: number) => ({
    scale: [0, 1, 0],
    opacity: [0, 0.8, 0],
    x: Math.cos(i * Math.PI * 2) * 50,
    y: Math.sin(i * Math.PI * 2) * 50,
    transition: { duration: 1, delay: i * 0.1, ease: "easeOut" },
  }),
};

const Step = ({ step, children }: StepProps) => {
  const $currentStep = useStore(currentStep);
  const direction = $currentStep.value > step ? "left" : "right";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {$currentStep.value === step && (
        <motion.div
          className="flex flex-col gap-4"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          key={step}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Stepper({ loaderData }: StepperProps) {
  const selectedRole = useStore(currentRole);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const basicInfoRef = useRef<{ validateStep: () => boolean }>(null);
  const contactInfoRef = useRef<{ validateStep: () => boolean }>(null);
  const securityInfoRef = useRef<{ validateStep: () => boolean }>(null);
  const profileFormRef = useRef<{ validateStep: () => boolean }>(null);

  const handleSubmissionResult = (success: boolean, message?: string) => {
    setIsSuccess(success);
    setErrorMessage(message || "");
  };

  const validateStep4 = () => !!selectedRole.title;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Animated SVG on the Left */}
      <div className="md:w-1/3 flex items-center justify-center">
        <StepSvgAnimation step={useStore(currentStep).value} />
      </div>
      {/* Form Content */}
      <div className="md:w-2/3 flex flex-col gap-6 relative">
        <StepProgress totalSteps={7} />
        <Step step={1}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            Basic Info
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={textVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Please provide your name and date of birth.
          </motion.p>
          <BasicInfo ref={basicInfoRef} />
        </Step>
        <Step step={2}>
          <h1 className="text-2xl font-bold text-white">Contact Info</h1>
          <p className="text-gray-300 mt-2">
            Please provide your email and phone number.
          </p>
          <ContactInfo ref={contactInfoRef} />
        </Step>
        <Step step={3}>
          <h1 className="text-2xl font-bold text-white">Security Info</h1>
          <p className="text-gray-300 mt-2">Set up your password.</p>
          <SecurityInfo ref={securityInfoRef} />
        </Step>
        <Step step={4}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            Select Role
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={textVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Choose your role to proceed.
          </motion.p>
          <div className="flex flex-col gap-4">
            {roleList.get().map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <RoleItem role={role} onSelect={(r) => currentRole.set(r)} />
              </motion.div>
            ))}
          </div>
        </Step>
        <Step step={5}>
          {selectedRole.title === "Teacher" && (
            <>
              <motion.h1
                className="text-2xl font-bold text-white"
                variants={textVariants}
                initial="initial"
                animate="animate"
              >
                Teacher Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={textVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                Provide information about your teaching assignment.
              </motion.p>
              <TeacherProfileForm
                loaderData={loaderData}
                ref={profileFormRef}
              />
            </>
          )}
          {selectedRole.title === "Admin" && (
            <>
              <motion.h1
                className="text-2xl font-bold text-white"
                variants={textVariants}
                initial="initial"
                animate="animate"
              >
                Admin Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={textVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                Provide your administrative details.
              </motion.p>
              <AdminProfileForm loaderData={loaderData} ref={profileFormRef} />
            </>
          )}
          {selectedRole.title === "Parent" && (
            <>
              <motion.h1
                className="text-2xl font-bold text-white"
                variants={textVariants}
                initial="initial"
                animate="animate"
              >
                Parent Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={textVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                Provide details about your children.
              </motion.p>
              <ParentProfileInfo loaderData={loaderData} ref={profileFormRef} />
            </>
          )}
        </Step>
        <Step step={6}>
          <h1 className="text-2xl font-bold text-white">Review Information</h1>
          <p className="text-gray-300 mt-2">
            Please review your information before submitting.
          </p>
          <SummaryList />
        </Step>
        <Step step={7}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            Submission Complete
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={textVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            {isSuccess
              ? "Registration successful!"
              : errorMessage || "Processing..."}
          </motion.p>
          {/* Particle Burst for Celebration */}
          {isSuccess && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  variants={particleVariants}
                  initial="initial"
                  animate="animate"
                  custom={i / 10}
                  style={{ left: "50%", top: "50%" }}
                />
              ))}
            </div>
          )}
        </Step>
        <StepNavigation
          refs={{
            1: basicInfoRef,
            2: contactInfoRef,
            3: securityInfoRef,
            4: { current: { validateStep: validateStep4 } },
            5: profileFormRef,
          }}
          onSubmissionResult={handleSubmissionResult}
        />
      </div>
    </div>
  );
}
