import { useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "framer-motion";
import { currentRole, roleList, currentStep, Role } from "./multi-step-form/StepProvider";
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

const slideVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "left" ? -300 : 300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? 300 : -300,
    opacity: 0,
  }),
};

const stepVariants = {
  step1: {
    title: {
      initial: { opacity: 0, x: -50 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, x: -50 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step2: {
    title: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step3: {
    title: {
      initial: { opacity: 0, scale: 0.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, scale: 0.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step4: {
    title: {
      initial: { opacity: 0, scale: 1.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, scale: 1.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step5: {
    title: {
      initial: { opacity: 0, x: 50 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, x: 50 },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step6: {
    title: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
      },
    },
  },
  step7: {
    title: {
      initial: { opacity: 0, scale: 0.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    subtitle: {
      initial: { opacity: 0, scale: 0.5 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
      },
    },
    particle: {
      initial: { scale: 0, opacity: 0, x: 0, y: 0 },
      animate: (i: number) => ({
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
        x: Math.cos(i * Math.PI * 2) * 50,
        y: Math.sin(i * Math.PI * 2) * 50,
        transition: { duration: 1, delay: i * 0.1, ease: "easeOut" },
      }),
    },
  },
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
    <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto p-4">
      {/* Animated SVG */}
      <div className="md:w-1/3 flex items-center justify-center order-1 md:order-none">
        <StepSvgAnimation step={useStore(currentStep).value} />
      </div>
      {/* Form Content */}
      <div className="md:w-2/3 flex flex-col gap-6 relative order-2">
        <StepProgress totalSteps={7} />
        <Step step={1}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step1.title}
            initial="initial"
            animate="animate"
          >
            Basic Info
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step1.subtitle}
            initial="initial"
            animate="animate"
          >
            Please provide your name and date of birth.
          </motion.p>
          <BasicInfo ref={basicInfoRef} />
        </Step>
        <Step step={2}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step2.title}
            initial="initial"
            animate="animate"
          >
            Contact Info
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step2.subtitle}
            initial="initial"
            animate="animate"
          >
            Please provide your email and phone number.
          </motion.p>
          <ContactInfo ref={contactInfoRef} />
        </Step>
        <Step step={3}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step3.title}
            initial="initial"
            animate="animate"
          >
            Security Info
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step3.subtitle}
            initial="initial"
            animate="animate"
          >
            Set up your password.
          </motion.p>
          <SecurityInfo ref={securityInfoRef} />
        </Step>
        <Step step={4}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step4.title}
            initial="initial"
            animate="animate"
          >
            Select Role
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step4.subtitle}
            initial="initial"
            animate="animate"
          >
            Choose your role to proceed.
          </motion.p>
          <RoleItem onSelect={(r: Role) => currentRole.set(r)} />
        </Step>
        <Step step={5}>
          {selectedRole.title === "Teacher" && (
            <>
              <motion.h1
                className="text-2xl font-bold text-white"
                variants={stepVariants.step5.title}
                initial="initial"
                animate="animate"
              >
                Teacher Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={stepVariants.step5.subtitle}
                initial="initial"
                animate="animate"
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
                variants={stepVariants.step5.title}
                initial="initial"
                animate="animate"
              >
                Admin Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={stepVariants.step5.subtitle}
                initial="initial"
                animate="animate"
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
                variants={stepVariants.step5.title}
                initial="initial"
                animate="animate"
              >
                Parent Profile
              </motion.h1>
              <motion.p
                className="text-gray-300 mt-2"
                variants={stepVariants.step5.subtitle}
                initial="initial"
                animate="animate"
              >
                Provide details about your children.
              </motion.p>
              <ParentProfileInfo loaderData={loaderData} ref={profileFormRef} />
            </>
          )}
        </Step>
        <Step step={6}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step6.title}
            initial="initial"
            animate="animate"
          >
            Review Information
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step6.subtitle}
            initial="initial"
            animate="animate"
          >
            Please review your information before submitting.
          </motion.p>
          <SummaryList />
        </Step>
        <Step step={7}>
          <motion.h1
            className="text-2xl font-bold text-white"
            variants={stepVariants.step7.title}
            initial="initial"
            animate="animate"
          >
            Submission Complete
          </motion.h1>
          <motion.p
            className="text-gray-300 mt-2"
            variants={stepVariants.step7.subtitle}
            initial="initial"
            animate="animate"
          >
            {isSuccess
              ? "Registration successful!"
              : errorMessage || "Processing..."}
          </motion.p>
          {isSuccess && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  variants={stepVariants.step7.particle}
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
