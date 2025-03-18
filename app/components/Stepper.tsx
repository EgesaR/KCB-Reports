import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@nanostores/react";
import BasicInfo from "./multi-step-form/BasicInfo";
import RoleItem from "./multi-step-form/RoleItem";
import TeacherProfileForm from "./multi-step-form/TeacherProfileForm";
import Step from "./multi-step-form/Step";
import StepNavigation from "./multi-step-form/StepNavigation";
import {
  roleList,
  currentRole,
  currentStep,
  user,
} from "./multi-step-form/StepProvider";
import { TiUser } from "react-icons/ti";
import ContactInfo, { ContactInfoRef } from "./multi-step-form/ContactInfo";
import SecurityInfo, { SecurityInfoRef } from "./multi-step-form/SecurityInfo";
import AdminProfileForm from "./multi-step-form/AdminProfileForm";
import ParentProfileInfo from "./multi-step-form/ParentProfileInfo";
import SummaryList from "./multi-step-form/SummaryList";
import StepProgress from "./multi-step-form/StepProgress"; // Import the StepProgress component
import { FaExclamationTriangle } from "react-icons/fa"; // For the error icon

const Stepper = () => {
  const [timeFrameStep, setTimeFrameStep] = useState(0); // Progress messages
  const [showSignUpStepper, setShowSignUpStepper] = useState(false); // Stepper visibility
  const selectedRole = useStore(currentRole); // Global selected role
  const $currentStep = useStore(currentStep);

  const [progress, setProgress] = useState(0); // Track progress
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Track success/failure
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  // Refs for step validation
  const securityInfoRef = useRef<SecurityInfoRef>(null);
  const contactInfoRef = useRef<ContactInfoRef>(null);

  useEffect(() => {
    setShowSignUpStepper(true); // Show stepper after welcome messages
  }, []);

  // Handle submission result from StepNavigation
  const handleSubmissionResult = (success: boolean, message?: string) => {
    setIsSuccess(success);
    if (!success) {
      setErrorMessage(message || "An unexpected error occurred.");
    }
  };

  // Sentences for progress animation
  const sentences = [
    "Welcome to our platform!",
    "We are excited to have you here.",
    "Let's make this journey amazing.",
    "Progress is just a step away.",
    "Your goals are within reach.",
    "Stay focused and motivated.",
    "We believe in your potential.",
    "Let's achieve greatness together!",
  ];

  // Convert minutes to milliseconds
  const seconds = 1000;
  const minutes = 60 * seconds;
  const getMinutes = (minute: number) => minute * minutes;

  useEffect(() => {
    if ($currentStep === 7 && isSuccess === true) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (progress === 100 && prevIndex === sentences.length - 1) {
            clearInterval(interval); // Stop updating when progress reaches 100
            return prevIndex;
          }
          return prevIndex === sentences.length - 1 ? 0 : prevIndex + 1; // Cycle through sentences
        });
        setProgress((prev) => {
          if (prev >= 100) return 100; // Stop progress at 100
          return prev + 10; // Increment progress by 10
        });
      }, getMinutes(0.05)); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [progress, sentences.length, $currentStep, isSuccess]);

  return (
    <motion.main className="h-screen w-full flex flex-col items-center justify-center">
      {/* Stepper Content */}
      {showSignUpStepper && (
        <motion.section className="h-[85%] w-full flex px-8 pt-6 pb-2 gap-6 sm:min-w-4xl max-w-4xl bg-gray-800/10 rounded-xl backdrop-blur-3xl shadow-2xl">
          {/* Side Avatar */}
          <div
            className={`grid place-content-center ${
              $currentStep === 7 ? "w-[30%]" : "w-[50%]"
            }`}
          >
            <motion.div
              className="h-28 w-28 bg-neutral-200/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <TiUser className="size-28 text-white" />
            </motion.div>
          </div>

          {/* Stepper Form */}
          {$currentStep < 7 && (
            <motion.div className="flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="w-full mb-5">
                <h1 className="text-3xl font-semibold">KCB Reports</h1>
              </div>

              {/* Transition for steps */}
              <motion.section
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex-1"
              >
                {/* Step 1: Basic Info */}
                <Step step={1}>
                  <h1 className="text-2xl font-bold">Basic Info</h1>
                  <p className="text-gray-500 mt-2 mb-4 dark:text-gray-300">
                    Let’s start with the basics! Share your full name and date
                    of birth so we can get to know you better.
                  </p>
                  <BasicInfo />
                </Step>

                {/* Step 2: Contact Info */}
                <Step step={2}>
                  <h1 className="text-2xl font-bold">Contact Info</h1>
                  <p className="text-gray-500 mt-2 mb-4 dark:text-gray-300">
                    Help us stay connected! Enter your email address and phone
                    number so we can reach you when needed.
                  </p>
                  <ContactInfo ref={contactInfoRef} />
                </Step>

                {/* Step 3: Security Info */}
                <Step step={3}>
                  <h1 className="text-2xl font-bold">Security Info</h1>
                  <p className="text-gray-500 mt-2 mb-4 dark:text-gray-300">
                    Your account’s safety is our priority. Set up a strong
                    password and configure security options to keep your
                    information safe.
                  </p>
                  <SecurityInfo ref={securityInfoRef} />
                </Step>

                {/* Step 4: Role Selection */}
                <Step step={4}>
                  <h1 className="text-2xl font-bold">Select Your Role</h1>
                  <p className="text-gray-500 mt-2 mb-4 dark:text-gray-300">
                    Who are you in this journey? Choose whether you're a
                    teacher, parent, or admin, and we'll tailor the experience
                    just for you.
                  </p>
                  <div className="flex flex-col gap-4 mt-6">
                    {roleList.map((role, idx) => (
                      <motion.div
                        key={idx}
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                      >
                        <RoleItem
                          role={role}
                          onSelect={(role) => currentRole.set(role)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {selectedRole && (
                    <div className="mt-4 text-xl">
                      Selected Role:{" "}
                      <span className="font-semibold">
                        {selectedRole.title}
                      </span>
                    </div>
                  )}
                </Step>

                {/* Step 5: Additional Info */}
                <Step step={5}>
                  {selectedRole?.title === "Teacher" ? (
                    <>
                      <h1 className="text-2xl font-bold">Teacher Profile</h1>
                      <p className="text-gray-500 mt-2">
                        Provide information about your teaching subjects and
                        classes.
                      </p>
                      <TeacherProfileForm />
                    </>
                  ) : selectedRole?.title === "Admin" ? (
                    <>
                      <h1 className="text-2xl font-bold">Admin Profile</h1>
                      <p className="text-gray-500 mt-2">
                        Provide information about your school and administrative
                        role.
                      </p>
                      <AdminProfileForm />
                    </>
                  ) : selectedRole?.title === "Parent" ? (
                    <>
                      <h1 className="text-2xl font-bold">Parent Profile</h1>
                      <p className="text-gray-500 mt-2">
                        Provide information about your school and children.
                      </p>
                      <ParentProfileInfo />
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">Additional Info</h1>
                      <p className="text-gray-500 mt-2">
                        Add details relevant to your role.
                      </p>
                    </>
                  )}
                </Step>

                {/* Step 6: Finalization */}
                <Step step={6}>
                  <h1 className="text-2xl font-bold">Finishing Up</h1>
                  <p className="text-gray-500 mt-2 dark:text-gray-300">
                    Review everything before confirming.
                  </p>
                  <SummaryList />
                </Step>
              </motion.section>

              {/* Step Navigation */}
              <StepNavigation
                refs={{
                  2: contactInfoRef,
                  3: securityInfoRef,
                }}
                onSubmissionResult={handleSubmissionResult}
              />
            </motion.div>
          )}

          {/* Step 7: Transition with Slide Effect */}
          {$currentStep === 7 && (
            <motion.div
              className="w-[70%] flex flex-col justify-end relative overflow-hidden px-6"
              variants={{
                hidden: { x: 300, opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: -300, opacity: 0 },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col">
                {/* Display error message or progress animation */}
                {isSuccess === false ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <FaExclamationTriangle className="text-2xl" />
                    <span className="text-base font-bold">{errorMessage}</span>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={currentIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 1 }}
                      className="text-base text-left font-bold text-gray-800 dark:text-neutral-200"
                    >
                      {sentences[currentIndex]}
                    </motion.h2>
                  </AnimatePresence>
                )}
              </div>
              {/* Progress Bar */}
              {isSuccess === true && (
                <div className="h-10 flex flex-col justify-end pb-3 w-full">
                  <StepProgress
                    steps={7} // Total number of steps
                    currentStep={$currentStep} // Current step
                    progress={progress} // Progress percentage
                    color="blue" // Progress bar color
                    showPercentage // Show percentage text
                    showCheckmark={progress >= 100} // Show checkmark at 100%
                  />
                </div>
              )}
            </motion.div>
          )}
        </motion.section>
      )}
    </motion.main>
  );
};

export default Stepper;
