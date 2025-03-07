import { useState } from "react";
import { motion } from "framer-motion";
import CheckoutList from "./multi-step-form/CheckoutList";
import PersonalInfo from "./multi-step-form/PersonalInfo";
import RoleItem from "./multi-step-form/RoleItem";
import Step from "./multi-step-form/Step";
import StepIndicator from "./multi-step-form/StepIndicator";
import StepNavigation from "./multi-step-form/StepNavigation";
import { roleList } from "./multi-step-form/StepProvider";
import SpecificData from "./multi-step-form/AddonItem";

const Stepper = () => {
  const [showSignUpStepper, setShowSignUpStepper] = useState(false);

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      {!showSignUpStepper ? (
        // Welcome Screen
        <div className="flex h-full w-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 p-6"
          >
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-14 text-center">
              <h2 className="text-4xl font-bold text-gray-800">
                Welcome to KCB Reports
              </h2>
              <p className="text-gray-500 mt-4">
                Your go-to hub for smart, smooth, and powerful reporting! Get
                ready for the next big leap in education! 🚀🔥
              </p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-10"
                onClick={() => setShowSignUpStepper(true)}
              >
                Let's get started
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        // Stepper Screen
        <section className="w-full h-[85%] max-w-4xl p-8 flex gap-6 bg-white shadow-lg rounded-lg">
          {/* Step Indicator */}
          <aside className="w-1/4 bg-gray-100 p-4 rounded-lg">
            <StepIndicator />
          </aside>

          {/* Steps Content */}
          <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
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
                  Personal info
                </h1>
                <p className="text-gray-500 mt-2">
                  We’d love to know you better! Please enter your name, email,
                  and phone number.
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
                      //src={`/assets/icon-${role.title.toLowerCase()}.svg`}
                      //role={role}
                    />
                  ))}
                </div>
              </Step>

              {/* Step 3: Add-Ons */}
              <Step step={3}>
                <h1 className="text-2xl font-bold text-gray-800">
                  Pick add-ons
                </h1>
                <p className="text-gray-500 mt-2">
                  Enhance your experience with add-ons.
                </p>
                <SpecificData />
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

              {/* Step 5: Thank You */}
              <Step step={5}>
                <article className="text-center">
                  <img
                    src={`/assets/icon-thank-you.svg`}
                    alt="Thank you"
                    className="mx-auto mb-6"
                  />
                  <h1 className="text-2xl font-bold text-gray-800">
                    Thank you!
                  </h1>
                  <p className="text-gray-500 mt-2">
                    Thanks for confirming your subscription! We hope you enjoy
                    using our platform. If you ever need support, email us at{" "}
                    <a
                      href="mailto:support@loremgaming.com"
                      className="text-blue-600 underline"
                    >
                      support@loremgaming.com
                    </a>
                  </p>
                </article>
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
