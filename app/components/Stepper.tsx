import { useState } from "react";
import { motion } from "framer-motion";
import CheckoutList from "./multi-step-form/CheckoutList";
import PersonalInfo from "./multi-step-form/PersonalInfo";
import PlanItem from "./multi-step-form/PlanItem";
import Step from "./multi-step-form/Step";
import StepIndicator from "./multi-step-form/StepIndicator";
import StepNavigation from "./multi-step-form/StepNavigation";
import { addonData, roleList } from "./multi-step-form/StepProvider";

const Stepper = () => {
  const [showSignUpStepper, setShowSignUpStepper] = useState(false);

  return (
    <main className="max-h-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      {!showSignUpStepper && (
        <div className="h-full w-full grid place-content-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-blue-500 to-purple-600 p-6"
          >
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-14 text-center">
              <h2 className="text-4xl font-bold text-gray-800">
                Welcome to KCB Reports
              </h2>
              <p className="text-gray-500 mt-2">
                Your go-to hub for smart, smooth, and powerful reporting! Get
                ready for the next big leap in education! 🚀🔥
              </p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-14"
                onClick={() => setShowSignUpStepper(true)}
              >
                Let's get started
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showSignUpStepper && (
        <section className="w-full hh-full max-w-4xl p-8 flex flex-row gap-6">
          <nav>
            <StepIndicator />
          </nav>

          <main>
            <section className="step">
              <nav>
                <StepIndicator />
              </nav>
              {/* Personal Info */}
              <Step step={1}>
                <h1>Personal info</h1>
                <p className="description">
                  We’d love to know you better! Please enter your name, email,
                  and phone number.
                </p>

                <PersonalInfo />
              </Step>
              {/* Role Selection */}
              <Step step={2}>
                <h1>Select your role</h1>
                <p className="description">
                  Select if you are teacher, parent or admin
                </p>

                <div className="plan-selection">
                  {roleList.map((role, idx) => (
                    <PlanItem
                      key={idx}
                      src={`/assets/icon-${role.title.toLowerCase()}.svg`}
                      role={role}
                    />
                  ))}
                </div>
              </Step>
              <Step step={3}>
                <h1>Pick add-ons</h1>
                <p className="description">
                  Add-ons help enhance your gaming experience.
                </p>

              </Step>

              <Step step={4}>
                <h1>Finishing up</h1>
                <p className="description">
                  Double-check everything looks OK before confirming.
                </p>

                <CheckoutList />
              </Step>

              <Step step={5}>
                <article className="thank-you">
                  <img
                    src={`/assets/icon-thank-you.svg`}
                    alt="red check icon"
                  />
                  <h1>Thank you!</h1>
                  <p>
                    Thanks for confirming your subscription! We hope you have
                    fun using our platform. If you ever need support, please
                    feel free to email us at support@loremgaming.com.
                  </p>
                </article>
              </Step>
              <StepNavigation />
            </section>
          </main>

          <StepNavigation />
        </section>
      )}
    </main>
  );
};

export default Stepper;
