import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CheckoutList from "./multi-step-form/CheckoutList";
import PersonalInfo from "./multi-step-form/PersonalInfo";
import RoleItem from "./multi-step-form/RoleItem";
import TeacherProfileForm from "./multi-step-form/TeacherProfileForm";
import Step from "./multi-step-form/Step";
import StepNavigation from "./multi-step-form/StepNavigation";
import { roleList, currentRole, user } from "./multi-step-form/StepProvider";
import SpecificData from "./multi-step-form/AddonItem";
import { useStore } from "@nanostores/react";
import { TiUser } from "react-icons/ti";

const Stepper = () => {
  const [timeFrameStep, setTimeFrameStep] = useState(0); // Track the current message
  const [showSignUpStepper, setShowSignUpStepper] = useState(false); // Control the stepper visibility
  const selectedRole = useStore(currentRole);
  const userInfo = useStore(user);

  useEffect(() => {
    // Progress through the time frame messages
    if (timeFrameStep < 3) {
      const timer = setTimeout(() => {
        setTimeFrameStep((prev) => prev + 1);
      }, 2000); // 2-second delay per message
      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setShowSignUpStepper(true); // Show the stepper after messages
    }
  }, [timeFrameStep]);

  const handleSelectRole = (role: { title: string }) => {
    currentRole.set(role);
  };

  // Animation variants for Framer Motion
  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center">
      {!showSignUpStepper ? (
        <motion.div
          className="text-center text-black dark:text-white"
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
        >
          {timeFrameStep === 0 && (
            <motion.h1
              key="hello"
              initial="hidden"
              animate="visible"
              variants={fadeInVariant}
              className="text-4xl font-bold text-gray-800 dark:text-white"
            >
              Hello
            </motion.h1>
          )}
          {timeFrameStep === 1 && (
            <motion.h1
              key="welcome"
              initial="hidden"
              animate="visible"
              variants={fadeInVariant}
              className="text-4xl font-bold text-gray-800 dark:text-white"
            >
              Welcome to KCB Reports
            </motion.h1>
          )}
          {timeFrameStep === 2 && (
            <motion.h1
              key="begin"
              initial="hidden"
              animate="visible"
              variants={fadeInVariant}
              className="text-4xl font-bold text-gray-800 dark:text-white"
            >
              Let's begin by creating your account
            </motion.h1>
          )}
        </motion.div>
      ) : (
        <section className="h-[85%] w-full flex p-8 gap-6 max-w-4xl bg-gray-800/10 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-0 shadow-2xl">
          {/* Steps Content */}
          <div className="flex-1 grid place-content-center">
            <div className="h-28 w-28 bg-neutral-200/20 rounded-full">
              <TiUser className="size-28 text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="w-full mb-5">
              <h1 className="text-3xl font-semibold">KCB Reports</h1>
            </div>
            <motion.section
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1"
            >
              {/* Step 1: Personal Info */}
              <Step step={1}>
                <h1 className="text-2xl font-bold text-gray-800">
                  Personal Info
                </h1>
                <p className="text-gray-500 mt-2">
                  We’d love to know you better! Please enter your name, email,
                  phone number, date of birth, and a short bio.
                </p>
                <PersonalInfo />
              </Step>

              {/* Step 2: Role Selection */}
              <Step step={2}>
                <h1 className="text-2xl font-bold text-gray-800">
                  Select your role
                </h1>
                <p className="text-gray-500 mt-2">
                  Select whether you are a teacher, parent, or admin.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {roleList.map((role, idx) => (
                    <RoleItem
                      key={idx}
                      role={role}
                      onSelect={handleSelectRole}
                    />
                  ))}
                </div>
                {selectedRole && (
                  <div className="mt-4 text-xl">
                    Selected Role:{" "}
                    <span className="font-semibold">{selectedRole.title}</span>
                  </div>
                )}
              </Step>

              {/* Step 3: Additional Info based on Role */}
              <Step step={3}>
                {selectedRole.title === "Teacher" && (
                  <>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Teacher Profile
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Please provide information about your subjects, classes,
                      and streams.
                    </p>
                    <TeacherProfileForm />
                  </>
                )}
                {selectedRole.title !== "Teacher" && (
                  <>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Additional Info
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Please provide any additional information relevant to your
                      role.
                    </p>
                    <SpecificData />
                  </>
                )}
              </Step>

              {/* Step 4: Finalization */}
              <Step step={4}>
                <h1 className="text-2xl font-bold text-gray-800">
                  Finishing up
                </h1>
                <p className="text-gray-500 mt-2">
                  Double-check everything looks OK before confirming.
                </p>
                <CheckoutList />
              </Step>
            </motion.section>

            {/* Step Navigation */}
            <StepNavigation />
          </div>
        </section>
      )}
    </main>
  );
};

export default Stepper;
