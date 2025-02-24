import { useState } from "react";
import { motion } from "framer-motion"
import AddonItem from "./multi-step-form/AddonItem";
import CheckoutList from "./multi-step-form/CheckoutList";
import PersonalInfo from "./multi-step-form/PersonalInfo";
import PlanItem from "./multi-step-form/PlanItem";
import Step from "./multi-step-form/Step";
import StepIndicator from "./multi-step-form/StepIndicator";
import StepNavigation from "./multi-step-form/StepNavigation";
import { addonData, planData } from "./multi-step-form/StepProvider";
import SubscriptionTimeToggle from "./multi-step-form/SubscriptionTimeToggle";

import "~/styles/styles.css"
const Stepper = () => {
  const [ showSignUpStepper, setShowSignUpStepper] = useState(false)
  return (
    <main>
      {!showSignUpStepper && (
        <div className="h-full w-full grid place-content-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen w-full bg-gradie to-purple-600 p-6"
          >
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-14">
              <div className="mb-4 text-center">
                <h2 className="text-4xl font-bold text-gray-800">
                  Welcome to KCB Reports
                </h2>
                <p className="text-gray-500 mt-2">
                  Your go-to hub for smart, smooth, and powerful reporting! Get
                  ready for the next big leap in education! 🚀🔥 An exciting,
                  game-changing experience designed to inspire, innovate, and
                  transform. 📚✨
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-14">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {showSignUpStepper && (
        <section className="step">
          <nav>
            <StepIndicator />
          </nav>
          <Step step={1}>
            <h1>Personal info</h1>
            <p className="description">
              Please provide your name, email address, and phone number.
            </p>
            <PersonalInfo />
          </Step>

          <Step step={2}>
            <h1>Select your plan</h1>
            <p className="description">
              You have the option of monthly or yearly billing.
            </p>

            <div className="plan-selection">
              {planData.map((plan) => (
                <PlanItem
                  key={plan.title}
                  src={`/assets/icon-${plan.title.toLowerCase()}.svg`} // ✅ Fixed Path
                  plan={plan}
                />
              ))}
            </div>

            <SubscriptionTimeToggle />
          </Step>

          <Step step={3}>
            <h1>Pick add-ons</h1>
            <p className="description">
              Add-ons help enhance your gaming experience.
            </p>

            <div className="addon-selection">
              {addonData.map((addon) => (
                <AddonItem key={addon.title} addon={addon} />
              ))}
            </div>
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
                src="/assets/icon-thank-you.svg"
                alt="Thank You"
                width={80}
                height={80}
              />
              <h1>Thank you!</h1>
              <p>
                Thanks for confirming your subscription! We hope you have fun
                using our platform. If you ever need support, please feel free
                to email us at support@loremgaming.com.
              </p>
            </article>
          </Step>

          <StepNavigation />
        </section>
      )}
    </main>
  );
};

export default Stepper;
