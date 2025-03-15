import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
import SpecificData from "./multi-step-form/AddonItem";
import { TiUser } from "react-icons/ti";
import ContactInfo, { ContactInfoRef } from "./multi-step-form/ContactInfo";
import SecurityInfo, { SecurityInfoRef } from "./multi-step-form/SecurityInfo";
import AdminProfileForm from "./multi-step-form/AdminProfileForm";
import ParentProfileInfo from "./multi-step-form/ParentProfileInfo";
import SummaryList from "./multi-step-form/SummaryList";

const Stepper = () => {
  const [timeFrameStep, setTimeFrameStep] = useState(0); // Progress messages
  const [showSignUpStepper, setShowSignUpStepper] = useState(false); // Stepper visibility
  const selectedRole = useStore(currentRole); // Global selected role

  // Refs for step validation
  const securityInfoRef = useRef<SecurityInfoRef>(null);
  const contactInfoRef = useRef<ContactInfoRef>(null);

  useEffect(() => {
    setShowSignUpStepper(true); // Show stepper after welcome messages
  }, []);

  useEffect(() => {
    if (timeFrameStep < 3) {
      const timer = setTimeout(
        () => setTimeFrameStep((prev) => prev + 1),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [timeFrameStep]);

  // Handle selecting a role
  const handleSelectRole = (role: { title: string }) => currentRole.set(role);

  // Animation variants for Framer Motion
  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center">
      {/* Initial Welcome Messages */}
      {!showSignUpStepper ? (
        <motion.div
          className="text-center text-black dark:text-white"
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
        >
          {timeFrameStep === 0 && <h1 className="text-4xl font-bold">Hi</h1>}
          {timeFrameStep === 1 && (
            <h1 className="text-4xl font-bold">Welcome to KCB Reports</h1>
          )}
          {timeFrameStep === 2 && (
            <h1 className="text-4xl font-bold">
              Let's begin by creating your account
            </h1>
          )}
        </motion.div>
      ) : (
        // Stepper Content
        <section className="h-[85%] w-full flex px-8 pt-6 pb-2 gap-6 sm:min-w-4xl max-w-4xl bg-gray-800/10 rounded-xl backdrop-blur-3xl shadow-2xl">
          {/* Side Avatar */}
          <div className="flex-1 grid place-content-center">
            <div className="h-28 w-28 bg-neutral-200/20 rounded-full">
              <TiUser className="size-28 text-white" />
            </div>
          </div>

          {/* Stepper Form */}
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
              {/* Step 1: Basic Info */}
              <Step step={1}>
                <h1 className="text-2xl font-bold">Basic Info</h1>
                <p className="text-gray-500 mt-2 mb-4">
                  Let’s start with the basics! Share your full name and date of
                  birth so we can get to know you better.
                </p>
                <BasicInfo />
              </Step>

              {/* Step 2: Contact Info */}
              <Step step={2}>
                <h1 className="text-2xl font-bold">Contact Info</h1>
                <p className="text-gray-500 mt-2 mb-4">
                  Help us stay connected! Enter your email address and phone
                  number so we can reach you when needed.
                </p>
                <ContactInfo ref={contactInfoRef} />
              </Step>

              {/* Step 3: Security Info */}
              <Step step={3}>
                <h1 className="text-2xl font-bold">Security Info</h1>
                <p className="text-gray-500 mt-2 mb-4">
                  Your account’s safety is our priority. Set up a strong
                  password and configure security options to keep your
                  information safe.
                </p>
                <SecurityInfo ref={securityInfoRef} />
              </Step>

              {/* Step 4: Role Selection */}
              <Step step={4}>
                <h1 className="text-2xl font-bold">Select Your Role</h1>
                <p className="text-gray-500 mt-2 mb-4">
                  Who are you in this journey? Choose whether you're a teacher,
                  parent, or admin, and we'll tailor the experience just for
                  you.
                </p>
                <div className="flex flex-col gap-4 mt-6">
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

              {/* Step 5: Additional Info */}
              <Step step={5}>
                {selectedRole.title === "Teacher" ? (
                  <>
                    <h1 className="text-2xl font-bold">Teacher Profile</h1>
                    <p className="text-gray-500 mt-2">
                      Provide information about your teaching subjects and
                      classes.
                    </p>
                    <TeacherProfileForm />
                  </>
                ) : selectedRole.title === "Admin" ? (
                  <>
                    <h1 className="text-2xl font-bold">Admin Profile</h1>
                    <p className="text-gray-500 mt-2">
                      Provide information about your school and and
                      administrative role
                    </p>
                    <AdminProfileForm />
                  </>
                ) : selectedRole.title === "Parent" ? (
                  <>
                    <h1 className="text-2xl font-bold">Parent Profile</h1>
                    <p className="text-gray-500 mt-2">
                      Provide information about your school and and
                      administrative role
                    </p>
                    <ParentProfileInfo />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">Additional Info</h1>
                    <p className="text-gray-500 mt-2">
                      Add details relevant to your role.
                    </p>
                    <SpecificData />
                  </>
                )}
              </Step>

              {/* Step 6: Finalization */}
              <Step step={6}>
                <h1 className="text-2xl font-bold">Finishing Up</h1>
                <p className="text-gray-500 mt-2">
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
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Stepper;
